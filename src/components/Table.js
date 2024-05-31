import { useState } from "react";
import Search from "./Search/Search";
import classNames from "./Table.module.css";
import Indicator from "./Indicator";
import { ReactComponent as AscendingIcon } from "./order-ascending.svg";
import { ReactComponent as DescendingIcon } from "./order-descending.svg";
import { filterAndSortTable } from "../utils";
import { useDebounce } from "../hooks";
import NoResults from "./NoResults";

const Table = ({ columns, rows, types }) => {
  const [filters, setFilters] = useState({});
  const [ascendingSortColumn, setAscendingSortColumn] = useState({});
  const debouncedFiltersValue = useDebounce(filters);

  const filteredAndSortedData = filterAndSortTable(
    rows,
    debouncedFiltersValue,
    Object.keys(ascendingSortColumn)[0],
    Object.values(ascendingSortColumn)[0],
    types
  );

  const handleSorting = (columnId) => {
    setAscendingSortColumn((prevState) => {
      return { [columnId]: !prevState[columnId] };
    });
  };

  const handleFilters = (value, columnId) => {
    setFilters((prevState) => {
      return { ...prevState, [columnId]: value };
    });
  };

  return (
    <>
      <table title="Movies" className={classNames.table}>
        <thead>
          <tr>
            {columns.map(({ id, title }) => (
              <th key={id}>
                <div className={classNames.heading}>
                  <div className={classNames.headingTitle}>
                    <span
                      onClick={() => handleSorting(id)}
                      title={`click to sort ${id}`}
                      aria-describedby={`click to sort ${id} - on first click it is ascending, then toggles between ascending and descending`}
                    >
                      {title}
                    </span>
                    {ascendingSortColumn[id] === true ? (
                      <AscendingIcon />
                    ) : ascendingSortColumn[id] === false ? (
                      <DescendingIcon />
                    ) : null}
                    {filters[id]?.length > 0 ? <Indicator /> : null}
                  </div>
                  <Search
                    value={filters[id] || ""}
                    onSearch={(e) => handleFilters(e.target.value, id)}
                    placeholder="Type to filter"
                    testId={`${id}-filter`}
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredAndSortedData?.map((row, index) => (
            // NOTE: index should not be used as key, earlier it was using, fixed it
            <tr key={row.number}>
              {columns.map(({ id }) => (
                <td
                  data-testid={`row-${index}-${id}`}
                  className={classNames[`cell-type-${types[id]}`]}
                  key={id}
                >
                  {row[id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {filteredAndSortedData?.length === 0 ? <NoResults /> : null}
    </>
  );
};

export default Table;
