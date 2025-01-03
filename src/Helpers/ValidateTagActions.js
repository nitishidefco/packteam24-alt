import moment from 'moment';
import {setLastOnlineMode} from '../Redux/Reducers/WorkStateSlice';
import {useDispatch} from 'react-redux';
export const ValidateTagAction = (tagId, sessionItems, lastOnlineMode) => {
  const TAGS = {
    work_start: ['53:AE:E6:BB:40:00:01', '53:71:D8:BB:40:00:01'],
    break_start: ['53:1E:3D:BC:40:00:01', '53:30:85:BB:40:00:01'],
    work_end: ['53:88:66:BC:40:00:01', '53:8B:07:BC:40:00:01'],
  };

  const lastTag = sessionItems[sessionItems.length - 1];
  const currentDate = moment().format('YYYY-MM-DD');

  // Helper function to get tag type
  function getTagType(tagId) {
    if (TAGS.work_start.includes(tagId)) return 'work_start';
    if (TAGS.break_start.includes(tagId)) return 'break_start';
    if (TAGS.work_end.includes(tagId)) return 'work_end';
    return null;
  }
  console.log('last tag inside validate tag action', lastTag);
  console.log('getTagType*******', getTagType(lastTag.tagId));

  // Get effective state from either online mode or last offline tag
  const effectiveLastState =
    lastOnlineMode || (lastTag ? getTagType(lastTag.tagId) : null);
  console.log('effectivelaststate', effectiveLastState);

  // Check if work has been ended today
  const isWorkEndedToday = sessionItems.some(
    item =>
      TAGS.work_end.includes(item.tagId) &&
      moment(item.timestamp).isSame(currentDate, 'day'),
  );

  if (TAGS.work_start.includes(tagId)) {
    if (!effectiveLastState) {
      return {valid: true, message: 'Work started'};
    }

    if (isWorkEndedToday) {
      return {
        valid: false,
        message: 'Cannot start work again after ending it today.',
      };
    }

    if (effectiveLastState === 'work_start') {
      return {valid: false, message: 'Work is already started'};
    }

    if (effectiveLastState === 'break_start') {
      return {valid: true, message: 'Break ended, work resumed'};
    }

    return {valid: true, message: 'Work started'};
  }

  if (TAGS.break_start.includes(tagId)) {
    if (!effectiveLastState || effectiveLastState === 'work_end') {
      return {
        valid: false,
        message: 'Cannot take a break without starting work',
      };
    }

    if (effectiveLastState === 'break_start') {
      return {valid: false, message: 'Break is already active'};
    }

    if (effectiveLastState === 'work_start') {
      return {valid: true, message: 'Break started'};
    }

    return {valid: false, message: 'Invalid state for break'};
  }

  if (TAGS.work_end.includes(tagId)) {
    if (!effectiveLastState) {
      return {valid: false, message: 'Cannot end work without starting it'};
    }

    if (effectiveLastState === 'break_start') {
      return {
        valid: false,
        message: 'Cannot end work while on a break. Resume work first.',
      };
    }

    if (effectiveLastState === 'work_end') {
      return {valid: false, message: 'Work is already ended'};
    }

    if (effectiveLastState === 'work_start') {
      return {valid: true, message: 'Work ended'};
    }

    return {valid: false, message: 'Invalid state for ending work'};
  }

  return {valid: false, message: 'Unknown tag scanned'};
};
