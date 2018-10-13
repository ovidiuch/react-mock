// @flow

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import retry from '@skidding/async-retry';
import { request } from '../../testHelpers/request';
import { XhrMock } from '..';

class MyComponent extends Component<
  {},
  { status: 'loading' | 'success' | 'error' }
> {
  state = {
    status: 'loading'
  };

  async componentDidMount() {
    const xhr = await request('/create', { method: 'POST' });

    this.setState({
      status: xhr.status === 200 ? 'success' : 'error'
    });
  }

  render() {
    return this.state.status;
  }
}

it('mocks POST 200 response', async () => {
  const renderer = create(
    <XhrMock
      url="/create"
      method="POST"
      response={(req, res) => res.status(200)}
    >
      <MyComponent />
    </XhrMock>
  );

  await retry(() => {
    expect(renderer.toJSON()).toEqual('success');
  });
});

it('mocks POST 500 response', async () => {
  const renderer = create(
    <XhrMock
      url="/create"
      method="POST"
      response={(req, res) => res.status(500)}
    >
      <MyComponent />
    </XhrMock>
  );

  await retry(() => {
    expect(renderer.toJSON()).toEqual('error');
  });
});
