// @flow

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import retry from '@skidding/async-retry';
import { request } from '../../testHelpers/request';
import { XhrMock } from '..';

class MyComponent extends Component<{}, { users: Array<{ name: string }> }> {
  state = {
    users: []
  };

  async componentDidMount() {
    this.setState({
      users: JSON.parse((await request('/users')).responseText)
    });
  }

  render() {
    return this.state.users.map(user => user.name);
  }
}

it('mocks GET response', async () => {
  const renderer = create(
    <XhrMock
      url="/users"
      response={(req, res) =>
        res.body(JSON.stringify([{ name: 'Paul' }, { name: 'Jessica' }]))
      }
    >
      <MyComponent />
    </XhrMock>
  );

  await retry(() => {
    expect(renderer.toJSON()).toEqual(['Paul', 'Jessica']);
  });
});
