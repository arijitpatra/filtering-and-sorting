import { filterRows } from "./filterRows";
import { sortRowsByColumn } from "./sortRowsByColumn";

export const filterAndSortTable = (
  rows,
  filters,
  columnIdForSort,
  isAscending,
  types = {}
) => {
  const filteredRows = filterRows(rows, filters);

  return sortRowsByColumn(columnIdForSort, isAscending, filteredRows, types);
};
