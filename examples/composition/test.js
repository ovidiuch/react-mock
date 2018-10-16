// @flow
/* global localStorage, fetch */

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import retry from '@skidding/async-retry';
import { StateMock } from '@react-mock/state';
import { FetchMock } from '@react-mock/fetch';
import { LocalStorageMock } from '@react-mock/localstorage';

import type { Node } from 'react';

class ToggleShow extends Component<{ children: Node }, { show: boolean }> {
  state = {
    show: false
  };

  render() {
    return this.state.show && this.props.children;
  }
}

class UserGreeting extends Component<{}, { name: string }> {
  state = {
    name: 'Guest'
  };

  async componentDidMount() {
    const userId = localStorage.getItem('userId');
    const { name } = await (await fetch(`/user/${String(userId)}`)).json();

    this.setState({
      name
    });
  }

  render() {
    return `Hello ${this.state.name}!`;
  }
}

it('composes mocks', async () => {
  const renderer = create(
    <LocalStorageMock items={{ userId: 123 }}>
      <FetchMock matcher="/user/123" response={{ name: 'Jessica' }}>
        <StateMock state={{ show: true }}>
          <ToggleShow>
            <UserGreeting />
          </ToggleShow>
        </StateMock>
      </FetchMock>
    </LocalStorageMock>
  );

  await retry(() => {
    expect(renderer.toJSON()).toEqual('Hello Jessica!');
  });
});
