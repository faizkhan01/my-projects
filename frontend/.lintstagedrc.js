const path = require('path');

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

module.exports = {
  '*.{js,jsx,ts,tsx,md,html,css}': 'prettier --write',
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
};
