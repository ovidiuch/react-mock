# `react-mock`

[![Build](https://travis-ci.com/skidding/react-mock.svg?branch=master)](https://travis-ci.com/skidding/react-mock) [![Coverage](https://codecov.io/gh/skidding/react-mock/branch/master/graph/badge.svg)](https://codecov.io/gh/skidding/react-mock)

Declarative mocks for React state and global APIs.

## Jump to

- **[Why?](#why)**
- [Component state](#component-state)
- [Fetch requests](#fetch-requests)
- [LocalStorage](#localstorage)
- [XHR requests](#xhr-requests)
- **[How to contribute](#how-to-contribute)**

## Why?

The motivation for this project comes from wanting to load any type of React component in isolation—inside automated tests as well as in component explorers such as [Cosmos](https://github.com/react-cosmos/react-cosmos) or [Storybook](https://github.com/storybooks/storybook). Some components as stateful, while others fetch data or interact with some other external input.

The aim here is to isolate _all_ components, not just presentational and stateless components.

### Declarative

Tools like [fetch-mock](http://www.wheresrhys.co.uk/fetch-mock/) and [xhr-mock](https://github.com/jameslnewell/xhr-mock) are already used by many of us in component tests. But they require imperative _setups_ and _teardowns_, which has two drawbacks:

1. They require before/after orchestration in component tests, which is tedious and can create convoluted test cases.

2. They're difficult to integrate in component explorers where a usage file is a declarative component element.

To overcome these drawbacks, `react-mock` offers mocking techniques as declarative [React elements](https://reactjs.org/docs/rendering-elements.html).

### Limitations

- Some react-mock components mock a global API entirely, like _fetch_ or _localStorage_. For this reason only one instance of each should be rendered at once. There might be ways to compose these mocks in the future.

- To keep this codebase light, the declarative APIs mirror the params of their underlying APIs. Eg. Although they both mock server requests, the `FetchMock` API is different from the `XhrMock` API because they rely on different libs. More concise interfaces are possible, but they increase the scope of this project.

## Component state

Inject React component state declaratively.

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

## How to contribute

_TODO_

![New package](new-package.png)
