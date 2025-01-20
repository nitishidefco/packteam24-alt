import {success} from '../Helpers/ToastMessage';

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
      success('Work in progress');
      break;
    case 'break_start':
      success('Break in progress');
      break;
    case 'work_end':
      success('Work finished');
      break;
  }
};
