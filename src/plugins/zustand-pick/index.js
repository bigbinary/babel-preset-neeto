const { matches } = require("@bigbinary/neeto-cist");
const { last } = require("ramda");

const { PICK_GENERIC_PATTERN, PICK_STRICT_PATTERN } = require("./constants");

const { INCORRECT_ZUSTAND_PICK_USAGE } = require("../messages");
const { addNamedImport } = require("../utils");

const getPropertyAccessNode = (types, propertyPath) => {
  if (propertyPath.length === 1) {
    return types.memberExpression(
      types.identifier("store"),
      propertyPath[0],
      true
    );
  }

  return types.optionalMemberExpression(
    getPropertyAccessNode(
      types,
      propertyPath.slice(0, propertyPath.length - 1)
    ),
    last(propertyPath),
    true,
    true
  );
};

module.exports = function ({ types }) {
  return {
    name: "Zustand pick transformer",
    visitor: {
      VariableDeclaration(astPath) {
        const declaratorPath = astPath.get("declarations.0");
        const declarator = declaratorPath.node;
        if (!matches(PICK_GENERIC_PATTERN, declarator)) return;

        if (!matches(PICK_STRICT_PATTERN, astPath.node)) {
          throw astPath.buildCodeFrameError(INCORRECT_ZUSTAND_PICK_USAGE);
        }

        const [argument] = declarator.init.arguments;
        let propertyPath;
        if (argument === undefined) {
          propertyPath = [];
        } else if (["Identifier", "StringLiteral"].includes(argument.type)) {
          propertyPath = [argument];
        } else if (argument.type === "ArrayExpression") {
          propertyPath = argument.elements;
        } else return;

        const toObjectProperty = ({ key, computed }) =>
          types.objectProperty(
            key,
            getPropertyAccessNode(types, [
              ...propertyPath,
              computed ? key : types.stringLiteral(key.name),
            ]),
            computed
          );

        declarator.init = types.callExpression(
          types.identifier(declarator.init.callee.object.name),
          [
            types.arrowFunctionExpression(
              [types.identifier("store")],
              types.objectExpression(
                declarator.id.properties.map(toObjectProperty)
              )
            ),
            types.identifier("shallow"),
          ]
        );

        addNamedImport({
          path: astPath,
          types,
          source: "zustand/shallow",
          importName: "shallow",
        });
      },
      CallExpression(astPath) {
        // The variable declarator would have already transformed
        // `useStore.pick()` by the time babel runs this.
        // So no more `useStore.pick()` expressions should be seen anywhere.
        // If we still can see such usage, it means that people are using
        // `useStore.pick()` somewhere other than variable declaration.
        if (matches(PICK_GENERIC_PATTERN.init, astPath.node)) {
          throw astPath.buildCodeFrameError(INCORRECT_ZUSTAND_PICK_USAGE);
        }
      },
    },
  };
};
