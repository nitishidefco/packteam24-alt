import {addColons} from './AddColonsToId';

export function findModeByTagId(tags, tagId) {
  // Check if the tagId already contains colons
  const isAlreadyFormatted = tagId?.includes(':');

  // Format the tagId only if it doesn't already contain colons
  const formattedTagId = isAlreadyFormatted ? tagId : addColons(tagId);

  // Find the matching tag
  const matchingTag = tags.find(tag => tag.key === formattedTagId);

  // Return the mode if the tag is found, otherwise return null
  return matchingTag ? matchingTag.mode : null;
}
