// @flow
/* global fetch */

import React from 'react';
import { create } from 'react-test-renderer';
import nodeFetch from 'node-fetch';
import { FetchMock } from '..';

it('restores global fetch on unmount', async () => {
  const renderer = create(
    <FetchMock matcher="/posts" response={200}>
      <div />
    </FetchMock>
  );

  renderer.unmount();

  expect(fetch).toEqual(nodeFetch);
});
