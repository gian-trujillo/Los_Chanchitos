const ORDERS_STORAGE_KEY = "losChanchitosOrders";

export const getStoredOrders = () => {
  const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);

  if (!storedOrders) {
    return [];
  }

  try {
    return JSON.parse(storedOrders);
  } catch {
    return [];
  }
};

export const saveOrderToStorage = (order) => {
  const storedOrders = getStoredOrders();
  const updatedOrders = [order, ...storedOrders];

  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
};

export const findStoredOrder = ({ orderCode, phone }) => {
  const normalizeText = (value) => value.trim().toLowerCase();
  const normalizePhone = (value) => value.replace(/\D/g, "");

  const storedOrders = getStoredOrders();

  return storedOrders.find((order) => {
    const orderCodeMatches =
      normalizeText(order.id) === normalizeText(orderCode);

    const phoneMatches =
      normalizePhone(order.customer.phone) === normalizePhone(phone);

    return orderCodeMatches && phoneMatches;
  });
};

export const updateStoredOrder = (updatedOrder) => {
  const storedOrders = getStoredOrders();

  const updatedOrders = storedOrders.map((order) =>
    order.id === updatedOrder.id ? updatedOrder : order
  );

  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));

  return updatedOrder;
};

export const getOrderStatusLabel = (status) => {
  const statusLabels = {
    received: "Pedido recibido",
    confirmed: "Confirmado",
    preparing: "En preparación",
    ready: "Listo para recoger",
    completed: "Completado",
    cancelled: "Cancelado",
  };

  return statusLabels[status] || "Pedido recibido";
};