export const dateToISOStringFormat = (dateStr: string) => {
    const date = new Date(dateStr);

    // Convert to ISO string
    return date.toISOString();
}

export const timeToIsoDateString = (dateStr: string, timeStr: string) => {
  const [hoursStr = "0", minutesStr = "0"] = timeStr.split(":");
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);

  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error("Invalid time format, expected HH:mm");
  }

  const date = new Date(dateStr);
  date.setHours(hours, minutes, 0, 0); // now TypeScript is happy

  return date.toISOString();
}

export const isoToReadableDate = (
  isoDate: string,
  options?: Intl.DateTimeFormatOptions
) => {
  console.log('isoToReadableDate called with:', isoDate, options);
  
  if (!isoDate) return "";
  const date = new Date(isoDate);

  // Default format: e.g., "Nov 28, 2025"
  return date.toLocaleDateString(
    undefined,
    options || {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
};

export default dateToISOStringFormat;