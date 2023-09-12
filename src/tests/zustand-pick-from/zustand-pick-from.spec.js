const { pluginTester } = require("babel-plugin-tester");

const { INCORRECT_ZUSTAND_PICK_FROM_USAGE } = require("../../plugins/messages");
const zustandPickFrom = require("../../plugins/zustand-pick-from");
const {
  getPositiveCases,
  getNegativeCases,
  getIncorrectSyntaxCases,
} = require("../utils");

pluginTester({
  plugin: zustandPickFrom,
  tests: {
    ...getPositiveCases(__dirname),
    ...getIncorrectSyntaxCases(__dirname, INCORRECT_ZUSTAND_PICK_FROM_USAGE),
    ...getNegativeCases(__dirname),
  },
});
