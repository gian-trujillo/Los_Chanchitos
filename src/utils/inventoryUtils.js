export const getInventoryMap = (inventoryItems) => {
  return inventoryItems.reduce((inventoryMap, item) => {
    inventoryMap[item.id] = item;
    return inventoryMap;
  }, {});
};

export const getProductInventoryStatus = (product, inventoryItems) => {
  if (!product.inventoryUsage || product.inventoryUsage.length === 0) {
    return {
      isAvailable: product.isAvailable !== false,
      isSoldOut: false,
      isLowStock: false,
      lowStockLabel: "",
    };
  }

  if (product.isAvailable === false) {
    return {
      isAvailable: false,
      isSoldOut: true,
      isLowStock: false,
      lowStockLabel: "No disponible",
    };
  }

  const inventoryMap = getInventoryMap(inventoryItems);

  const requiredInventory = product.inventoryUsage.map((usage) => {
    const inventoryItem = inventoryMap[usage.inventoryId];

    return {
      usage,
      inventoryItem,
    };
  });

  const hasMissingInventory = requiredInventory.some(
    ({ inventoryItem }) => !inventoryItem
  );

  if (hasMissingInventory) {
    return {
      isAvailable: true,
      isSoldOut: false,
      isLowStock: false,
      lowStockLabel: "",
    };
  }

  const isSoldOut = requiredInventory.some(({ usage, inventoryItem }) => {
    return inventoryItem.quantity < usage.amount;
  });

  if (isSoldOut) {
    return {
      isAvailable: false,
      isSoldOut: true,
      isLowStock: false,
      lowStockLabel: "Agotado",
    };
  }

  const lowStockItems = requiredInventory.filter(({ inventoryItem }) => {
    return inventoryItem.quantity <= inventoryItem.lowStockThreshold;
  });

  if (lowStockItems.length === 0) {
    return {
      isAvailable: true,
      isSoldOut: false,
      isLowStock: false,
      lowStockLabel: "",
    };
  }

  const mainLowStockItem = lowStockItems[0].inventoryItem;

  return {
    isAvailable: true,
    isSoldOut: false,
    isLowStock: true,
    lowStockLabel: getLowStockLabel(mainLowStockItem),
  };
};

export const getLowStockLabel = (inventoryItem) => {
  if (inventoryItem.storedUnit === "grams") {
    return `Últimos ${inventoryItem.quantity / 1000} kg`;
  }

  if (inventoryItem.storedUnit === "halfUnits") {
    return `Últimos ${inventoryItem.quantity} medios`;
  }

  return `Últimos ${inventoryItem.quantity}`;
};

export const addInventoryStatusToMenuItems = (menuItems, inventoryItems) => {
  return menuItems.map((item) => ({
    ...item,
    inventoryStatus: getProductInventoryStatus(item, inventoryItems),
  }));
};