const requiredValidator = (value) => {
  return !!value;
};
const numberValidator = (value) => {
  return !isNaN(value);
};

export { numberValidator as n, requiredValidator as r };
