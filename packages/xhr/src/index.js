// @flow

import { Component } from 'react';
import xhrMock from 'xhr-mock';

import type { Props } from './index.js.flow';

export class XhrMock extends Component<Props> {
  static defaultProps = {
    method: 'GET'
  };

  constructor(props: Props) {
    super(props);

    // Context: https://github.com/react-cosmos/react-cosmos/issues/430
    // $FlowFixMe
    if (module.hot) {
      module.hot.status(status => {
        if (status === 'check') {
          xhrMock.teardown();
        }
      });
    }

    this.mock();
  }

  render() {
    return this.props.children;
  }

  componentWillUnmount() {
    // Make sure we don't clear a mock from a newer instance (since React 16
    // B.constructor is called before A.componentWillUnmount)
    if (xhrMock.__xhrMockInst === this) {
      this.unmock();
    }
  }

  mock() {
    // Clear mocks from a previous XhrMock instance
    // NOTE: The last rendered XhrProxy instance will override mocks from
    // the previous ones
    this.unmock();

    const { method, url, response } = this.props;

    xhrMock.setup();
    xhrMock.use(method, url, response);

    xhrMock.__xhrMockInst = this;
  }

  unmock() {
    xhrMock.teardown();
  }
}
