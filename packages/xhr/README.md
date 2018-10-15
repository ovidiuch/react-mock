## XHR requests

A declarative wrapper for the great [xhr-mock](https://github.com/jameslnewell/xhr-mock).

> **Note:** XhrMock mocks the global XMLHttpRequest API, so only one XhrMock instance should be rendered at once.

```js
import { XhrMock } from '@react-mock/xhr';

// GET
render(
  <XhrMock
    url="/users"
    response={(req, res) => res.body(JSON.stringify(users))}
  >
    <MyComponent />
  </XhrMock>
);

// POST
render(
  <XhrMock url="/login" method="POST" response={(req, res) => res.status(401)}>
    <MyComponent />
  </XhrMock>
);
```

### Multiple mocks

```js
const res = body => (req, res) => res.body(JSON.stringify(body));

render(
  <XhrMock
    mocks={[
      { url: '/users', response: res([{ id: 123 }]) },
      { url: '/user/123', response: res({ name: 'Jessica' }) }
    ]}
  >
    <MyComponent />
  </XhrMock>
);
```
