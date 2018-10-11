// @flow

import React from 'react';
import { create } from 'react-test-renderer';
import { FetchMock } from '.';

const MyComponent = () => 'Hello world!';

it('renders children', () => {
  const renderer = create(
    <FetchMock>
      <MyComponent />
    </FetchMock>
  );

  expect(renderer.toJSON()).toEqual(`Hello world!`);
});
