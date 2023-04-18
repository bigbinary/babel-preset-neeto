# babel-preset-neeto

A babel transformer to minimize boilerplate code in neeto products.

## Available plugins

- [zustand-pick](./docs/zustand-pick.md)

## Development instructions

- We don't use bundling as of now in this repo. All newly added plugins should
  be exported from `index.js` in the repo's root folder to access it from host
  projects. Also, use CJS `require` style for importing functions & other
  elements.
- Make sure to add names for all newly added plugins. See
  [this example](https://github.com/bigbinary/babel-preset-neeto/blob/f3f545493081473194c9187ea2493339a1ab3480/src/plugins/zustand-pick/index.js)
- The plugins should be designed in a fail-fast way. It should throw syntax
  errors rather than fail at runtime for invalid usages. That is, if some
  proposed syntax is used in an invalid way, it should not be ignored. Refer
  [to this example](https://github.com/bigbinary/babel-preset-neeto/blob/f3f545493081473194c9187ea2493339a1ab3480/src/plugins/zustand-pick/index.js)
- All the plugins should reside directly under `src/plugins` folder. It can
  either be a file or a folder with `index.js`. The name of file/folder should
  be kebab-cased to improve readability.
- All syntax error messages should reside inside `src/plugins/messages.js` file.
  It should show a shortened link to the documentation of the failing plugin.
- For each plugin, there should be a documentation file inside `docs` folder.
  The documentation should be an `.md` file with the same name as the plugin
  (kebab-cased). The doc should mention these things:

  - The motivation behind introducing the new syntax
  - Allowed syntaxes
  - Possible incorrect usages (Disallowed syntaxes)

  While writing the doc, it should be kept as simple as possible. The readers
  are general React developers and not Babel plugin developers. No need to
  expose project-specific technical aspects to them in the plugin doc.

- Every transformation plugin should have detailed tests associated with it. It
  should cover all possible positive and negative test cases. We can specify an
  input file and an output file. When the input is transformed, it should
  generate the output code. Here is how tests can be written:
  - We use the library `babel-plugin-tester` for simplifying tests
  - Tests are classified into three categories.
    - transformations: we specify `input.js` and `output.js` for all allowed
      syntaxes.
    - no-changes: we specify cases where we won't make any changes even though
      the code is similar to the allowed syntax.
    - syntax-errors: all possible cases where we raise errors. This should cover
      all invalid usages of our proposed syntax.
  - A test will have its own folder under `src/tests` folder (with plugin name
    kebab-cased). It will contain 3 folders for fixtures (input/output file for
    each category of the test) and a spec file (also named the same as the
    plugin in kebab-case).
    - `no-changes` and `syntax-error` will have several possible cases inside
      them. Each case will be a separate JS file (with a brief kebab-cased
      description for the test case as the file name).
    - `transformations` folder will contain sub-folders for each test case. The
      folder name will be a brief description of the test case. Each subfolder
      will contain two files `input.js` and `output.js`. When Babel transforms
      the `input.js` file, the result should be identical to `output.js`
      (including white spaces).
    - Refer `src/tests/zustand-pick` folder for an example.
    - We can copy and paste the boilerplate from
      `src/tests/zustand-pick/zustand-pick.spec.js` for other tests as well for
      now. We can add a utility function later. You can run the tests using
      `yarn test` command.

## References

- Learning material:
  https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md
