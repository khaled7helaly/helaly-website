function calculateOrderTotal(service, selectedAddons = []) {
  const items = [service, ...selectedAddons];

  if (
    items.some(
      (item) =>
        item?.price == null ||
        !Number.isFinite(item.price) ||
        item.price < 0 ||
        !item.currency,
    )
  ) {
    return null;
  }

  const currency = items[0].currency;
  if (items.some((item) => item.currency !== currency)) {
    return null;
  }

  return {
    amount: items.reduce((total, item) => total + item.price, 0),
    currency,
  };
}

export default calculateOrderTotal;