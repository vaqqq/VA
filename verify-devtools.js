const fs = require('fs');
const path = require('path');

const mainFilePath = path.join(__dirname, 'src/main.ts');

const fileContent = fs.readFileSync(mainFilePath, 'utf-8');

const devToolsEnabled = /webPreferences\s*:\s*{[^}]*devTools\s*:\s*true/;

if (devToolsEnabled.test(fileContent)) {
  console.error(
    'Error: devTools is set to true. Please set it to false before making the app.'
  );
  process.exit(1);
}
