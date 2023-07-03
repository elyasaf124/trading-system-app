export const unixToDate = () => {
  const currentDate = new Date();

  // Extract the individual date components
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");
  const year = currentDate.getFullYear();

  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");

  // Format the date and time as mm/dd/yyyy HH:MM
  const formattedDateTime = `${month}/${day}/${year} ${hours}:${minutes}`;
  return formattedDateTime;
};
