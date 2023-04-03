const { pluginTester } = require("babel-plugin-tester");
const zustandPick = require("../../plugins/zustand-pick");
const { getPositiveCases, getNegativeCases } = require("../utils");

pluginTester({
  plugin: zustandPick,
  tests: {
    ...getPositiveCases([
      "non-standard-zustand-store",
      "normal-zustand-calls",
      "non-pick-calls",
    ]),
    ...getNegativeCases([
      "array-pick",
      "empty-pick",
      "string-pick",
      "dynamic-pick",
      "dynamic-declare",
    ]),
  },
});
