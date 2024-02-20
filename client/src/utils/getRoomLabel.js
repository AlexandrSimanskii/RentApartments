export const getRoomLabel = (number) => {
  if (number === 1 || number === 21 || number === 31) {
    return "комната";
  } else if (
    (number >= 2 && number <= 4) ||
    (number >= 22 && number <= 24) ||
    (number >= 32 && number <= 34)
  ) {
    return "комнаты";
  } else {
    return "комнат";
  }
};
