import "./Footer.css";
import instagram from "/instagram.png"

function Footer({ onNavigateHome, onOrderClick, onStatusClick, onSectionClick }) {

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

          <button type="button" onClick={() => onSectionClick("ubicacion")}>
            Ubicación
          </button>

          <a className="footer__link" href="https://instagram.com/loschanchitospollos" target="blank">
          <img src={instagram} alt="icono de instagram de los chanchitos" /></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;