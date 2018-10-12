// @flow

import { join } from 'path';
import { readFile, writeFile, pathExists } from 'fs-extra';
import { ROOT_PATH } from './shared/paths';
import { getPackages } from './shared/packages';

const TEMPLATE_PATH = join(__dirname, './templates/.npmignore');

(async () => {
  const packages = await getPackages();
  const template = await readFile(TEMPLATE_PATH, 'utf8');

  await Promise.all(
    packages.map(async pkg => {
      const targetPath = getTargetPath(pkg);

      if (!(await pathExists(targetPath))) {
        await writeFile(targetPath, template, 'utf8');
      }
    })
  );
})();

function getTargetPath(pkg) {
  return join(ROOT_PATH, `packages/${pkg}/.npmignore`);
}
