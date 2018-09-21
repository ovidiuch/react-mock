// @flow

import { argv } from 'yargs';

type Arg = true | number | string;

export function getNamedArg(name: string): void | Arg {
  return argv[name];
}

export function getBoolArg(name: string): boolean {
  return getNamedArg(name) === true;
}

export function getUnnamedArgs(): Arg[] {
  let args = [];
  let arg = getUnnamedArg(0);

  while (typeof arg !== 'undefined') {
    args = [...args, arg];
    arg = getUnnamedArg(args.length);
  }

  return args;
}

function getUnnamedArg(index: number = 0): void | Arg {
  return argv._[index];
}
