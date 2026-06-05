import { useSearchParams } from "react-router-dom";
import "./OrderPage.css";

function OrderPage({ menuItems, restaurantStatus, onBackHome }) {
  const [searchParams] = useSearchParams();
  const selectedMenuItemId = searchParams.get("item");

  const categories = [
    "Individuales",
    "Paquetes",
    "Complementos",
    "Bebidas",
    "Ensaladas",
    "Postres",
  ];

  const formatPrice = (price) => {
    return typeof price === "number" ? `$${price} MXN` : price;
  };

  return (
    <section className="order-page section">
      <div className="section__inner">
        <button className="order-page__back" type="button" onClick={onBackHome}>
          ← Volver al inicio
        </button>

        <div className="order-page__header">
          <div>
            <p className="section__eyebrow">Ordena en línea</p>
            <h1 className="section__title">Menú para recoger.</h1>
            <p className="section__text">
              Agrega pollo, sirloin, paquetes o complementos. El pedido mínimo
              requiere al menos un pollo, sirloin o paquete.
            </p>
          </div>

          <aside className="order-page__info">
            <span className="badge">Horario</span>
            <h2>12:00 PM - 5:00 PM</h2>
            <p>Cerrado los martes.</p>

            <div className={`order-page__status ${restaurantStatus.isOpen ? "order-page__status--open" : "order-page__status--closed"}`}>
                <span></span>
                <div>
                    <strong>{restaurantStatus.label}</strong>
                    <p>{restaurantStatus.detail}</p>
                </div>
            </div>
          </aside>
        </div>

        {categories.map((category) => {
          const itemsByCategory = menuItems.filter(
            (item) => item.category === category
          );

          if (itemsByCategory.length === 0) {
            return null;
          }

          return (
            <section className="order-page__category" key={category}>
              <h2>{category}</h2>

              <div className="order-page__grid">
                {itemsByCategory.map((item) => {
                  const isSelected = item.id === selectedMenuItemId;

                  return (
                    <article
                      className={`order-page__card ${
                        isSelected ? "order-page__card--selected" : ""
                      }`}
                      key={item.id}
                    >
                      <div className="order-page__image-wrap">
                        <img src={item.image} alt={item.name} />
                      </div>

                      <div className="order-page__card-content">
                        <div className="order-page__card-top">
                          <span className="badge">{item.badge}</span>
                          {/* {isSelected && (
                            <span className="order-page__selected-label">
                              Seleccionado
                            </span>
                          )} */}
                        </div>

                        <h3>{item.name}</h3>
                        <p>{item.description}</p>

                        <div className="order-page__bottom">
                          <strong>{formatPrice(item.price)}</strong>
                          <button className="button button--primary" type="button">
                            Agregar
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}

export default OrderPage;