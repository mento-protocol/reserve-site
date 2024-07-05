export const centerEllipsis = (address: string, remaining = 6) => {
  if (address.length <= remaining * 2) {
    return address;
  }
  return `${address.substring(0, remaining)}...${address.substring(
    address.length - remaining,
  )}`;
};
