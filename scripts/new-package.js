// @flow

import { join } from 'path';
import { readFile, outputFile, pathExists } from 'fs-extra';
import inquirer from 'inquirer';
import { ROOT_PATH } from './shared/paths';
import { done, error, bold } from './shared/print';

const PKG_TEMPLATE_PATH = join(__dirname, './templates/package.json');
const EMPTY_SOURCE_FILE = `// @flow\n`;

(async () => {
  const template = await readFile(PKG_TEMPLATE_PATH, 'utf8');
  const { name } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: `What's the package name?`
    }
  ]);

  if (await pathExists(getPackagePath(name))) {
    console.error(error(`${bold(name)} package already exists!`));
    process.exit(1);
    return;
  }

  const { description } = await inquirer.prompt([
    {
      type: 'input',
      name: 'description',
      message: `What's the package description?`
    }
  ]);

  await createFile(
    name,
    'package.json',
    getPackageFile(template, { name, description })
  );
  await createFile(name, 'src/index.js', EMPTY_SOURCE_FILE);
  await createFile(name, 'src/index.js.flow', EMPTY_SOURCE_FILE);
  await createFile(name, 'src/index.test.js', EMPTY_SOURCE_FILE);

  console.error(done(`${bold(name)} package created!`));
})();

function getPackagePath(pkg, relPath = '') {
  return join(ROOT_PATH, `packages/${pkg}`, relPath);
}

async function createFile(pkg, relPath, contents) {
  return outputFile(getPackagePath(pkg, relPath), contents, 'utf8');
}

function getPackageFile(template, { name, description }) {
  return template
    .replace('$PACKAGE_NAME', name)
    .replace('$PACKAGE_DESC', description);
}
