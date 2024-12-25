/**
 * NOTE: This Navigation helper is useful when you want to navigate from anywhere
 * You can use this in that case
 */
// --------------- LIBRARIES ---------------
import * as React from 'react';
import {CommonActions, StackActions} from '@react-navigation/native';

// Create navigation ref
export const navigationRef = React.createRef();

/**
 * Navigation to given screen
 * @param {String} name - name of screen/route
 * @param {Object} params - params with navigation route
 */
const navigate = (name, params) => {
  navigationRef.current?.navigate(name, params);
};

/**
 * Reset the entire navigation stack and start with given route name
 * @param {Number} index - index for start route
 * @param {Array} routes - array containe route name and params ex. [{name: '', params: {}}]
 */
const reset = (index, routes) => {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index,
      routes,
    }),
  );
};

/**
 * It takes you back to the previous route in history
 */
const goBack = () => {
  navigationRef.current.dispatch(CommonActions.goBack());
};

/**
 * It takes you back to a previous screen in the stack
 * @param {Number} count - count for how many screens to pop back by
 */
const pop = (count = 1) => {
  navigationRef.current.dispatch(StackActions.pop(count));
};

/**
 * It takes you back to the first screen in the stack
 */
const popToTop = () => {
  navigationRef.current.dispatch(StackActions.popToTop());
};

/**
 *  It Adds a route on top of the stack and navigates forward to it
 * @param {String} name
 * @param {Object} params
 */
const push = (name, params) => {
  navigationRef.current.dispatch(StackActions.push(name, params));
};

/**
 * It replace a route in the navigation state.
 * @param {String} name
 * @param {Object} params
 */
const replace = (name, params) => {
  navigationRef.current?.dispatch(StackActions.replace(name, params));
};

export default {
  navigate,
  reset,
  pop,
  popToTop,
  goBack,
  push,
  replace,
};
