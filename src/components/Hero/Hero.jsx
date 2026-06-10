import "./Hero.css";
import { getClosedDayLabel, formatSettingsTime } from "../../utils/restaurantFormatters";

function Hero({ heroItem, restaurantStatus, onOrderClick, onAddToCart, restaurantSettings }) {
  const openingLabel = formatSettingsTime(restaurantSettings.openingTime);
  const closingLabel = formatSettingsTime(restaurantSettings.closingTime);
  const closedDayLabel = getClosedDayLabel(restaurantSettings.closedDay);

  return (
    <section className="hero section" id="inicio">
      <div className="hero__inner section__inner">
        <div className="hero__content">
          <p className="section__eyebrow">Pollos asados y al ataúd en Monterrey</p>

          <h1 className="hero__title">
            Pollo, sirloin y paquetes listos para recoger.
          </h1>

          <p className="hero__text">
            Haz tu pedido en línea en Los Chanchitos y pasa por él recién hecho.
            Tiempo estimado de preparación: {restaurantSettings.estimatedPrepTime} minutos.
          </p>

          <div className="hero__actions">
            <button
              className="button button--primary"
              type="button"
              onClick={() => onOrderClick()}
            >
              Ver menú
            </button>
            <a className="button button--secondary" href="#ubicacion">
              Ver ubicación
            </a>
          </div>

          <div className="hero__info">
            <span
              className={`hero__status ${
                restaurantStatus.isOpen
                  ? "hero__status--open"
                  : "hero__status--closed"
              }`}
            >
              {restaurantStatus.label}
            </span>
            <span>{openingLabel} a {closingLabel}</span>
            <span>Cerrado los {closedDayLabel}</span>
            <span>Pedido mínimo: pollo, sirloin o paquete</span>
          </div>
        </div>

        <button
          className={`hero__card ${
            heroItem?.inventoryStatus?.isSoldOut ? "hero__card--sold-out" : ""
          }`}
          type="button"
          disabled={heroItem?.inventoryStatus?.isSoldOut}
          onClick={() => {
            if (!heroItem || heroItem.inventoryStatus?.isSoldOut) {
              return;
            }

            onAddToCart(heroItem);
          }}
          aria-label="Ordenar Paquete Familiar Asado"
        >
          <div className="hero__image-wrap">
            <img
              src={heroItem?.image || "/images/products/paquete-familiar-asado.jpg"}
              alt={heroItem?.name || "Paquete Familiar Asado de Los Chanchitos"}
            />
          </div>

          <div className="hero__featured">
            <span className="badge">Recomendado</span>

            {heroItem?.inventoryStatus?.isLowStock && (
              <span className="hero__stock-badge">
                {heroItem.inventoryStatus.lowStockLabel}
              </span>
            )}

            {heroItem?.inventoryStatus?.isSoldOut && (
              <span className="hero__stock-badge hero__stock-badge--sold-out">
                Agotado
              </span>
            )}

            <h2>{heroItem?.name || "Paquete Familiar Asado"}</h2>
            <p>
              {heroItem?.description ||
                "1 pollo asado, 1 kg sirloin, cebolla asada y salchicha."}
            </p>
            <strong>${heroItem?.price || 589} MXN</strong>
          </div>
        </button>
      </div>
    </section>
  );
}

export default Hero;