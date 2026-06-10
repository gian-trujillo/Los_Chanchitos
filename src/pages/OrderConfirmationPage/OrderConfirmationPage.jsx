import "./OrderConfirmationPage.css";

function OrderConfirmationPage({ order, onBackToMenu, onBackHome }) {
  if (!order) {
    return (
      <section className="confirmation section">
        <div className="confirmation__empty section__inner">
          <p className="section__eyebrow">Pedido</p>
          <h1 className="section__title">No encontramos un pedido activo.</h1>
          <p className="section__text">
            Si acabas de ordenar, vuelve al menú e intenta nuevamente.
          </p>

          <div className="confirmation__actions">
            <button className="button button--primary" type="button" onClick={() => onBackToMenu()}>
              Ver menú
            </button>
            <button className="button button--secondary" type="button" onClick={onBackHome}>
              Volver al inicio
            </button>
          </div>
        </div>
      </section>
    );
  }

  const pickupText =
    order.pickup.type === "asap"
      ? "Lo antes posible"
      : `Programado para ${order.pickup.time}`;

  const paymentText =
    order.paymentMethod === "pickup" ? "Pagar al recoger" : "Pago en línea";

  return (
    <section className="confirmation section">
      <div className="confirmation__inner section__inner">
        <div className="confirmation__hero">
          <p className="section__eyebrow">Pedido confirmado</p>
          <h1 className="section__title">Recibimos tu pedido.</h1>
          <p className="section__text">
            Guarda tu número de pedido. Más adelante conectaremos esta pantalla
            al backend para consultar el estado real.
          </p>
        </div>

        <div className="confirmation__layout">
          <article className="confirmation__card">
            <span className="badge">Número de pedido</span>
            <h2>{order.code}</h2>

            <div className="confirmation__status">
              <span></span>
              <div>
                <strong>{order.statusLabel}</strong>
                <p>El restaurante recibirá tu pedido para prepararlo.</p>
              </div>
            </div>

            <div className="confirmation__details">
              <div>
                <span>Cliente</span>
                <strong>{order.customer.name}</strong>
              </div>

              <div>
                <span>Teléfono</span>
                <strong>{order.customer.phone}</strong>
              </div>

              <div>
                <span>Recolección</span>
                <strong>{pickupText}</strong>
              </div>

              <div>
                <span>Pago</span>
                <strong>{paymentText}</strong>
              </div>
            </div>

            {order.details && (
              <div className="confirmation__notes">
                <span>Detalles</span>
                <p>{order.details}</p>
              </div>
            )}
          </article>

          <aside className="confirmation__summary">
            <h2>Resumen del pedido</h2>

            <div className="confirmation__items">
              {order.items.map((item) => (
                <article className="confirmation__item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>
                      ${item.price} MXN × {item.quantity}
                    </p>
                  </div>
                  <strong>${item.price * item.quantity}</strong>
                </article>
              ))}
            </div>

            <div className="confirmation__total">
              <span>Total</span>
              <strong>${order.total} MXN</strong>
            </div>
          </aside>
        </div>

        <div className="confirmation__actions">
          <button className="button button--primary" type="button" onClick={() => onBackToMenu()}>
            Hacer otro pedido
          </button>
          <button className="button button--secondary" type="button" onClick={onBackHome}>
            Volver al inicio
          </button>
        </div>
      </div>
    </section>
  );
}

export default OrderConfirmationPage;