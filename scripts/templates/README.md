# `react-mock`

[![Build](https://travis-ci.com/skidding/react-mock.svg?branch=master)](https://travis-ci.com/skidding/react-mock) [![Coverage](https://codecov.io/gh/skidding/react-mock/branch/master/graph/badge.svg)](https://codecov.io/gh/skidding/react-mock)

Declarative mocks for React state and global APIs.

## Jump to

- **[Why?](#why)**
- $PACKAGE_LINKS
- **[How to contribute](#how-to-contribute)**

## Why?

The motivation for this project comes from wanting to load any type of React component in isolation—inside automated tests as well as in component explorers such as [Cosmos](https://github.com/react-cosmos/react-cosmos) or [Storybook](https://github.com/storybooks/storybook). Some components as stateful, while others fetch data or interact with some other external input.

The aim here is to isolate _all_ components, not just presentational and stateless components.

### Declarative

Tools like [fetch-mock](http://www.wheresrhys.co.uk/fetch-mock/) and [xhr-mock](https://github.com/jameslnewell/xhr-mock) are already used by many of us in component tests. But they require imperative _setups_ and _teardowns_, which has two drawbacks:

1. They require before/after orchestration in component tests, which is tedious and can create convoluted test cases.

2. They're difficult to integrate in component explorers where a usage file is a declarative component element.

To overcome these drawbacks, `react-mock` offers mocking techniques as declarative [React elements](https://reactjs.org/docs/rendering-elements.html). Lifecycle methods take care of setting up and reverting mocks behind the hood.

### Composition

Two or more mocks can be composed into a single React element.

```js
render(
  <LocalStorageMock items={{ userId: 123 }}>
    <FetchMock matcher="/user/123" response={{ name: 'Jessica' }}>
      <StateMock state={{ show: true }}>
        <ToggleShow>
          <UserGreeting />
        </ToggleShow>
      </StateMock>
    </FetchMock>
  </LocalStorageMock>
);
```

### Limitations

- Some react-mock components mock a global API entirely, like _fetch_ or _localStorage_. For this reason only one instance of each should be rendered at once. There might be ways to compose these mocks in the future.

- To keep this codebase light, the declarative APIs mirror the params of their underlying APIs. Eg. Although they both mock server requests, the `FetchMock` API is different from the `XhrMock` API because they rely on different libs. More concise interfaces are possible, but they increase the scope of this project.

$PACKAGE_SECTIONS

$CONTRIBUTING

## License

MIT © [Ovidiu Cherecheș](https://ovidiu.ch)
