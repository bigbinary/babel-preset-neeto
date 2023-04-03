const { test } = require("ramda");

const DECLARATOR_PATTERN = {
  id: { type: "ObjectPattern" },
  init: {
    type: "CallExpression",
    callee: {
      type: "MemberExpression",
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

module.exports = {
  DECLARATOR_PATTERN,
};
