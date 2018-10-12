// @flow

import { Component } from 'react';

import type { Props } from './index.js.flow';

export class MyPackageMock extends Component<Props> {
  render() {
    return this.props.children;
  }
}
