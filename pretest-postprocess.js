const fs = require('fs');
const {EOL} = require('os');
const {join} = require('path');

const root = join(__dirname, 'test');

for (const type of ['legacy', 'new', 'typescript']) {
  const path = join(root, `Test.${type}.js`);
  let contents = fs.readFileSync(path, 'utf8');

  contents = `const TEST_TYPE = '${type}';${EOL}${EOL}${contents}`;

  fs.writeFileSync(path, contents);
}
