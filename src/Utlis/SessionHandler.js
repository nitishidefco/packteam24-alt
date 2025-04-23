// sessionHandler.js with logs
let sessionHandler = {
  dispatch: null,
  SessionId: null,
  deviceId: null,
  navigation: null,
};

export const setSessionHandler = (
  dispatch,
  SessionId,
  deviceId,
  navigation,
) => {
  sessionHandler = {
    dispatch,
    SessionId,
    deviceId,
    navigation,
  };
};

export const getSessionHandler = () => {
  return sessionHandler;
};
