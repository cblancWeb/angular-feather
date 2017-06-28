const del = require('del');
const fs = require('fs-extra');
const uppercamelcase = require('uppercamelcase');

const iconsSrcFolder = 'node_modules/feather-icons/icons';
const iconsDestFolder = 'src/lib/feather';
const indexFile = 'src/lib/index.ts';

const componentTemplate = fs.readFileSync('src/templates/component.ts.tpl', 'utf-8');

return Promise.resolve()
  // delete feather folder and index
  .then(() => del([iconsDestFolder, indexFile]))
  // create destination folder
  .then(() => fs.mkdirSync(iconsDestFolder))
  .then(() => {
    fs.readdirSync(iconsSrcFolder).forEach(category => {
      'use strict';

      fs.mkdirSync(`${iconsDestFolder}/${category}`);

      fs.readdirSync(`${iconsSrcFolder}/${category}`).forEach(filename => {
        'use strict';
        const name = stripExtension(filename);
        const componentName = `Icon${uppercamelcase(name)}Component`;
        const output = componentTemplate
          .replace(/__NAME__/g, name)
          .replace(/__CATEGORY__/g, category)
          .replace(/__COMPONENT_NAME__/, componentName);

        fs.writeFileSync(`${iconsDestFolder}/${category}/${name}.component.ts`, output, 'utf-8');
        fs.appendFileSync(
          indexFile,
          `export { ${componentName} } from './feather/${category}/${name}.component';\n`
        );
      });

      fs.appendFileSync(indexFile, `\n`);
    });
  })
  .catch((err) => console.log(err));


function stripExtension(str) {
  return str.substr(0, str.lastIndexOf('.'));
}