import {addColons} from './AddColonsToId';

export function findModeByTagId(tags, tagId) {
  const formattedTagId = addColons(tagId);
  console.log(formattedTagId);

  const matchingTag = tags.find(tag => tag.key === formattedTagId);
  return matchingTag ? matchingTag.mode : null;
}
