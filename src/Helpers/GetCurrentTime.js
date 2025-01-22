export const getCurrentTime = () => {
  const now = new Date(); // Get current date and time
  const hours = now.getHours(); // Get the hour (0-23)
  const minutes = now.getMinutes(); // Get the minute (0-59)

  // Format the time to always show two digits
  const formattedTime = `${String(hours).padStart(2, '0')}:${String(
    minutes,
  ).padStart(2, '0')}`;

  return formattedTime;
};
