export const centerEllipsis = (
  address: string,
  startLength = 4,
  endLength = 4,
) => {
  if (address.length <= startLength + endLength) {
    return address;
  }
  return `${address.substring(0, startLength)}...${address.substring(
    address.length - endLength,
  )}`;
};
