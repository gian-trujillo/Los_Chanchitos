import { useState } from "react";
import {
  getStoredOrders,
  updateStoredOrder,
  getOrderStatusLabel,
} from "../../utils/orderStorage";
import "./AdminOrdersManager.css";

function AdminOrdersManager() {
  const [orders, setOrders] = useState(() => getStoredOrders());
  const [selectedStatus, setSelectedStatus] = useState("active");

  const statusFilters = [
    {
      id: "active",
      label: "Activos",
    },
    {
      id: "received",
      label: "Recibidos",
    },
    {
      id: "confirmed",
      label: "Confirmados",
    },
    {
      id: "preparing",
      label: "Preparando",
    },
    {
      id: "ready",
      label: "Listos",
    },
    {
      id: "completed",
      label: "Completados",
    },
    {
      id: "cancelled",
      label: "Cancelados",
    },
    {
      id: "all",
      label: "Todos",
    },
  ];

  const activeStatuses = ["received", "confirmed", "preparing", "ready"];

  const getVisibleOrders = () => {
    if (selectedStatus === "all") {
      return orders;
    }

    if (selectedStatus === "active") {
      return orders.filter((order) => activeStatuses.includes(order.status));
    }

    return orders.filter((order) => order.status === selectedStatus);
  };

  const formatPickupText = (order) => {
    if (order.pickup.type === "asap") {
      return "Lo antes posible";
    }

    return `Programado para ${order.pickup.time}`;
  };

  const formatPaymentText = (order) => {
    return order.paymentMethod === "pickup" ? "Pagar al recoger" : "Pago en línea";
  };

  const getNextStatus = (status) => {
    const statusFlow = {
      received: "confirmed",
      confirmed: "preparing",
      preparing: "ready",
      ready: "completed",
    };

    return statusFlow[status] || null;
  };

  const getNextStatusButtonText = (status) => {
    const buttonText = {
      received: "Confirmar pedido",
      confirmed: "Marcar preparando",
      preparing: "Marcar listo",
      ready: "Completar pedido",
    };

    return buttonText[status] || "";
  };

  const handleChangeStatus = (order, nextStatus) => {
    const updatedOrder = {
      ...order,
      status: nextStatus,
      statusLabel: getOrderStatusLabel(nextStatus),
    };

    updateStoredOrder(updatedOrder);

    setOrders((currentOrders) =>
      currentOrders.map((currentOrder) =>
        currentOrder.id === updatedOrder.id ? updatedOrder : currentOrder
      )
    );
  };

  const handleCancelOrder = (order) => {
    const shouldCancel = window.confirm(
      `¿Seguro que quieres cancelar el pedido ${order.id}?`
    );

    if (!shouldCancel) {
      return;
    }

    handleChangeStatus(order, "cancelled");
  };

  const getWhatsAppUrl = (order, type) => {
    const phone = order.customer.phone.replace(/\D/g, "");
    const phoneWithCountryCode = phone.startsWith("52") ? phone : `52${phone}`;

    const messages = {
      confirmed: `Hola ${order.customer.name}, tu pedido ${order.id} en Los Chanchitos fue confirmado. Te avisaremos cuando esté listo.`,
      ready: `Hola ${order.customer.name}, tu pedido ${order.id} en Los Chanchitos ya está listo para recoger. Te esperamos.`,
      custom: `Hola ${order.customer.name}, te escribimos de Los Chanchitos sobre tu pedido ${order.id}.`,
    };

    return `https://wa.me/${phoneWithCountryCode}?text=${encodeURIComponent(
      messages[type]
    )}`;
  };

  const visibleOrders = getVisibleOrders();

  return (
    <section className="admin-orders">
      <div className="admin-orders__header">
        <div>
          <p className="section__eyebrow">Pedidos</p>
          <h2>Gestión de pedidos</h2>
          <p>
            Revisa pedidos recibidos, actualiza estados y contacta al cliente por
            WhatsApp. Por ahora estos pedidos vienen del flujo mock en el navegador.
          </p>
        </div>

        <button
          className="button button--secondary"
          type="button"
          onClick={() => setOrders(getStoredOrders())}
        >
          Actualizar
        </button>
      </div>

      <div className="admin-orders__filters">
        {statusFilters.map((filter) => (
          <button
            className={`admin-orders__filter ${
              selectedStatus === filter.id ? "admin-orders__filter--active" : ""
            }`}
            type="button"
            key={filter.id}
            onClick={() => setSelectedStatus(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {visibleOrders.length === 0 ? (
        <div className="admin-orders__empty">
          <h3>No hay pedidos en esta sección.</h3>
          <p>
            Crea un pedido desde el checkout del sitio y después vuelve al panel
            para verlo aquí.
          </p>
        </div>
      ) : (
        <div className="admin-orders__list">
          {visibleOrders.map((order) => {
            const nextStatus = getNextStatus(order.status);

            return (
              <article className="admin-orders__card" key={order.id}>
                <div className="admin-orders__card-header">
                  <div>
                    <span className="admin-orders__code">{order.id}</span>
                    <h3>{order.customer.name}</h3>
                    <p>{order.customer.phone}</p>
                  </div>

                  <span className={`admin-orders__status admin-orders__status--${order.status}`}>
                    {order.statusLabel}
                  </span>
                </div>

                <div className="admin-orders__meta">
                  <div>
                    <span>Recolección</span>
                    <strong>{formatPickupText(order)}</strong>
                  </div>

                  <div>
                    <span>Pago</span>
                    <strong>{formatPaymentText(order)}</strong>
                  </div>

                  <div>
                    <span>Total</span>
                    <strong>${order.total} MXN</strong>
                  </div>
                </div>

                {order.details && (
                  <div className="admin-orders__notes">
                    <span>Detalles</span>
                    <p>{order.details}</p>
                  </div>
                )}

                <div className="admin-orders__items">
                  {order.items.map((item) => (
                    <div className="admin-orders__item" key={item.id}>
                      <img src={item.image} alt={item.name} />
                      <div>
                        <strong>{item.name}</strong>
                        <span>
                          ${item.price} MXN × {item.quantity}
                        </span>
                      </div>
                      <strong>${item.price * item.quantity}</strong>
                    </div>
                  ))}
                </div>

                <div className="admin-orders__actions">
                  {nextStatus && (
                    <button
                      className="button button--primary"
                      type="button"
                      onClick={() => handleChangeStatus(order, nextStatus)}
                    >
                      {getNextStatusButtonText(order.status)}
                    </button>
                  )}

                  {order.status !== "cancelled" &&
                    order.status !== "completed" && (
                      <button
                        className="button button--secondary"
                        type="button"
                        onClick={() => handleCancelOrder(order)}
                      >
                        Cancelar
                      </button>
                    )}

                  <a
                    className="admin-orders__whatsapp"
                    href={getWhatsAppUrl(order, "confirmed")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Confirmar por WhatsApp
                  </a>

                  <a
                    className="admin-orders__whatsapp"
                    href={getWhatsAppUrl(order, "ready")}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Avisar listo
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default AdminOrdersManager;