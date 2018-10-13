// @flow
/* global XMLHttpRequest */

import React from 'react';
import { create } from 'react-test-renderer';
import { XhrMock } from '..';

it('restores global XMLHttpRequest on unmount', async () => {
  const renderer = create(
    <XhrMock url="/posts" response={(req, res) => res.status(200)}>
      <div />
    </XhrMock>
  );

  expect(XMLHttpRequest.name).toBe('MockXMLHttpRequest');

  renderer.unmount();

  expect(XMLHttpRequest).toBe(undefined);
});
