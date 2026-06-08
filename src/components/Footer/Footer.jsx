import "./Footer.css";

function Footer({ onNavigateHome, onOrderClick, onStatusClick }) {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <h2>Los Chanchitos</h2>
          <p>Pollo al carbón, sirloin y paquetes para recoger en Monterrey.</p>
        </div>

        <div className="footer__links">
          <button type="button" onClick={() => onOrderClick()}>
            Menú
          </button>
          <button type="button" onClick={onNavigateHome}>
            Inicio
          </button>
          <button type="button" onClick={onStatusClick}>
            Consultar pedido
          </button>
          <a href="#ubicacion">Ubicación</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;