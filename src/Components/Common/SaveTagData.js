export const saveScannedItem = (tagId, sessionID) => {
  const currentTime = new Date().toISOString(); // or you can use a timestamp in milliseconds
  const newItem = {
    time: currentTime,
    tag_id: tagId,
  };
  console.log('newItem', newItem);

  //   dispatch(addScannedItem(newItem)); // Dispatch to Redux
  // Or use AsyncStorage/Redux Persist to store it locally
};
