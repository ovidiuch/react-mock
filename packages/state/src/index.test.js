// @flow

import React, { Component, createRef } from 'react';
import until from 'async-until';
import { StateMock } from '.';
import { create } from 'react-test-renderer';

class Counter extends Component<{}, { count: number }> {
  state = { count: 0 };

  render() {
    return `${this.state.count} times`;
  }
}

it('renders children', () => {
  const renderer = create(
    <StateMock>
      <Counter />
    </StateMock>
  );

  expect(renderer.toJSON()).toEqual(`0 times`);
});

it('sets state', () => {
  const renderer = create(
    <StateMock state={{ count: 5 }}>
      <Counter />
    </StateMock>
  );

  expect(renderer.toJSON()).toEqual(`5 times`);
});

it('resets state', () => {
  const renderer = create(
    <StateMock state={{}}>
      <Counter />
    </StateMock>
  );

  expect(renderer.toJSON()).toEqual(`undefined times`);
});

it('sets state on update', () => {
  const getElement = count => (
    <StateMock state={{ count }}>
      <Counter />
    </StateMock>
  );

  const renderer = create(getElement(5));
  renderer.update(getElement(10));

  expect(renderer.toJSON()).toEqual(`10 times`);
});

it('unmounts gracefully', () => {
  const renderer = create(
    <StateMock state={{ count: 5 }}>
      <Counter />
    </StateMock>
  );

  expect(() => {
    renderer.unmount();
  }).not.toThrow();
});
