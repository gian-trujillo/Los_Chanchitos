import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./OrderPage.css";
import { getClosedDayLabel, formatSettingsTime } from "../../utils/restaurantFormatters";

function OrderPage({
  menuItems,
  restaurantStatus,
  restaurantSettings,
  onBackHome,
  onAddToCart,
}) {
  const [searchParams] = useSearchParams();
  const selectedMenuItemId = searchParams.get("item");
  const [selectedOptions, setSelectedOptions] = useState({});

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

    const openingLabel = formatSettingsTime(restaurantSettings.openingTime);
    const closingLabel = formatSettingsTime(restaurantSettings.closingTime);
    const closedDayLabel = getClosedDayLabel(restaurantSettings.closedDay);

  const handleOptionChange = (itemId, optionId) => {
    setSelectedOptions((currentOptions) => ({
      ...currentOptions,
      [itemId]: optionId,
    }));
  };

  const handleAddItem = (item) => {
    if (item.inventoryStatus?.isSoldOut) {
      return;
    }


    if (!item.options) {
      onAddToCart(item);
      return;
    }

    const selectedOptionId = selectedOptions[item.id];
    const selectedOption = item.options.find(
      (option) => option.id === selectedOptionId
    );

    if (!selectedOption) {
      alert("Selecciona una opción antes de agregar este producto.");
      return;
    }

    onAddToCart(item, selectedOption);
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
            <h2>{openingLabel} - {closingLabel}</h2>
            <p>Cerrado los {closedDayLabel}.</p>

            <div
              className={`order-page__status ${
                restaurantStatus.isOpen
                  ? "order-page__status--open"
                  : "order-page__status--closed"
              }`}
            >
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
                      } ${item.inventoryStatus?.isSoldOut ? "order-page__card--sold-out" : ""}`}
                      key={item.id}
                    >
                      <div className="order-page__image-wrap">
                        <img src={item.image} alt={item.name} />
                      </div>

                      <div className="order-page__card-content">
                        <div className="order-page__card-top">
                          <span className="badge">{item.badge}</span>
                          {isSelected && (
                            <span className="order-page__selected-label">
                              Seleccionado
                            </span>
                          )}
                          {item.inventoryStatus?.isLowStock && (
                            <span className="order-page__stock-badge">
                              {item.inventoryStatus.lowStockLabel}
                            </span>
                          )}

                          {item.inventoryStatus?.isSoldOut && (
                            <span className="order-page__stock-badge order-page__stock-badge--sold-out">
                              Agotado
                            </span>
                          )}
                        </div>

                        <h3>{item.name}</h3>
                        <p>{item.description}</p>

                        {item.options && (
                          <div className="order-page__options">
                            {item.options.map((option) => (
                              <label
                                className="order-page__option"
                                key={option.id}
                              >
                                <input
                                  type="radio"
                                  name={`${item.id}-option`}
                                  value={option.id}
                                  checked={
                                    selectedOptions[item.id] === option.id
                                  }
                                  onChange={() =>
                                    handleOptionChange(item.id, option.id)
                                  }
                                />
                                <span>{option.name}</span>
                                <strong>${option.price} MXN</strong>
                              </label>
                            ))}
                          </div>
                        )}

                        <div className="order-page__bottom">
                          <strong>{formatPrice(item.price)}</strong>
                          <button
                            className="button button--primary"
                            type="button"
                            disabled={item.inventoryStatus?.isSoldOut}
                            onClick={() => handleAddItem(item)}
                          >
                            {item.inventoryStatus?.isSoldOut ? "Agotado" : "Agregar"}
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