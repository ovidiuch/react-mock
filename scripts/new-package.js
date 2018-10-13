// @flow

import { join } from 'path';
import { startCase } from 'lodash';
import { readFile, outputFile, pathExists } from 'fs-extra';
import inquirer from 'inquirer';
import { ROOT_PATH } from './shared/paths';
import { done, error, bold } from './shared/print';
import { glob } from './shared/glob';

const TEMPLATE_PATH = join(__dirname, './templates/new-package');

(async () => {
  const { pkgName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'pkgName',
      message: `What's the package name?`,
      validate: val => val.length > 0
    }
  ]);

  if (await pathExists(getPackagePath(pkgName))) {
    console.error(error(`${bold(pkgName)} package already exists!`));
    process.exit(1);
    return;
  }

  const { pkgDesc, compName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'pkgDesc',
      message: `What's the package description?`,
      validate: val => val.length > 0
    },
    {
      type: 'input',
      name: 'compName',
      message: `What's the component name?`,
      validate: val => val.length > 0
    }
  ]);

  const pkgTitle = startCase(pkgName);

  const templateFiles = await glob('**/*', {
    cwd: TEMPLATE_PATH,
    nodir: true,
    dot: true
  });
  await Promise.all(
    templateFiles.map(async relPath => {
      const templatePath = getTemplatePath(relPath);
      const pkgPath = getPackagePath(pkgName, relPath);

      const template = await readFile(templatePath, 'utf8');
      await outputFile(
        pkgPath,
        replaceTemplateVars(template, {
          pkgName,
          pkgDesc,
          pkgTitle,
          compName
        }),
        'utf8'
      );
    })
  );

  console.error(done(`${bold(pkgName)} package created!`));
})();

function getPackagePath(pkgName, relPath = '') {
  return join(ROOT_PATH, `packages/${pkgName}`, relPath);
}

function getTemplatePath(relPath) {
  return join(TEMPLATE_PATH, relPath);
}

function replaceTemplateVars(
  template,
  { pkgName, pkgDesc, pkgTitle, compName }
) {
  return template
    .replace(/\$PACKAGE_NAME/g, pkgName)
    .replace(/\$PACKAGE_DESC/g, pkgDesc)
    .replace(/\$PACKAGE_TITLE/g, pkgTitle)
    .replace(/\$COMPONENT_NAME/g, compName);
}
