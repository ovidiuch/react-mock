// @flow

import { isEqual } from 'lodash';
import { Component, cloneElement } from 'react';

import type { Props, ComponentRef } from './index.js.flow';

export class StateMock extends Component<Props> {
  static cosmosCaptureProps = false;
  static cosmosCaptureState = false;

  childRef: ?ComponentRef;

  render() {
    const { children } = this.props;

    // Flow users will get a static error when trying to wrap more elements with
    // StateMock. Others might bypass this limitation and find out at run time.
    if (Array.isArray(children)) {
      throw new Error('ComponentState only accepts a single child element');
    }

    return cloneElement(children, { ref: this.handleRef });
  }

  componentDidUpdate(prevProps: Props) {
    const { childRef } = this;
    const { state } = this.props;

    if (!childRef) {
      throw new Error('childRef missing in StateMock.componentDidUpdate');
    }

    if (state && !isEqual(state, prevProps.state)) {
      replaceState(childRef, state);
    }
  }

  handleRef = (childRef: ?ComponentRef) => {
    const {
      children: { ref: prevRef }
    } = this.props;

    this.childRef = childRef;

    // Fulfill any previously defined ref on the child element
    // https://reactjs.org/docs/refs-and-the-dom.html#creating-refs
    if (typeof prevRef === 'function') {
      prevRef(childRef);
    } else if (prevRef && 'current' in prevRef) {
      prevRef.current = childRef;
    }

    // Nothing to do on the unmount branch (when refs are set to NULL)
    if (!childRef) {
      return;
    }

    if (this.props.state) {
      replaceState(childRef, this.props.state);
    }
  };
}

function replaceState(childRef, state) {
  // We need to unset existing state keys because React doesn't provide a
  // replaceState method (anymore)
  // https://reactjs.org/docs/react-component.html#setstate
  const nextState = resetOriginalKeys(childRef.state, state);

  if (!isEqual(nextState, childRef.state)) {
    childRef.setState(nextState);
  }
}

function resetOriginalKeys(original, current) {
  const { keys } = Object;

  return keys(original).reduce(
    (result, key) =>
      keys(result).indexOf(key) === -1
        ? { ...result, [key]: undefined }
        : result,
    current
  );
}
