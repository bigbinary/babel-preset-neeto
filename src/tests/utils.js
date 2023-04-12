const fs = require("fs");
const path = require("path");

const { fromPairs } = require("ramda");

const getPositiveCases = dirName =>
  fromPairs(
    fs
      .readdirSync(path.join(dirName, "no-changes"))
      .map(key => [`No change: ${key}`, { fixture: `no-changes/${key}` }])
  );

const getNegativeCases = dirName =>
  fromPairs(
    fs.readdirSync(path.join(dirName, "transformations")).map(key => [
      `Transform: ${key}`,
      {
        fixture: `transformations/${key}/input.js`,
        outputFixture: `transformations/${key}/output.js`,
      },
    ])
  );

const getIncorrectSyntaxCases = (dirName, error) =>
  fromPairs(
    fs
      .readdirSync(path.join(dirName, "syntax-errors"))
      .map(key => [
        `Raise syntax error: ${key}`,
        { fixture: `syntax-errors/${key}`, throws: error },
      ])
  );

module.exports = {
  getNegativeCases,
  getPositiveCases,
  getIncorrectSyntaxCases,
};
