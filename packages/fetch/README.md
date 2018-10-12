## Fetch requests

A declarative wrapper for the wonderful [fetch-mock](http://www.wheresrhys.co.uk/fetch-mock/).

> **Note:** FetchMock mocks the global Fetch API, so only one FetchMock instance should be rendered at once.

```js
import { FetchMock } from '@react-mock/fetch';

// Passing fetch-mock options
render(
  <FetchMock options={{ matcher: '/login', response: 401, method: 'POST' }}>
    <MyComponent />
  </FetchMock>
);

// Passing fetch-mock config
render(
  <FetchMock
    matcher="/posts"
    response={200}
    config={{ fallbackToNetwork: true }}
  >
    <MyComponent />
  </FetchMock>
);
```

Check how fetch was called using fetch-mock's [inspection methods](http://www.wheresrhys.co.uk/fetch-mock/#api-inspectionfiltering).

> **Note:** Import _fetchMock_ from `@react-mock/fetch` to ensure you're inspecting on the right fetch-mock instance.

```js
import { fetchMock } from '@react-mock/fetch';

const [, { body }] = fetchMock.lastCall('/login', 'POST');
expect(JSON.parse(body)).toEqual({ user: 'harry' });
```
