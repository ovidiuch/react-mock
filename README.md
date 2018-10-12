# `react-mock`

Declarative mocks for React state and global APIs.

## Jump to

- [Component state](#component-state)
- [Fetch requests](#fetch-requests)
- **[How to contribute](#how-to-contribute)**

## Component state

A declarative wrapper for injecting component state.

```js
import { StateMock } from '@react-mock/state';

render(
  <StateMock state={{ count: 5 }}>
    <Counter />
  </StateMock>
);
```

## Fetch requests

A declarative wrapper for the wonderful [fetch-mock](http://www.wheresrhys.co.uk/fetch-mock/).

> **Warning:** Only one FetchProxy instance should be rendered at once.

```js
import { FetchMock } from '@react-mock/fetch';

// Passing fetch-mock options
render(
  <FetchMock matcher="/login" response={401} options={{ method: 'POST' }}>
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

## How to contribute

_TODO_
