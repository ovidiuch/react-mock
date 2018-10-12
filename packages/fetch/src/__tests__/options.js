// @flow
/* global fetch */

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import retry from '@skidding/async-retry';
import { FetchMock } from '..';

class MyComponent extends Component<{}, { users: Array<{ name: string }> }> {
  state = {
    users: []
  };

  async componentDidMount() {
    this.setState({
      users: await (await fetch('/users')).json()
    });
  }

  render() {
    return this.state.users.map(user => user.name);
  }
}

it('mocks GET response', async () => {
  const renderer = create(
    <FetchMock
      options={{
        matcher: '/users',
        method: 'GET',
        response: [{ name: 'Paul' }, { name: 'Jessica' }]
      }}
    >
      <MyComponent />
    </FetchMock>
  );

  await retry(() => {
    expect(renderer.toJSON()).toEqual(['Paul', 'Jessica']);
  });
});
