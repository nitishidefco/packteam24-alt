import {toastMessage, ValidateTagAction} from '../Helpers';
export const showNotificationAboutTagScannedWhileOffline = (
  tagId,
  sessions,
  sessionId,
) => {
  const session = sessions[sessionId];
  const sessionItems = session?.items || [];
  const validationResult = ValidateTagAction(tagId, sessionItems);
  if (validationResult.valid) {
    toastMessage.success(validationResult.message);
  } else {
    toastMessage.error(validationResult.message);
  }
};
