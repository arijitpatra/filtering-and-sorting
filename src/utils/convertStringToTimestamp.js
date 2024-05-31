/* 
  this function returns unix timestamp in milliseconds,
  for proper dates in dd-mm-yyyy format it sends the corresponding timestamp in milliseconds, 
  if only year is given then it treats is as the first day of that calendar year & returns the corresponding timestamp in milliseconds,
  and for all invalid values a very high integer value is returned

  ASSUMPTION for the 'year' only scenario is that the given year is >= 1970
*/
export const convertStringToTimestamp = (value) => {
  if (value.includes("-")) {
    const dateSplit = value.split("-");
    const year = parseInt(dateSplit[2]);
    const month = parseInt(dateSplit[1]) - 1;
    const day = parseInt(dateSplit[0]);

    return new Date(year, month, day).getTime();
  } else if (value.match(/^\d{4}$/)) {
    return new Date(value).getTime();
  }

  return Number.MAX_SAFE_INTEGER;
};
