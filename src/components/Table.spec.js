import { act, fireEvent, render, screen } from "@testing-library/react";
import testData from "../data.json";
import Table from "./Table";
import { types } from "../App";
import { filterRows, sortRowsByColumn } from "../utils";
import { DEBOUNCE_DELAY, NO_MATCHING_RESULTS_MSG } from "../constants";

const columns = testData.columns;

const columnWiseSearchQuery = {
  number: "3",
  title: "Iron",
  releaseDate: "2010",
  productionBudget: "17",
  worldwideBoxOffice: "389",
};

const mockDebounceFn = async () => {
  await new Promise((resolve) => setTimeout(resolve, DEBOUNCE_DELAY));
};

describe("Table", () => {
  const columnTable = columns.map(({ id, title }) => [id, title]);

  describe("sorting", () => {
    describe.each(columnTable)('"%s" column', (id, title) => {
      beforeEach(() => {
        render(<Table columns={columns} rows={testData.rows} types={types} />);
      });

      it("should be possible to sort a column", () => {
        const headingElement = screen.getByTitle(`click to sort ${id}`);

        fireEvent.click(headingElement);

        const expectedValues = sortRowsByColumn(
          id,
          true,
          testData.rows,
          types
        ).map((item) => item[id]?.toString());

        expectedValues.forEach((item, index) => {
          let actualData = "";
          if (item?.length > 0) {
            actualData = screen.getByTestId(`row-${index}-${id}`).textContent;
            expect(actualData).toBe(item);
          }
        });
      });

      it("should be possible to toggle the sorting direction of a column", () => {
        const headingElement = screen.getByTitle(`click to sort ${id}`);

        const expectedValuesAscending = sortRowsByColumn(
          id,
          true,
          testData.rows,
          types
        ).map((item) => item[id]?.toString());

        const expectedValuesDescending = sortRowsByColumn(
          id,
          false,
          testData.rows,
          types
        ).map((item) => item[id]?.toString());

        // handles the first click, sort by ascending
        fireEvent.click(headingElement);

        expectedValuesAscending.forEach((item, index) => {
          const expectedValue = item?.id;
          let actualData = "";

          if (expectedValue?.length > 0) {
            actualData = screen.getByTestId(`row-${index}-${id}`).textContent;
            expect(actualData).toBe(expectedValue);
          }
        });

        // handles the second click, sort by descending
        fireEvent.click(headingElement);

        expectedValuesDescending.forEach((item, index) => {
          const expectedValue = item?.id;
          let actualData = "";

          if (expectedValue > 0) {
            actualData = screen.getByTestId(`row-${index}-${id}`).textContent;
            expect(actualData).toBe(expectedValue);
          }
        });

        // another click toggles the sort direction
        fireEvent.click(headingElement);

        expectedValuesAscending.forEach((item, index) => {
          const expectedValue = item?.id;
          let actualData = "";

          if (expectedValue > 0) {
            actualData = screen.getByTestId(`row-${index}-${id}`).textContent;
            expect(actualData).toBe(expectedValue);
          }
        });
      });
    });
  });

  describe("filtering", () => {
    describe.each(columnTable)(
      'should offer a means to filter the "%s" column',
      (id, title) => {
        beforeEach(() => {
          render(
            <Table columns={columns} rows={testData.rows} types={types} />
          );
        });

        it("should be possible to filter a column - correct search query is displayed in each of the inputs", () => {
          const filterElement = screen.getByTestId(`${id}-filter`);
          fireEvent.change(filterElement, {
            target: { value: columnWiseSearchQuery[id] },
          });

          expect(filterElement).toHaveValue(columnWiseSearchQuery[id]);
        });

        it("should be possible to filter a column - column is filtered correctly", async () => {
          const filterElement = screen.getByTestId(`${id}-filter`);
          let actualValues = [];

          fireEvent.change(filterElement, {
            target: { value: columnWiseSearchQuery[id] },
          });

          await act(mockDebounceFn);

          const expectedValues = testData.rows
            .filter((data) =>
              data[id]
                ?.toString()
                .toLowerCase()
                .includes(columnWiseSearchQuery[id].toLowerCase())
            )
            .map((item) => item[id].toString());

          expectedValues.forEach((item, index) => {
            actualValues.push(
              screen.getByTestId(`row-${index}-${id}`).textContent
            );
          });

          expect(actualValues.sort()).toEqual(expectedValues.sort());
        });

        it("should be possible to filter a column - number of rows should be equal to the number of matching data in the column", async () => {
          const filterElement = screen.getByTestId(`${id}-filter`);
          fireEvent.change(filterElement, {
            target: { value: columnWiseSearchQuery[id] },
          });

          await act(mockDebounceFn);

          const expectedValues = testData.rows
            .filter((data) =>
              data[id]
                ?.toString()
                .toLowerCase()
                .includes(columnWiseSearchQuery[id].toLowerCase())
            )
            .map((item) => item[id].toString());

          expect(screen.getAllByRole("row").length - 1).toEqual(
            expectedValues.length
          );
        });
      }
    );

    it("should be possible to combine filters", async () => {
      render(<Table columns={columns} rows={testData.rows} types={types} />);

      Object.keys(columnWiseSearchQuery).forEach((id) => {
        const filterElement = screen.getByTestId(`${id}-filter`);
        fireEvent.change(filterElement, {
          target: { value: columnWiseSearchQuery[id] },
        });
      });

      await act(mockDebounceFn);

      const actualNumberOfRows = screen.getAllByRole("row").length - 1;
      const expectedRows = filterRows(testData.rows, columnWiseSearchQuery);

      expect(expectedRows.length).toEqual(actualNumberOfRows);

      Object.keys(columnWiseSearchQuery).forEach((id) => {
        const expectedValue = expectedRows[id]?.toString();
        const actualValue = screen.getByTestId(`${id}-filter`).value;
        if (expectedValue?.length > 0) {
          expect(expectedValue.includes(actualValue)).toBe(true);
        }
      });
    });
  });

  describe("No data matches the filters", () => {
    it("message is shown", async () => {
      render(<Table columns={columns} rows={testData.rows} types={types} />);

      Object.keys(columnWiseSearchQuery).forEach((id) => {
        const filterElement = screen.getByTestId(`${id}-filter`);
        fireEvent.change(filterElement, {
          target: { value: "%$%#@$^&(&HSG%*" },
        });
      });

      await act(mockDebounceFn);

      expect(screen.getByText(NO_MATCHING_RESULTS_MSG)).toBeInTheDocument();
    });
  });
});
