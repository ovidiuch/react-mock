// @flow

import { join } from 'path';
import cpy from 'cpy';
import { ROOT_PATH, TEST_GLOBS } from './shared/paths';
import { rimraf } from './shared/rimraf';
import { getUnnamedArgs, getBoolArg } from './shared/args';
import { run } from './shared/process';
import { done, error, bold } from './shared/print';
import { getPackages, getFormattedPackageList } from './shared/packages';

(async () => {
  try {
    const watch = getBoolArg('watch');
    const packages = await getTargetPackages();

    const verb = watch ? 'Build-watching' : 'Building';
    console.log(`${verb} packages...`);

    await Promise.all(packages.map(pkg => build({ pkg, watch })));
  } catch (err) {
    if (err instanceof InvalidPackageError) {
      console.error(error(`${bold(err.pkg)} package doesn't exist!`));
      console.error(`Packages: ${await getFormattedPackageList()}`);
      process.exit(1);
    } else {
      throw err;
    }
  }
})();

async function getTargetPackages() {
  const allPackages = await getPackages();
  const args = getUnnamedArgs();

  if (args.length === 0) {
    return allPackages;
  }

  let packages = [];
  args.forEach(arg => {
    if (typeof arg !== 'string' || allPackages.indexOf(arg) === -1) {
      throw new InvalidPackageError(arg);
    }

    packages = [...packages, arg];
  });

  return packages;
}

async function build({ pkg, watch }) {
  await clearBuild(pkg);
  await copyFlowDefs(pkg);
  await copyTsDefs(pkg);

  const pkgLabel = `@react-mock/${bold(pkg)}`;
  await run({
    cmd: 'babel',
    args: getBabelCliArgs({ pkg, watch }),
    successMsg: done(pkgLabel),
    errorMsg: error(pkgLabel)
  });
}

async function clearBuild(pkg: string) {
  await rimraf(`./packages/${pkg}/dist/**`);
}

async function copyFlowDefs(pkg) {
  return cpy('**/*.js.flow', '../dist', {
    cwd: join(ROOT_PATH, `packages/${pkg}/src`),
    parents: true
  });
}

async function copyTsDefs(pkg) {
  return cpy('**/*.d.ts', '../dist', {
    cwd: join(ROOT_PATH, `packages/${pkg}/src`),
    parents: true
  });
}

function getBabelCliArgs({ pkg, watch }) {
  let args = [
    `packages/${pkg}/src`,
    '--out-dir',
    `packages/${pkg}/dist`,
    '--ignore',
    TEST_GLOBS.join(',')
  ];

  // Show Babel output in watch mode because it's nice to get a confirmation
  // that something happened after saving a file
  if (watch) {
    return [...args, '--watch', '--verbose'];
  }

  return args;
}

function InvalidPackageError(pkg) {
  this.name = 'InvalidTargetPackage';
  this.pkg = pkg;
}
