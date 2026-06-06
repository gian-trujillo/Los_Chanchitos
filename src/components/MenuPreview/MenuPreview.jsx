import "./MenuPreview.css";

function MenuPreview({ menuItems, onOrderClick, onAddToCart }) {
  const formatPrice = (price) => {
    return typeof price === "number" ? `$${price} MXN` : price;
  };

  return (
    <section className="menu section" id="menu">
      <div className="section__inner">
        <p className="section__eyebrow">Menú</p>
        <h2 className="section__title">Ordena tus favoritos.</h2>
        <p className="section__text">
          Elige pollo, sirloin, paquetes y complementos. También contamos con
          bebidas, ensalada César y flan.
        </p>

        <div className="menu__grid">
          {menuItems.map((item) => (
            <article className="menu__card" key={item.id}>
              <div className="menu__image-wrap">
                <img src={item.image} alt={item.name} />
              </div>

              <div className="menu__content">
                <div className="menu__card-top">
                  <span className="badge">{item.badge}</span>
                  <span className="menu__category">{item.category}</span>
                </div>

                <h3>{item.name}</h3>
                <p>{item.description}</p>

                <div className="menu__bottom">
                  <strong>{formatPrice(item.price)}</strong>
                  <button
                    className="button button--secondary"
                    type="button"
                    onClick={() => onAddToCart(item)}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="menu__full-action">
          <button
            className="button button--primary"
            type="button"
            onClick={() => onOrderClick()}
          >
            Ver menú completo
          </button>
        </div>
      </div>
    </section>
  );
}

export default MenuPreview;