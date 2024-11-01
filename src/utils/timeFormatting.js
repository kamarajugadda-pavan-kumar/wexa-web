export function formatTime(time) {
  const dateOptions = { day: "2-digit", month: "2-digit", year: "2-digit" };
  const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: false };

  // Convert to local date and time
  const datePart = new Date(time).toLocaleDateString("en-GB", dateOptions);
  const timePart = new Date(time).toLocaleTimeString("en-GB", timeOptions);

  const formattedDateTime = `${datePart} ${timePart}`;
  return formattedDateTime;
}
