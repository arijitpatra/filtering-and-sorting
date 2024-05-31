import { fireEvent, render, screen } from "@testing-library/react";
import Search from "./Search";

describe("Search", () => {
  const mockFn = jest.fn();
  const searchQuery = "xyz";

  const searchPropsBase = {
    value: "abc",
    placeholder: `type to search`,
    onSearch: mockFn,
  };

  const fullPlaceholder = `🔍 ${searchPropsBase.placeholder}`;

  beforeEach(() => {
    render(<Search {...searchPropsBase} />);
  });

  it("correct value is displayed", () => {
    const filterElement = screen.getByPlaceholderText(fullPlaceholder);

    expect(filterElement).toHaveValue(searchPropsBase.value);
  });

  it("the change event handler should be triggered when typing", () => {
    const filterElement = screen.getByPlaceholderText(fullPlaceholder);

    fireEvent.change(filterElement, {
      target: { value: searchQuery },
    });

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
