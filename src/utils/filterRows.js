// use 'startsWith' instead of 'includes' if you want starts with kind of search
export const filterRows = (rows, filters) =>
  rows?.filter((row) =>
    Object.entries(filters).every(([columnId, filterValue]) =>
      row[columnId]
        ?.toString()
        .toLowerCase()
        .includes(filterValue.trim().toLowerCase())
    )
  );
