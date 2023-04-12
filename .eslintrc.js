// eslint-disable-next-line import/extensions
const defaultConfig = require("@bigbinary/neeto-commons-frontend/configs/nanos/eslint/index.js");

defaultConfig.rules["@bigbinary/neeto/file-name-and-export-name-standards"] =
  "off";
module.exports = defaultConfig;
