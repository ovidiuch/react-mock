// @flow

import { basename } from 'path';
import { glob } from './glob';
import { ROOT_PATH } from './paths';

export async function getPackages(): Promise<string[]> {
  return (await glob('packages/*/', { cwd: ROOT_PATH })).map(f => basename(f));
}

export async function getFormattedPackageList() {
  return ['', ...(await getPackages())].join('\n - ');
}
