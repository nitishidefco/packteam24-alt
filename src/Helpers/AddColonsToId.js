export function addColons(number) {
  return number?.replace(/(.{2})(?=.)/g, '$1:');
}
