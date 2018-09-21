// @flow

export { bold } from 'chalk';

import { bold } from 'chalk';

export function done(text: string) {
  return `${bold.inverse.green(` DONE `)} ${text}`;
}

export function error(text: string) {
  return `${bold.inverse.red(` ERROR `)} ${text}`;
}
