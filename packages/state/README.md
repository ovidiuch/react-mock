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

> **Warning:** StateMock delays ref calls. This means refs can get called _after_ componentDidMount, instead of before as you [might expect](https://stackoverflow.com/questions/44074747/componentdidmount-called-before-ref-callback).
