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

module.exports = { addNamedImport };
