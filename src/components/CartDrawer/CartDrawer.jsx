import "./CartDrawer.css";

function CartDrawer({
  cartItems,
  cartTotal,
  cartCount,
  hasMainItem,
  isOpen,
  onClose,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveFromCart,
}) {
  return (
    <aside className={`cart ${isOpen ? "cart--open" : ""}`}>
      <button
        className={`cart__overlay ${isOpen ? "cart__overlay--visible" : ""}`}
        type="button"
        onClick={onClose}
        aria-label="Cerrar carrito"
      ></button>

      <div className="cart__panel">
        <div className="cart__header">
          <div>
            <p className="section__eyebrow">Tu pedido</p>
            <h2>Carrito</h2>
          </div>

          <button className="cart__close" type="button" onClick={onClose}>
            ×
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart__empty">
            <h3>Tu carrito está vacío.</h3>
            <p>Agrega pollo, sirloin, paquetes o complementos para comenzar.</p>
          </div>
        ) : (
          <>
            <div className="cart__items">
              {cartItems.map((item) => (
                <article className="cart__item" key={item.id}>
                  <img src={item.image} alt={item.name} />

                  <div className="cart__item-info">
                    <h3>{item.name}</h3>
                    <p>${item.price} MXN</p>

                    <div className="cart__controls">
                      <button
                        type="button"
                        onClick={() => onDecreaseQuantity(item.id)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onIncreaseQuantity(item.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className="cart__remove"
                    type="button"
                    onClick={() => onRemoveFromCart(item.id)}
                  >
                    Quitar
                  </button>
                </article>
              ))}
            </div>

            <div className="cart__summary">
              <div className="cart__summary-row">
                <span>Productos</span>
                <strong>{cartCount}</strong>
              </div>

              <div className="cart__summary-row">
                <span>Total</span>
                <strong>${cartTotal} MXN</strong>
              </div>

              {!hasMainItem && (
                <p className="cart__warning">
                  Para realizar un pedido, agrega al menos un pollo, sirloin o
                  paquete.
                </p>
              )}

              <button
                className="button button--primary cart__checkout"
                type="button"
                disabled={!hasMainItem}
              >
                Continuar
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

export default CartDrawer;