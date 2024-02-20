export function getBathroomLabel(number) {
  if (number === 1) {
    return "ванная ";
  } else if (number >= 2 && number <= 4) {
    return "ванные ";
  } else if (number >= 5 && number <= 10) {
    return "ванных ";
  } else {
    return "ванных "; // Для остальных случаев можно использовать тот же вариант
  }
}
