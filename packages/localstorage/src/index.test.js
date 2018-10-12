// @flow
/* global localStorage */

import React from 'react';
import { create } from 'react-test-renderer';
import { LocalStorageMock } from '.';

const MyComponent = () => 'Hello World!';

it('renders children', () => {
  const renderer = create(
    <LocalStorageMock items={{}}>
      <MyComponent />
    </LocalStorageMock>
  );

  expect(renderer.toJSON()).toMatch(`Hello World!`);
});

it('mocks getItem', () => {
  create(
    <LocalStorageMock items={{ displayName: 'Jessica' }}>
      <MyComponent />
    </LocalStorageMock>
  );

  expect(localStorage.getItem('displayName')).toEqual('Jessica');
});

it('mocks setItem', () => {
  create(
    <LocalStorageMock items={{ displayName: 'Jessica' }}>
      <MyComponent />
    </LocalStorageMock>
  );

  localStorage.setItem('displayName', 'Paul');

  expect(localStorage.getItem('displayName')).toEqual('Paul');
});

it('mocks removeItem', () => {
  create(
    <LocalStorageMock items={{ displayName: 'Jessica' }}>
      <MyComponent />
    </LocalStorageMock>
  );

  localStorage.removeItem('displayName');

  expect(localStorage.getItem('displayName')).toEqual(null);
});

it('reverts localStorage on unmount', () => {
  const localStorageOrig = {};
  global.localStorage = localStorageOrig;

  const wrapper = create(
    <LocalStorageMock items={{ displayName: 'Jessica' }}>
      <MyComponent />
    </LocalStorageMock>
  );
  wrapper.unmount();

  expect(global.localStorage).toBe(localStorageOrig);
});
