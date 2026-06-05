import "./Hero.css";

function Hero({ restaurantStatus, onOrderClick }) {
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
            Paga al recoger o elige pago en línea cuando esté disponible.
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
            <span>12:00 PM a 5:00 PM</span>
            <span>Cerrado los martes</span>
            <span>Pedido mínimo: pollo, sirloin o paquete</span>
          </div>
        </div>

        <button
          className="hero__card"
          type="button"
          onClick={() => onOrderClick("paquete-familiar-asado")}
          aria-label="Ordenar Paquete Familiar Asado"
        >
          <div className="hero__image-wrap">
            <img
              src="/images/products/paquete-familiar-asado.jpg"
              alt="Paquete Familiar Asado de Los Chanchitos"
            />
          </div>

          <div className="hero__featured">
            <span className="badge">Recomendado</span>
            <h2>Paquete Familiar Asado</h2>
            <p>1 pollo asado, 1 kg sirloin, cebolla asada y salchicha.</p>
            <strong>$589 MXN</strong>
          </div>
        </button>
      </div>
    </section>
  );
}

export default Hero;