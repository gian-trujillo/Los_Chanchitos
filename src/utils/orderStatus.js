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