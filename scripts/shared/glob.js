// @flow

import { promisify } from 'util';
import _glob from 'glob';

export const glob = promisify(_glob);
