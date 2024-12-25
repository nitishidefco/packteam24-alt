// --------------- LIBRARIES ---------------
import * as React from 'react';

// Create alert ref
export const alertRef = React.createRef();

/**
 * Display alert dialog
 * @param {Object} options
 */
const show = options => {
  alertRef?.current?.show(options);
};

/**
 * Hide alert dialog if visible
 */
const hide = () => {
  alertRef?.current?.hide();
};

export default {
  show,
  hide,
};
