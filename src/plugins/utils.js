const { matches } = require("@bigbinary/neeto-cist");
const { any } = require("ramda");

const getImportAST = (source, importName) => ({
  type: "ImportDeclaration",
  specifiers: any(
    matches({
      type: "ImportSpecifier",
      imported: { type: "Identifier", name: importName },
    })
  ),
  source: { type: "StringLiteral", value: source },
});

const addNamedImport = ({ path, types, source, importName }) => {
  const parent = path.findParent(path => path.node.type === "Program");
  if (parent.node.body.some(matches(getImportAST(source, importName)))) return;

  parent
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
