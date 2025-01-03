import {toastMessage, ValidateTagAction} from '../Helpers';
export const showNotificationAboutTagScannedWhileOffline = (
  tagId,
  sessions,
  sessionId,
  lastOnlineMode
) => {
  const session = sessions[sessionId];
  const sessionItems = session?.items || [];
  const validationResult = ValidateTagAction(tagId, sessionItems, lastOnlineMode);
  if (validationResult.valid) {
    toastMessage.success(validationResult.message);
  } else {
    toastMessage.error(validationResult.message);
  }
};
