import {toastMessage} from '../Helpers';

export const showNotificationAboutTagScannedWhileOffline = (
  tagId,
  sessions,
  SessionId,
) => {
  if (!sessions[SessionId] || !sessions[SessionId].items?.length) {
    switch (tagId) {
      case '53:AE:E6:BB:40:00:01': // Work Start
        return toastMessage.success('Work Start');

      case '53:1E:3D:BC:40:00:01': // Break Start
        return toastMessage.success('Break Start');

      case '53:88:66:BC:40:00:01': // Work End
        return toastMessage.error('Work has not started yet');
    }
  }
  if (sessions[SessionId]) {
    switch (tagId) {
      case '53:AE:E6:BB:40:00:01': // Work Start
        console.log(
          'Checking Work Start tag in session:',
          sessions[SessionId].items,
        );

        // Check if work has already started
        if (
          sessions[SessionId].items.some(
            item => item.tagId === '53:AE:E6:BB:40:00:01',
          )
        ) {
          console.log('Work already started');
          return toastMessage.error('Work already started');
        }
        // Check if break is ongoing
        else if (
          sessions[SessionId].items.some(
            item => item.tagId === '53:1E:3D:BC:40:00:01',
          )
        ) {
          console.log('Break found, ending break and resuming work');
          return toastMessage.success('Break ended. Work resumed.');
        } else {
          console.log('No work or break found, starting work');
          return toastMessage.success('Work Start');
        }
        break;

      case '53:1E:3D:BC:40:00:01': // Break Start
        if (
          sessions[SessionId].items.some(
            item => item.tagId === '53:1E:3D:BC:40:00:01',
          )
        ) {
          return toastMessage.error('Break already started');
        } else {
          // Check if work has already started
          if (
            sessions[SessionId].items.some(
              item => item.tagId === '53:AE:E6:BB:40:00:01',
            )
          ) {
            return toastMessage.success('Work paused. Break started.');
          } else {
            return toastMessage.success('Break Start');
          }
        }

      case '53:88:66:BC:40:00:01': // Work End
        if (
          sessions[SessionId].items.some(
            item => item.tagId === '53:88:66:BC:40:00:01',
          )
        ) {
          return toastMessage.error('Work already ended');
        } else {
          // Check if work has started
          if (
            sessions[SessionId].items.some(
              item => item.tagId === '53:AE:E6:BB:40:00:01',
            )
          ) {
            return toastMessage.success('Work End');
          } else {
            return toastMessage.error('Work has not started yet');
          }
        }

      default:
        break;
    }
  }
};
