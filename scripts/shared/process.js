// @flow

import { spawn } from 'child-process-promise';
import { ROOT_PATH } from './paths';

export async function run({
  cmd,
  args,
  successMsg,
  errorMsg
}: {
  cmd: string,
  args: string[],
  successMsg: string,
  errorMsg: string
}) {
  const promise = spawn(cmd, args, {
    cwd: ROOT_PATH
  });

  const { stdout, stderr, exit } = process;
  const { childProcess } = promise;

  childProcess.stdout.on('data', data => {
    stdout.write(data);
  });

  childProcess.stderr.on('data', data => {
    stderr.write(data);
  });

  childProcess.on('close', code => {
    if (code) {
      console.error(errorMsg);
      exit(code);
    } else {
      console.log(successMsg);
    }
  });

  return promise;
}
