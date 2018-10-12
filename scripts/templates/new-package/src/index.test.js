// @flow

import React from 'react';
import { create } from 'react-test-renderer';
import { $COMPONENT_NAME } from '.';

const MyComponent = () => 'Hello world!';

it('renders children', () => {
  const renderer = create(
    <$COMPONENT_NAME>
      <MyComponent />
    </$COMPONENT_NAME>
  );

  expect(renderer.toJSON()).toEqual(`Hello world!`);
});
