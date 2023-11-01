const { matches } = require("@bigbinary/neeto-cist");
const { last } = require("ramda");

const {
  PICK_FROM_GENERIC_PATTERN,
  PICK_FROM_STRICT_PATTERN,
} = require("./constants");

const { INCORRECT_ZUSTAND_PICK_FROM_USAGE } = require("../messages");

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
    name: "Zustand pick-from transformer",
    visitor: {
      VariableDeclaration(astPath) {
        const declaratorPath = astPath.get("declarations.0");
        const declarator = declaratorPath.node;
        if (!matches(PICK_FROM_GENERIC_PATTERN, declarator)) return;

        if (!matches(PICK_FROM_STRICT_PATTERN, astPath.node)) {
          throw astPath.buildCodeFrameError(INCORRECT_ZUSTAND_PICK_FROM_USAGE);
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

        declarator.init = types.callExpression(
          types.identifier(declarator.init.callee.object.name),
          [
            types.arrowFunctionExpression(
              [types.identifier("store")],
              getPropertyAccessNode(types, [
                ...propertyPath,
                types.stringLiteral(declarator.id.name),
              ])
            ),
          ]
        );
      },
      CallExpression(astPath) {
        if (matches(PICK_FROM_GENERIC_PATTERN.init, astPath.node)) {
          throw astPath.buildCodeFrameError(INCORRECT_ZUSTAND_PICK_FROM_USAGE);
        }
      },
    },
  };
};
