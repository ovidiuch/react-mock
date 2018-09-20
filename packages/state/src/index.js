// @flow

import { isEqual } from 'lodash';
import React, { Component, cloneElement } from 'react';

import type { Element, ElementRef } from 'react';

type State = Object;

// TODO: How to restrict children to stateful component, or component class at
// least?
type ComponentRef = React$Component<{}, {}>;

type Props = {
  children: Element<any>,
  state?: State
  // onChange?: State => mixed
};

// How often to check the state of the loaded component and update the fixture
// state if it changed
const REFRESH_INTERVAL = 200;

export class StateMock extends Component<Props> {
  childRef: ?ComponentRef;

  // prevState: ?State;

  timeoutId: ?TimeoutID;

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

    // TODO: Use invariant API
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
      // onChange
    } = this.props;

    this.childRef = childRef;

    // Fulfill any previously defined ref from the child element
    // TODO: Add support for React.createRef?
    // https://reactjs.org/docs/refs-and-the-dom.html#creating-refs
    if (typeof prevRef === 'function') {
      prevRef(childRef);
    }

    // Nothing to do on the unmount branch (when refs are set to NULL)
    if (!childRef) {
      return;
    }

    if (this.props.state) {
      replaceState(childRef, this.props.state);
    }

    // // XXX: Maybe should wait for replaceState to finish?
    // this.prevState = childRef.state;
    //
    // if (typeof onChange === 'function') {
    //   this.scheduleStateCheck();
    // }
  };

  // scheduleStateCheck = () => {
  //   // Is there a better way to listen to component state changes?
  //   this.timeoutId = setTimeout(this.checkState, REFRESH_INTERVAL);
  // };
  //
  // checkState = () => {
  //   const { childRef } = this;
  //   const { onChange } = this.props;
  //
  //   // TODO: Use invariant API
  //   if (!childRef) {
  //     throw new Error('childRef missing in StateMock.checkState');
  //   }
  //
  //   // TODO: Use invariant API
  //   if (typeof onChange !== 'function') {
  //     throw new Error('onChange missing in StateMock.checkState');
  //   }
  //
  //   const { state } = childRef;
  //   if (!isEqual(state, this.prevState)) {
  //     onChange(state);
  //   }
  //
  //   this.scheduleStateCheck();
  // };
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
