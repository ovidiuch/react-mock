// @flow
/* global fetch */

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import retry from '@skidding/async-retry';
import { FetchMock } from '..';

class MyComponent extends Component<
  {},
  { status: 'loading' | 'success' | 'error' }
> {
  state = {
    status: 'loading'
  };

  async componentDidMount() {
    try {
      const response = await fetch('/create', { method: 'POST' });

      this.setState({
        status: response.status === 200 ? 'success' : 'error'
      });
    } catch (err) {
      this.setState({
        status: 'error'
      });
    }
  }

  render() {
    return this.state.status;
  }
}

it('mocks POST 200 response', async () => {
  const renderer = create(
    <FetchMock matcher="/create" response={200} options={{ method: 'POST' }}>
      <MyComponent />
    </FetchMock>
  );

  await retry(() => {
    expect(renderer.toJSON()).toEqual('success');
  });
});

it('mocks POST 500 response', async () => {
  const renderer = create(
    <FetchMock matcher="/create" response={500} options={{ method: 'POST' }}>
      <MyComponent />
    </FetchMock>
  );

  await retry(() => {
    expect(renderer.toJSON()).toEqual('error');
  });
});
