export const updatedData = (data: any, msg?: string) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp); // No conversion needed if already in milliseconds
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
    return formattedDate;
  };

  const formatHour = (timestamp: number) => {
    const date = new Date(timestamp); // No conversion needed if already in milliseconds
    const hour = `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    return hour;
  };

  if (msg === "1") {
    return {
      ...data.newStock,
      date: formatDate(data.newStock.createdAt),
      hour: formatHour(data.newStock.createdAt),
    };
  }

  return data[0].stocks.map((obj: any) => {
    return {
      ...obj,
      date: formatDate(obj.createdAt),
      hour: formatHour(obj.createdAt),
    };
  });
};

