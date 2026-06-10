const ORDERS_STORAGE_KEY = "losChanchitosOrders";

const FINISHED_ORDER_RETENTION_MS = 2 * 24 * 60 * 60 * 1000;

const shouldKeepOrder = (order) => {
  const finishedStatuses = ["completed", "cancelled"];

  if (!finishedStatuses.includes(order.status)) {
    return true;
  }

  const referenceDate = order.updatedAt || order.createdAt;

  if (!referenceDate) {
    return true;
  }

  const orderAge = Date.now() - new Date(referenceDate).getTime();

  return orderAge < FINISHED_ORDER_RETENTION_MS;
};

export const getStoredOrders = () => {
  const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);

  if (!storedOrders) {
    return [];
  }

  try {
    const parsedOrders = JSON.parse(storedOrders);
    const activeOrders = parsedOrders.filter(shouldKeepOrder);

    if (activeOrders.length !== parsedOrders.length) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(activeOrders));
    }

    return activeOrders;
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

  const orderWithTimestamp = {
    ...updatedOrder,
    updatedAt: new Date().toISOString(),
  };

  const updatedOrders = storedOrders.map((order) =>
    order.id === orderWithTimestamp.id ? orderWithTimestamp : order
  );

  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));

  return orderWithTimestamp;
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

export const getOrderStatusStep = (status) => {
  const statusSteps = {
    received: 1,
    confirmed: 2,
    preparing: 3,
    ready: 4,
    completed: 5,
    cancelled: 0,
  };

  return statusSteps[status] || 1;
};

export const findStoredOrderById = (orderId) => {
  const storedOrders = getStoredOrders();

  return storedOrders.find((order) => order.id === orderId) || null;
};