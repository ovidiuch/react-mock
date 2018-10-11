// @flow

import { Component } from 'react';
import fetchMock from 'fetch-mock';

import type { Props } from './index.js.flow';

export class FetchMock extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.mock();
  }

  render() {
    return this.props.children;
  }

  componentWillUnmount() {
    // Make sure we don't clear a mock from a newer instance (since React 16
    // B.constructor is called before A.componentWillUnmount)
    if (fetchMock.__prevProxy === this) {
      this.unmock();
    }
  }

  mock() {
    // Clear mocks from a previous FetchMock instance
    // Warning: A page can only have one FetchProxy instance at the same time
    this.unmock();

    const { matcher, response, options } = this.props;
    fetchMock.mock(matcher, response, options);

    // Allow unmocked requests to fall through
    fetchMock.catch((...args) => fetchMock.realFetch.apply(global, args));

    fetchMock.__prevProxy = this;
  }

  unmock() {
    fetchMock.reset();
    delete fetchMock.__prevProxy;
  }
}
