// @flow

import { Component } from 'react';
import { StorageMock } from './StorageMock';

import type { Props } from './index.js.flow';

export class LocalStorageMock extends Component<Props> {
  _storageOrig: Object;
  _storageMock: StorageMock;

  constructor(props: Props) {
    super(props);

    const { items } = props;

    this._storageOrig = global.localStorage;
    this._storageMock = new StorageMock(items);

    setLocalStorage(this._storageMock);
  }

  componentWillUnmount() {
    // Make sure we don't clear a mock from a newer instance (since React 16
    // B.constructor is called before A.componentWillUnmount)
    if (getLocalStorage() === this._storageMock) {
      setLocalStorage(this._storageOrig);
    }
  }

  render() {
    return this.props.children;
  }
}

function getLocalStorage() {
  return getGlobalObj().localStorage;
}

function setLocalStorage(value) {
  Object.defineProperty(getGlobalObj(), 'localStorage', {
    writable: true,
    value
  });
}

function getGlobalObj() {
  // eslint-disable-next-line no-undef
  return typeof window !== 'undefined' ? window : global;
}
