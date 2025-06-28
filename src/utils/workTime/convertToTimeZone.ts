import { format, toZonedTime } from "date-fns-tz";

export const convertToTimeZone = (
  isoString: string | null,
  timeZone: string
): string => {
  if (!isoString) {
    return "N/A"; // Return "N/A" if the input is null
  }
  const zonedTime = toZonedTime(isoString, timeZone); // Convert UTC to ICT
  return format(zonedTime, "HH:mm:ss", { timeZone }); // Format the time in ICT
};

export const convertToDefault = (isoString: string | null) => {
  if (!isoString) {
    return "N/A"; // Return "N/A" if the input is null
  }
  const date = new Date(isoString); // Parse the ISO string into a Date object
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }); // Format the time in the user's local timezone
};
