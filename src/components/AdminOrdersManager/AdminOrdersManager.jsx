import { useState, useRef, useEffect } from "react";
import {
  getAdminOrders,
  updateOrderStatus,
} from "../../utils/api";
import { getAdminToken } from "../../utils/token";
import "./AdminOrdersManager.css";

function AdminOrdersManager() {
  const [orders, setOrders] = useState([]);
  const [ordersError, setOrdersError] = useState("");
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [newOrderNotice, setNewOrderNotice] = useState("");
  const knownOrderIdsRef = useRef(new Set());
  const hasLoadedOrdersRef = useRef(false);

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

  const playNewOrderSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();

      const playBeep = (startTime, frequency) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, startTime);

        gainNode.gain.setValueAtTime(0.0001, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.22, startTime + 0.03);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.28);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.3);
      };

      playBeep(audioContext.currentTime, 880);
      playBeep(audioContext.currentTime + 0.38, 1040);
    } catch (err) {
      console.log(err);
      // Some browsers block audio until the admin interacts with the page.
    }
  };

  const loadOrders = async ({ showLoading = false, notifyNewOrders = false } = {}) => {
    const token = getAdminToken();

    if (showLoading) {
      setIsLoadingOrders(true);
    }

    try {
      const data = await getAdminOrders(token);

      const currentKnownIds = knownOrderIdsRef.current;
      const newOrders = data.filter((order) => !currentKnownIds.has(order._id));

      if (
        notifyNewOrders &&
        hasLoadedOrdersRef.current &&
        newOrders.length > 0
      ) {
        setOrdersError("");
        setNewOrderNotice(
          newOrders.length === 1
            ? "Nuevo pedido recibido."
            : `${newOrders.length} nuevos pedidos recibidos.`
        );
        playNewOrderSound();
      }

      knownOrderIdsRef.current = new Set(data.map((order) => order._id));
      hasLoadedOrdersRef.current = true;

      setOrders(data);
      setOrdersError("");
    } catch (error) {
      setOrdersError(error.message || "No se pudieron cargar los pedidos.");
    } finally {
      if (showLoading) {
        setIsLoadingOrders(false);
      }
    }
  };

  useEffect(() => {
    let intervalId;

    const startOrderPolling = async () => {
      await loadOrders({ showLoading: true });

      intervalId = window.setInterval(() => {
        loadOrders({ notifyNewOrders: true });
      }, 15000);
    };

    startOrderPolling();

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  const handleChangeStatus = async (order, nextStatus) => {
    const token = getAdminToken();

    try {
      const savedOrder = await updateOrderStatus({
        orderId: order._id,
        status: nextStatus,
        token,
      });

      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder._id === savedOrder._id ? savedOrder : currentOrder
        )
      );
    } catch (error) {
      alert(error.message || "No se pudo actualizar el pedido.");
    }
  };

  const handleCancelOrder = (order) => {
    const shouldCancel = window.confirm(
      `¿Seguro que quieres cancelar el pedido ${order.code}?`
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
      confirmed: `Hola ${order.customer.name}, tu pedido ${order.code} en Los Chanchitos fue confirmado. Te avisaremos cuando esté listo.`,
      ready: `Hola ${order.customer.name}, tu pedido ${order.code} en Los Chanchitos ya está listo para recoger. Te esperamos.`,
      custom: `Hola ${order.customer.name}, te escribimos de Los Chanchitos sobre tu pedido ${order.code}.`,
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
          onClick={() => loadOrders({ showLoading: true })}
        >
          Actualizar
        </button>
      </div>

      <p className="admin-orders__live-note">
        El panel revisa pedidos nuevos automáticamente cada 15 segundos.
      </p>

      {newOrderNotice && (
        <div className="admin-orders__new-notice">
          <strong>{newOrderNotice}</strong>
          <button type="button" onClick={() => setNewOrderNotice("")}>
            Entendido
          </button>
        </div>
      )}

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

      {isLoadingOrders && (
        <div className="admin-orders__empty">
          <h3>Cargando pedidos...</h3>
          <p>Estamos consultando los pedidos guardados en el backend.</p>
        </div>
      )}

      {ordersError && (
        <div className="admin-orders__empty">
          <h3>No se pudieron cargar los pedidos.</h3>
          <p>{ordersError}</p>
        </div>
      )}

      {!isLoadingOrders && !ordersError && visibleOrders.length === 0 ? (
        <div className="admin-orders__empty">
          <h3>No hay pedidos en esta sección.</h3>
          <p>
            Crea un pedido desde el checkout del sitio y después vuelve al panel
            para verlo aquí.
          </p>
        </div>
      ) : !isLoadingOrders && !ordersError ? (
        <div className="admin-orders__list">
          {visibleOrders.map((order) => {
            const nextStatus = getNextStatus(order.status);

            return (
              <article className="admin-orders__card" key={order.code}>
                <div className="admin-orders__card-header">
                  <div>
                    <span className="admin-orders__code">{order.code}</span>
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
      ) : null }
    </section>
  );
}

export default AdminOrdersManager;