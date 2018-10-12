// @flow
/* global fetch */

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import nodeFetch from 'node-fetch';
import { FetchMock } from '..';

class MyComponent extends Component<{}, { errorMsg: null | string }> {
  state = {
    errorMsg: null
  };

  async componentDidMount() {
    try {
      await fetch('/posts');
    } catch (err) {
      this.setState({ errorMsg: String(err) });
    }
  }

  render() {
    return this.state.errorMsg;
  }
}

it('restores global fetch on unmount', async () => {
  const renderer = create(
    <FetchMock matcher="/posts" response={200}>
      <MyComponent />
    </FetchMock>
  );

  renderer.unmount();

  expect(fetch).toEqual(nodeFetch);
});
