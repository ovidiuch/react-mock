// @flow

import { promisify } from 'util';
import _rimraf from 'rimraf';

export const rimraf = promisify(_rimraf);
