import "./LocationHours.css";
import { getClosedDayLabel, formatSettingsTime } from "../../utils/restaurantFormatters";

function LocationHours({ restaurantStatus, restaurantSettings }) {
  const openingLabel = formatSettingsTime(restaurantSettings.openingTime);
  const closingLabel = formatSettingsTime(restaurantSettings.closingTime);
  const closedDayLabel = getClosedDayLabel(restaurantSettings.closedDay);

  return (
    <section className="location section" id="ubicacion">
      <div className="location__inner section__inner">
        <div>
          <p className="section__eyebrow">Ubicación</p>
          <h2 className="section__title">Pide y recoge en Monterrey.</h2>
          <p className="section__text">
            Estamos en {restaurantSettings.address}
          </p>

          <div className="location__actions">
            <a
              className="button button--primary"
              href="https://www.google.com/maps/search/?api=1&query=Av.+Prof.+Moises+Saenz+1112B,+Leones,+64600+Monterrey,+N.L."
              target="_blank"
              rel="noreferrer"
            >
              Abrir en Maps
            </a>
            <a className="button button--secondary" href="#menu">
              Ordenar ahora
            </a>
          </div>
        </div>

        <aside className="location__card">
          <span className="badge location__badge">Horario</span>
          <h3>{openingLabel} - {closingLabel}</h3>
          <p>
            Cerrado los {closedDayLabel}. Los pedidos para recoger se aceptan durante horario de servicio.
          </p>

          <div
            className={`location__status ${
              restaurantStatus.isOpen
                ? "location__status--open"
                : "location__status--closed"
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
    </section>
  );
}

export default LocationHours;