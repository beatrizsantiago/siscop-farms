export const capitalizeFirstLetter = (str: string):string => {
  if (str) {
    return str.replace(/^\w/, (c) => c.toUpperCase());
  }
  return '';
};

