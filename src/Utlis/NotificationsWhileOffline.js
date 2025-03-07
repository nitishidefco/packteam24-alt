import {errorToast, success} from '../Helpers/ToastMessage';
import i18n from '../i18n/i18n';

export const showNotificationAboutTagScannedWhileOffline = (
  tagId,
  tagsFromLocalStorage,
  localWorkHistory,
) => {
  function findModeByTagId(tags, tagId) {
    const matchingTag = tags.find(tag => tag.key === tagId);
    return matchingTag ? matchingTag.mode : null;
  }

  const tagMode = findModeByTagId(tagsFromLocalStorage, tagId);

  switch (tagMode) {
    case 'work_start':
      if (localWorkHistory.length === 0) {
        success(i18n.t('Toast.WorkinProgress'));
      } else if (
        localWorkHistory[localWorkHistory.length - 1]?.mode_raw === 'work'
      ) {
        errorToast(i18n.t('Toast.Workalreadystarted'));
      }
      break;
    case 'break_start':
      if (localWorkHistory.length === 0) {
        success(i18n.t('Toast.Cannottakebreak'));
      } else if (
        localWorkHistory[localWorkHistory.length - 1]?.mode_raw === 'break'
      ) {
        errorToast(i18n.t('Toast.Breakalreadystarted'));
      } else {
        success(i18n.t('Toast.BreakinProgress'));
      }``
      break;
    case 'work_end':
      success(i18n.t('Toast.WorkFinished'));
      break;
  }
};
