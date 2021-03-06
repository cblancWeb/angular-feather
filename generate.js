const del = require('del');
const fs = require('fs-extra');
const uppercamelcase = require('uppercamelcase');

const iconsSrcFolder = 'node_modules/feather-icons/dist/icons';
const iconsDestFolder = 'src/lib/feather';

const indexFile = 'src/lib/index.ts';

const componentTemplate = fs.readFileSync('src/templates/component.ts.tpl', 'utf-8');

return Promise.resolve()
  // delete feather folder and index
  .then(() => del([iconsDestFolder, indexFile]))
  // create destination folder
  .then(() => fs.mkdirSync(iconsDestFolder))
  .then(() => {
    fs.readdirSync(`${iconsSrcFolder}`).forEach(filename => {
      'use strict';
      const iconName = stripExtension(filename);
      const componentName = `Icon${uppercamelcase(iconName)}Component`;
      const moduleName = `Icon${uppercamelcase(iconName)}`;

      const markup = fs.readFileSync(`${iconsSrcFolder}/${filename}`);
      const payload = String(markup).match(/^<svg[^>]+?>(.+)<\/svg>$/);

      let output = componentTemplate
        .replace(/__ICON_NAME__/g, iconName)
        .replace(/__PAYLOAD__/, payload[1])
        .replace(/__COMPONENT_NAME__/g, componentName)
        .replace(/__MODULE_NAME__/g, moduleName);

      fs.writeFileSync(`${iconsDestFolder}/${iconName}.ts`, output, 'utf-8');

      fs.appendFileSync(
        indexFile,
        `export { ${moduleName} } from './feather/${iconName}';\n`
      );
    });
  })
  .catch((err) => console.log(err));


function stripExtension(str) {
  return str.substr(0, str.lastIndexOf('.'));
}
