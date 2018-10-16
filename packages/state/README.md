## Component state

Inject React component state declaratively.

> `StateMock` must be the direct parent of the stateful component for the state injection to work.

```js
import { StateMock } from '@react-mock/state';

render(
  <StateMock state={{ count: 5 }}>
    <Counter />
  </StateMock>
);
```
