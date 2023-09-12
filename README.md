# babel-preset-neeto

A babel transformer to minimize boilerplate code in neeto products.

## Usage

babel-preset-neeto is designed in an assumption that it will be run before all
other presets or plugins. To make that possible, you need to add
`@bigbinary/neeto` towards the end of your `presets` array in `babel.config.js`
as shown below. Babel presets will run in last-to-first order.

```js
module.exports = {
  presets: [
    // ...all other presets
    "@bigbinary/neeto",
  ];
}
```

Babel runs the plugins before presets. But usually plugins do minor code
transformations which won't affect babel-preset-neeto. But if any of them
interfere with babel-preset-neeto, add plugins directly to the top of the
`plugins` array as shown below. Babel plugins are run in first-to-last order.

```js
const zustandPickPlugin = require("@bigbinary/babel-preset-neeto/src/plugins/zustand-pick");
const anyOtherPluginFromNeeto = require("@bigbinary/babel-preset-neeto/src/plugins/other-plugin-name");

module.exports = {
  plugins: [
    zustandPickPlugin,
    anyOtherPluginFromNeeto,
    // ...all your plugins
  ],
  presets: [
    // ...all your presets
  ];
}
```

## Available plugins

- [zustand-pick](https://github.com/bigbinary/babel-preset-neeto/blob/main/docs/zustand-pick.md)

## Other links

- [Development instructions](./docs/development-instructions.md)
- [References and learning materials](./docs/references.md)
