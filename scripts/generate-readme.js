// @flow

import { join } from 'path';
import { sortBy } from 'lodash';
import { readFile, writeFile } from 'fs-extra';
import { ROOT_PATH } from './shared/paths';
import { getPackages } from './shared/packages';

const TEMPLATE_PATH = join(__dirname, './templates/README.md');
const OUTPUT_PATH = join(__dirname, '../README.md');

(async () => {
  const packages = await getPackages();

  let pkgReadmes = {};
  await Promise.all(
    packages.map(async pkg => {
      const pkgReadme = await readPackageReadme(pkg);

      pkgReadmes = {
        ...pkgReadmes,
        [pkg]: pkgReadme
      };
    })
  );

  await writeMainReadme({ pkgReadmes });
})();

async function readPackageReadme(pkg) {
  const p = join(ROOT_PATH, `packages/${pkg}/README.md`);

  return readFile(p, 'utf8');
}

async function writeMainReadme({ pkgReadmes }) {
  // Ensure `state` is first and sort the rest alphabetically
  const pkgNames = sortBy(
    Object.keys(pkgReadmes),
    p => (p === 'state' ? '' : p)
  );

  let packageSections = [];
  let packageLinks = [];

  pkgNames.forEach(pkg => {
    packageSections = [...packageSections, pkgReadmes[pkg]];
    packageLinks = [...packageLinks, getLinkFromPkgReadme(pkgReadmes[pkg])];
  });

  const template = await readFile(TEMPLATE_PATH, 'utf8');
  const output = template
    .replace(/\$PACKAGE_LINKS\n/g, packageLinks.map(l => `- ${l}`).join(`\n`))
    .replace(/\$PACKAGE_SECTIONS\n/g, packageSections.join(`\n`));

  await writeFile(OUTPUT_PATH, output, 'utf8');
}

function getLinkFromPkgReadme(pkgReadme) {
  const title = pkgReadme.split(`\n`)[0].replace(/^#+ (.+)$/, '$1');

  return `[${title}](#${title.toLowerCase().replace(/\s+/g, '-')})`;
}
