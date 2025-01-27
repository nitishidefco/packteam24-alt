import {success} from '../Helpers/ToastMessage';
import i18n from '../i18n/i18n';

export const showNotificationAboutTagScannedWhileOffline = (
  tagId,
  tagsFromLocalStorage,
) => {
  function findModeByTagId(tags, tagId) {
    const matchingTag = tags.find(tag => tag.key === tagId);
    return matchingTag ? matchingTag.mode : null;
  }

  const tagMode = findModeByTagId(tagsFromLocalStorage, tagId);

  switch (tagMode) {
    case 'work_start':
      success(i18n.t('Toast.WorkinProgress'));
      break;
    case 'break_start':
      success(i18n.t('Toast.BreakinProgress'));
      break;
    case 'work_end':
      success(i18n.t('Toast.WorkFinished'));
      break;
  }
};
