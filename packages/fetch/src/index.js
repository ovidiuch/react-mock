// @flow

import { Component } from 'react';

import type { Props } from './index.js.flow';

export class FetchMock extends Component<Props> {
  render() {
    const { children } = this.props;

    return children;
  }
}
