const { pluginTester } = require("babel-plugin-tester");

const { INCORRECT_ZUSTAND_PICK_USAGE } = require("../../plugins/messages");
const zustandPick = require("../../plugins/zustand-pick");
const {
  getPositiveCases,
  getNegativeCases,
  getIncorrectSyntaxCases,
} = require("../utils");

pluginTester({
  plugin: zustandPick,
  tests: {
    ...getPositiveCases(__dirname),
    ...getIncorrectSyntaxCases(__dirname, INCORRECT_ZUSTAND_PICK_USAGE),
    ...getNegativeCases(__dirname),
  },
});
