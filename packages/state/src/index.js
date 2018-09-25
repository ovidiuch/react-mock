// @flow

import { isEqual } from 'lodash';
import { Component, cloneElement } from 'react';

import type { Ref } from 'react';
import type { Props, ComponentRef } from './index.js.flow';

// NOTE: StateMock expects component.state to be an object. Can React component
// state be of a different type (eg. number of string)?
export class StateMock extends Component<Props> {
  static cosmosCaptureProps = false;
  static cosmosCaptureState = false;

  childRef: ?ComponentRef;

  render() {
    const { children } = this.props;

    // Flow users will get a static error when trying to wrap more elements with
    // StateMock. Others might bypass this limitation and find out at run time.
    if (Array.isArray(children)) {
      throw new Error('StateMock only accepts a single child element');
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
    const prevRef: ?Ref<any> = this.props.children.ref;

    this.childRef = childRef;

    if (!childRef) {
      handleRef(prevRef, childRef);

      // Nothing else to do on the unmount branch (when refs are set to NULL)
      return;
    }

    if (this.props.state) {
      // Wait until state has been set to call prev ref. This will give the
      // impression that the mocked state is the initial state.
      replaceState(childRef, this.props.state, () => {
        handleRef(prevRef, childRef);
      });
    } else {
      handleRef(prevRef, childRef);
    }
  };
}

function replaceState(childRef, state, cb) {
  // We need to unset existing state keys because React doesn't provide a
  // replaceState method (anymore)
  // https://reactjs.org/docs/react-component.html#setstate
  const nextState = resetOriginalKeys(childRef.state, state);

  if (!isEqual(nextState, childRef.state)) {
    childRef.setState(nextState, cb);
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

function handleRef(ref: ?Ref<any>, elRef: ?ComponentRef) {
  if (typeof ref === 'string') {
    throw new Error('StateMock does not support string refs');
  }

  // https://reactjs.org/docs/refs-and-the-dom.html#creating-refs
  if (typeof ref === 'function') {
    ref(elRef);
  } else if (ref && typeof ref === 'object') {
    ref.current = elRef;
  }
}
