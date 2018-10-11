// @flow

import React from 'react';
import { create } from 'react-test-renderer';
import { MyPackageMock } from '.';

const MyComponent = () => 'Hello world!';

it('renders children', () => {
  const renderer = create(
    <MyPackageMock>
      <MyComponent />
    </MyPackageMock>
  );

  expect(renderer.toJSON()).toEqual(`Hello world!`);
});
