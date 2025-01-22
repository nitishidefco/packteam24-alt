export function findModeByTagId(tags, tagId) {
  const matchingTag = tags.find(tag => tag.key === tagId);
  return matchingTag ? matchingTag.mode : null;
}
