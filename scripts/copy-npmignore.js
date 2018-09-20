// @flow

import { join } from 'path';
import { readFile, writeFile } from 'fs-extra';
import { getPackages } from './shared/packages';

const TEMPLATE_PATH = join(__dirname, './templates/.npmignore');

(async () => {
  const packages = await getPackages();
  const template = await readFile(TEMPLATE_PATH, 'utf8');

  await Promise.all(
    packages.map(async pkg => {
      const targetPath = getTargetPath(pkg);
      await writeFile(targetPath, template, 'utf8');
    })
  );
})();

function getTargetPath(pkg) {
  return join(__dirname, `../packages/${pkg}/.npmignore`);
}
