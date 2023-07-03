export const updatedData = (data: any, msg?: string) => {
  if (msg === "1") {
    const date = new Date(data.newStock.createdAt * 1000);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;

    const hour = `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    return {
      ...data.newStock,
      date: formattedDate,
      hour: hour,
    };
  }
  return data[0].stocks.map((obj: any) => {
    const date = new Date(obj.createdAt * 1000);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;

    const hour = `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    return {
      ...obj,
      date: formattedDate,
      hour: hour,
    };
  });
};
