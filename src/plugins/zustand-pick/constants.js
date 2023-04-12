const { matches } = require("@bigbinary/neeto-commons-frontend/pure");
const { test, isEmpty, mergeDeepLeft, all, includes, __ } = require("ramda");

const { matchesWithLength } = require("../utils");

const VALID_ARRAY_ELEMENT_TYPES = [
  "StringLiteral",
  "Identifier",
  "NumericLiteral",
  "BooleanLiteral",
];

const VALID_PICK_ARGUMENT_TYPES = [
  "StringLiteral",
  "Identifier",
  "ArrayExpression",
];

const VALID_PICK_ARGUMENT = {
  type: includes(__, VALID_PICK_ARGUMENT_TYPES),
  elements: (elements, root) =>
    root.type !== "ArrayExpression" ||
    elements.every(({ type }) => VALID_ARRAY_ELEMENT_TYPES.includes(type)),
};

const PICK_GENERIC_PATTERN = {
  type: "VariableDeclarator",
  init: {
    type: "CallExpression",
    callee: {
      type: "MemberExpression",
      computed: false,
      object: {
        type: "Identifier",
        name: test(/^use[a-zA-Z0-9]+Store$/),
      },
      property: {
        type: "Identifier",
        name: "pick",
      },
    },
  },
};

const PICK_STRICT_PATTERN = {
  type: "VariableDeclaration",
  kind: "const",
  declarations: matchesWithLength([
    mergeDeepLeft(
      {
        id: {
          type: "ObjectPattern",
          properties: all(
            matches({
              type: "ObjectProperty",
              method: false,
              value: { type: "Identifier" },
            })
          ),
        },
        init: {
          arguments: args =>
            isEmpty(args) ||
            (args.length === 1 && matches(VALID_PICK_ARGUMENT, args[0])),
        },
      },
      PICK_GENERIC_PATTERN
    ),
  ]),
};

module.exports = {
  PICK_GENERIC_PATTERN,
  PICK_STRICT_PATTERN,
};
