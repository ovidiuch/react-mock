// @flow
/* global fetch */

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import retry from '@skidding/async-retry';
import { FetchMock, fetchMock } from '..';

class MyComponent extends Component<{}> {
  async componentDidMount() {
    await fetch('/login', {
      method: 'POST',
      body: JSON.stringify({ user: 'harry' })
    });
  }

  render() {
    return null;
  }
}

it('matches POST body', async () => {
  create(
    <FetchMock options={{ matcher: '/login', response: 200, method: 'POST' }}>
      <MyComponent />
    </FetchMock>
  );

  await retry(() => {
    const [, { body }] = fetchMock.lastCall('/login', 'POST');
    expect(JSON.parse(body)).toEqual({ user: 'harry' });
  });
});
