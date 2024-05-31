import { DATA_TYPES_CUSTOMIZED } from "../constants";
import { convertStringToTimestamp } from "./convertStringToTimestamp";

export const sortRowsByColumn = (columnId, isAscending, rows, types) => {
  const sorted = rows.sort((a, b) => {
    if (
      types[columnId] === DATA_TYPES_CUSTOMIZED.number ||
      types[columnId] === DATA_TYPES_CUSTOMIZED.money
    ) {
      return a[columnId] - b[columnId];
    }

    if (types[columnId] === DATA_TYPES_CUSTOMIZED.date) {
      return (
        convertStringToTimestamp(a[columnId]) -
        convertStringToTimestamp(b[columnId])
      );
    }

    const aVal = a[columnId]?.toString().toLowerCase();
    const bVal = b[columnId]?.toString().toLowerCase();

    if (aVal < bVal) {
      return -1;
    }

    if (aVal > bVal) {
      return 1;
    }

    return 0;
  });

  if (!isAscending) {
    return sorted.reverse();
  }

  return sorted;
};
