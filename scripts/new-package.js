// @flow

import { join } from 'path';
import { capitalize, camelCase } from 'lodash';
import { readFile, outputFile, pathExists } from 'fs-extra';
import inquirer from 'inquirer';
import { ROOT_PATH } from './shared/paths';
import { done, error, bold } from './shared/print';

(async () => {
  const pkgJson = await getTemplate('package.json');
  const indexTemplate = await getTemplate('new-package/index.js');
  const flowTemplate = await getTemplate('new-package/index.js.flow');
  const testTemplate = await getTemplate('new-package/index.test.js');

  const { pkgName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'pkgName',
      message: `What's the package name?`
    }
  ]);

  if (await pathExists(getPackagePath(pkgName))) {
    console.error(error(`${bold(pkgName)} package already exists!`));
    process.exit(1);
    return;
  }

  const { pkgDescription } = await inquirer.prompt([
    {
      type: 'input',
      name: 'pkgDescription',
      message: `What's the package description?`
    }
  ]);

  await createFile(
    pkgName,
    'package.json',
    genPackageJson(pkgJson, { pkgName, pkgDescription })
  );
  await createFile(
    pkgName,
    'src/index.js',
    genSourceFile(indexTemplate, { pkgName })
  );
  await createFile(
    pkgName,
    'src/index.js.flow',
    genSourceFile(flowTemplate, { pkgName })
  );
  await createFile(
    pkgName,
    'src/index.test.js',
    genSourceFile(testTemplate, { pkgName })
  );

  console.error(done(`${bold(pkgName)} package created!`));
})();

function getPackagePath(pkgName, relPath = '') {
  return join(ROOT_PATH, `packages/${pkgName}`, relPath);
}

function getTemplatePath(template) {
  return join(__dirname, `templates`, template);
}

async function getTemplate(path) {
  return readFile(getTemplatePath(path), 'utf8');
}

async function createFile(pkgName, relPath, contents) {
  return outputFile(getPackagePath(pkgName, relPath), contents, 'utf8');
}

function genPackageJson(template, { pkgName, pkgDescription }) {
  return template
    .replace('$PACKAGE_NAME', pkgName)
    .replace('$PACKAGE_DESC', pkgDescription);
}

function genSourceFile(template, { pkgName }) {
  return template.replace(
    /MyPackageMock/g,
    `${capitalize(camelCase(pkgName))}Mock`
  );
}
