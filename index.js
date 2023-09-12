const zustandPick = require("./src/plugins/zustand-pick");
const zustandPickFrom = require("./src/plugins/zustand-pick-from");

module.exports = () => ({
  plugins: [zustandPick, zustandPickFrom],
});
