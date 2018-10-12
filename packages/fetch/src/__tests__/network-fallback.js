// @flow
/* global fetch */

import React, { Component } from 'react';
import { create } from 'react-test-renderer';
import retry from '@skidding/async-retry';
import { FetchMock } from '..';

class MyComponent extends Component<{}, { errorMsg: null | string }> {
  state = {
    errorMsg: null
  };

  async componentDidMount() {
    try {
      await fetch('/comments');
    } catch (err) {
      this.setState({ errorMsg: String(err) });
    }
  }

  render() {
    return this.state.errorMsg;
  }
}

it('captures fetch-mock error on fallback', async () => {
  const renderer = create(
    <FetchMock
      matcher="/posts"
      response={200}
      config={{ fallbackToNetwork: false, warnOnFallback: false }}
    >
      <MyComponent />
    </FetchMock>
  );

  await retry(() => {
    expect(renderer.toJSON()).toMatch(
      'Error: fetch-mock: No fallback response defined for GET to /comments'
    );
  });
});

it('captures node-fetch error on fallback', async () => {
  const renderer = create(
    <FetchMock
      matcher="/posts"
      response={200}
      config={{ fallbackToNetwork: true }}
    >
      <MyComponent />
    </FetchMock>
  );

  await retry(() => {
    expect(renderer.toJSON()).toMatch(
      'TypeError: Only absolute URLs are supported'
    );
  });
});
