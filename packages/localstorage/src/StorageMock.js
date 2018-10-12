// @flow

type Store = { [string]: mixed };

// Mocking LocalStorage (or similar) ensures no conflict with existing browser
// data and works in test environments like Jest
export class StorageMock {
  store: Store;

  constructor(store: Store) {
    this.store = { ...store };
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: { toString: () => string }) {
    this.store[key] = value.toString();
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}
