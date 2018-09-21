// @flow

import React, { Component, createRef } from 'react';
import { create } from 'react-test-renderer';
import { StateMock } from '.';

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

it('preserves ref fn', () => {
  const ref = jest.fn();
  create(
    <StateMock>
      <Counter ref={ref} />
    </StateMock>
  );

  expect(ref).toBeCalledWith(expect.any(Counter));
});

it('preserves ref obj', () => {
  const ref = createRef();
  create(
    <StateMock>
      <Counter ref={ref} />
    </StateMock>
  );

  expect(ref.current).toEqual(expect.any(Counter));
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
