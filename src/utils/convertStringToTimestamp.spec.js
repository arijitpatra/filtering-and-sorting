import { convertStringToTimestamp } from "./convertStringToTimestamp";

describe("convertStringToTimestamp utility function", () => {
  it("should return correct timestamp in milliseconds when a valid dd-mm-yyyy string is passed", () => {
    const expectedTimestamp = 1353366000000;
    const actualTimestamp = convertStringToTimestamp("20-11-2012");
    expect(actualTimestamp).toBe(expectedTimestamp);
  });

  it("should return correct timestamp in milliseconds when a yyyy string is passed", () => {
    const expectedTimestamp = 1041379200000;
    const actualTimestamp = convertStringToTimestamp("2003");
    expect(actualTimestamp).toBe(expectedTimestamp);
  });

  it("should return the max safe integer when an invalid value is passed", () => {
    const expectedTimestamp = Number.MAX_SAFE_INTEGER;
    const actualTimestamp = convertStringToTimestamp("Unknown");
    expect(actualTimestamp).toBe(expectedTimestamp);
  });
});
