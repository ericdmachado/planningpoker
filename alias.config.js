const path = require('path');
const moduleAlias = require('module-alias');

const alias = {
  "@engine": path.join(__dirname, "engine")
}

moduleAlias.addAliases( alias );