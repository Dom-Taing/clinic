export const calculateDuration = (
  startTime: string,
  endTime: string
): string => {
  const start = new Date(startTime); // Convert start time to Date object
  const end = new Date(endTime); // Convert end time to Date object

  const durationMs = end.getTime() - start.getTime(); // Calculate the difference in milliseconds

  if (durationMs < 0) {
    return "Invalid time range"; // Handle cases where endTime is earlier than startTime
  }

  const hours = Math.floor(durationMs / (1000 * 60 * 60)); // Convert to hours
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60)); // Convert to minutes
  const seconds = Math.floor((durationMs % (1000 * 60)) / 1000); // Convert to seconds

  return `${hours}h ${minutes}m ${seconds}s`; // Return the duration as a formatted string
};
