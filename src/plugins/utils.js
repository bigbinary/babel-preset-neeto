const { matches } = require("@bigbinary/neeto-commons-frontend/pure");

const addNamedImport = ({ path, types, source, importName }) => {
  path
    .findParent(path => path.node.type === "Program")
    .get("body.0")
    .insertBefore(
      types.importDeclaration(
        [
          types.importSpecifier(
            types.identifier(importName),
            types.identifier(importName)
          ),
        ],
        types.stringLiteral(source)
      )
    );
};

const matchesWithLength = patternArray => originalArray =>
  originalArray.length === patternArray.length &&
  matches(patternArray, originalArray);

const matchesAny = (patterns, object) =>
  patterns.some(pattern => matches(pattern, object));

module.exports = { addNamedImport, matchesWithLength, matchesAny };
