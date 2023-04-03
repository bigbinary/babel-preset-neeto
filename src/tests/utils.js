const { fromPairs } = require("ramda");

const getPositiveCases = keys =>
  fromPairs(
    keys.map(key => [`No change: ${key}`, { fixture: `no-changes/${key}.js` }])
  );

const getNegativeCases = keys =>
  fromPairs(
    keys.map(key => [
      `Transform: ${key}`,
      { fixture: `${key}/input.js`, outputFixture: `${key}/output.js` },
    ])
  );

module.exports = {
  getNegativeCases,
  getPositiveCases,
};
