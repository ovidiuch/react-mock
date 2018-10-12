// @flow

import { join } from 'path';
import { kebabCase, sortBy } from 'lodash';
import { readFile, writeFile } from 'fs-extra';
import { ROOT_PATH } from './shared/paths';
import { getPackages } from './shared/packages';

const TEMPLATE_PATH = join(__dirname, './templates/README.md');
const OUTPUT_PATH = join(__dirname, '../README.md');

(async () => {
  const packages = await getPackages();
  // Ensure state is first
  const sortedPackages = sortBy(packages, p => (p === 'state' ? -1 : 1));

  let packageLinks = [];
  let packageSections = [];

  await Promise.all(
    sortedPackages.map(async pkg => {
      const pkgReadme = await readPackageReadme(pkg);

      packageSections = [...packageSections, pkgReadme];
      packageLinks = [...packageLinks, getLinkFromPkgReadme(pkgReadme)];
    })
  );

  await writeMainReadme({ packageLinks, packageSections });
})();

async function readPackageReadme(pkg) {
  const p = join(ROOT_PATH, `packages/${pkg}/README.md`);

  return readFile(p, 'utf8');
}

async function writeMainReadme({ packageLinks, packageSections }) {
  const template = await readFile(TEMPLATE_PATH, 'utf8');
  const output = template
    .replace(/\$PACKAGE_LINKS\n/g, packageLinks.map(l => `- ${l}`).join(`\n`))
    .replace(/\$PACKAGE_SECTIONS\n/g, packageSections.join(`\n`));

  await writeFile(OUTPUT_PATH, output, 'utf8');
}

function getLinkFromPkgReadme(pkgReadme) {
  const title = pkgReadme.split(`\n`)[0].replace(/^#+ (.+)$/, '$1');

  return `[${title}](#${kebabCase(title)})`;
}
