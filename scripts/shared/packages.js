// @flow

import { basename } from 'path';
import { glob } from './glob';

export async function getPackages(): Promise<string[]> {
  return (await glob('./packages/*/')).map(f => basename(f));
}
