const fs = require('node:fs');
const path = require('node:path');

const source = path.join(__dirname, '..', 'public');
const output = path.join(__dirname, '..', 'dist');

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js']) {
  fs.copyFileSync(path.join(source, file), path.join(output, file));
}
console.log(`Built static site in ${output}`);
