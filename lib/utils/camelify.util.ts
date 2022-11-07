export const camelifyString = (str) => {
  return str[0] === '_'
    ? '_' + str.slice(1).replace(/_([a-z])/g, (k) => k[1].toUpperCase())
    : str.replace(/_([a-z])/g, (k) => k[1].toUpperCase());
};

export const camelifyObject = (obj) =>
  Object.keys(obj).reduce(
    (prev, curr) => ({
      ...prev,
      [camelifyString(curr)]: obj[curr],
    }),
    {}
  );
