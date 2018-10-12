## LocalStorage

Mock LocalStorage data declaratively.

> **Note:** LocalStorageMock mocks the global localStorage API, so only one LocalStorageMock instance should be rendered at once.

```js
import { LocalStorageMock } from '@react-mock/localstorage';

render(
  <LocalStorageMock items={{ sessionId: 're4lt0k3n' }}>
    <MyComponent />
  </LocalStorageMock>
);
```
