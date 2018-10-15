// @flow

import { Component } from 'react';
import fetchMock from 'fetch-mock';

import type { Props } from './index.js.flow';

// Allow consumers to run assertions on the same instance of fetchMock
export { default as fetchMock } from 'fetch-mock';

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
    if (fetchMock.__fetchMockInst === this) {
      this.unmock();
    }
  }

  mock() {
    // Clear mocks from a previous FetchMock instance
    // NOTE: The last rendered FetchProxy instance will override mocks from
    // the previous ones
    this.unmock();

    const { props } = this;
    const { config } = props;

    if (config) {
      Object.keys(config).forEach(key => {
        fetchMock.config[key] = config[key];
      });
    }

    if (props.mocks) {
      props.mocks.forEach(options => {
        fetchMock.mock(options);
      });
    } else if (props.matcher) {
      fetchMock.mock(props.matcher, props.response, props.options);
    } else if (props.options) {
      // NOTE: We shouldn't check `props.options` at this point, but for some
      // reason Flow doesn't get it.
      fetchMock.mock(props.options);
    }

    fetchMock.__fetchMockInst = this;
  }

  unmock() {
    if (typeof fetchMock.restore === 'function') {
      fetchMock.restore();
      delete fetchMock.__fetchMockInst;
    }
  }
}
