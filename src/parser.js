export default (data, dataType) => {
  const parser = new DOMParser();
  return parser.parseFromString(data, dataType);
};
