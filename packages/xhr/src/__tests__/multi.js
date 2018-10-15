// @flow

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import retry from '@skidding/async-retry';
import { request } from '../../testHelpers/request';
import { XhrMock } from '..';

class MyComponent extends Component<{}, { name: null | string }> {
  state = {
    name: null
  };

  async componentDidMount() {
    const users = JSON.parse((await request('/users')).responseText);
    const { name } = JSON.parse(
      (await request(`/user/${users[0].id}`)).responseText
    );

    this.setState({
      name
    });
  }

  render() {
    return this.state.name;
  }
}

it('mocks multi GET responses', async () => {
  const res = body => (req, res) => res.body(JSON.stringify(body));

  const renderer = create(
    <XhrMock
      mocks={[
        { url: '/users', response: res([{ id: 123 }]) },
        { url: '/user/123', response: res({ name: 'Jessica' }) }
      ]}
    >
      <MyComponent />
    </XhrMock>
  );

  await retry(() => {
    expect(renderer.toJSON()).toEqual('Jessica');
  });
});
