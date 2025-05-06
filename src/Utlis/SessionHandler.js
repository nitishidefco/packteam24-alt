// sessionHandler.js with logs
let sessionHandler = {
  dispatch: null,
  SessionId: null,
  deviceId: null,
  navigation: null,
  globalLanguage: null,
};

export const setSessionHandler = (
  dispatch,
  SessionId,
  deviceId,
  navigation,
  globalLanguage,
) => {
  sessionHandler = {
    dispatch,
    SessionId,
    deviceId,
    navigation,
    globalLanguage,
  };
};

export const getSessionHandler = () => {
  return sessionHandler;
};
