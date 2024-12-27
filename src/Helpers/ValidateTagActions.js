export const ValidateTagAction = (tagId, sessionItems) => {
  const TAGS = {
    WORK_START: ['53:AE:E6:BB:40:00:01', '53:71:D8:BB:40:00:01'],
    BREAK: ['53:1E:3D:BC:40:00:01', '53:30:85:BB:40:00:01'],
    WORK_END: ['53:88:66:BC:40:00:01', '53:8B:07:BC:40:00:01'],
  };

  const lastTag = sessionItems[sessionItems.length - 1];

  // Validate logic based on the current tag and session history
  if (TAGS.WORK_START.includes(tagId)) {
    if (!lastTag) {
      return { valid: true, message: 'Work started' };
    }

    if (TAGS.WORK_START.includes(lastTag.tagId)) {
      return { valid: false, message: 'Work is already started' };
    }

    if (TAGS.BREAK.includes(lastTag.tagId)) {
      return { valid: true, message: 'Break ended, work resumed' };
    }

    if (TAGS.WORK_END.includes(lastTag.tagId)) {
      return { valid: false, message: 'Cannot start work after ending it. Please start a new session.' };
    }

    return { valid: true, message: 'Work started' };
  }

  if (TAGS.BREAK.includes(tagId)) {
    if (!lastTag || TAGS.WORK_END.includes(lastTag.tagId)) {
      return { valid: false, message: 'Cannot take a break without starting work' };
    }

    if (TAGS.BREAK.includes(lastTag.tagId)) {
      return { valid: false, message: 'Break is already active' };
    }

    return { valid: true, message: 'Break started' };
  }

  if (TAGS.WORK_END.includes(tagId)) {
    if (!lastTag) {
      return { valid: false, message: 'Cannot end work without starting it' };
    }

    if (TAGS.BREAK.includes(lastTag.tagId)) {
      return { valid: false, message: 'Cannot end work while on a break. Resume work first.' };
    }

    if (TAGS.WORK_END.includes(lastTag.tagId)) {
      return { valid: false, message: 'Work is already ended' };
    }

    return { valid: true, message: 'Work ended' };
  }

  return { valid: false, message: 'Unknown tag scanned' };
};
