// @flow
/* global fetch */

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import retry from '@skidding/async-retry';
import { FetchMock } from '..';

class MyComponent extends Component<{}, { name: null | string }> {
  state = {
    name: null
  };

  async componentDidMount() {
    const users = await (await fetch('/users')).json();
    const { name } = await (await fetch(`/user/${users[0].id}`)).json();

    this.setState({
      name
    });
  }

  render() {
    return this.state.name;
  }
}

it('mocks GET response', async () => {
  const renderer = create(
    <FetchMock
      mocks={[
        { matcher: '/users', response: [{ id: 123 }] },
        { matcher: '/user/123', response: { name: 'Jessica' } }
      ]}
    >
      <MyComponent />
    </FetchMock>
  );

  await retry(() => {
    expect(renderer.toJSON()).toEqual('Jessica');
  });
});
