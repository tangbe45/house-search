export function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | string)[] {
  const deference = 2;
  const range = [];
  const rangeWithDots = [];
  let lastNumberStored;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - deference && i <= currentPage + deference)
    ) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (lastNumberStored) {
      if (i - lastNumberStored === 2) rangeWithDots.push(lastNumberStored + 1);
      else if (i - lastNumberStored !== 1) rangeWithDots.push("...");
    }
    rangeWithDots.push(i);
    lastNumberStored = i;
  }

  return rangeWithDots;
}
