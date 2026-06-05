import "./Header.css";

function Header({ onNavigateHome, onOrderClick }) {
  return (
    <header className="header">
      <div className="header__inner">
        <button
          className="header__brand"
          type="button"
          onClick={onNavigateHome}
          aria-label="Los Chanchitos"
        >
          <span className="header__brand-mark">
            <img src="/images/logo-los-chanchitos.png" alt="" />
          </span>
          <span className="header__brand-name">Los Chanchitos</span>
        </button>

        <nav className="header__nav" aria-label="Navegación principal">
          <button
            className="header__link"
            type="button"
            onClick={() => onOrderClick()}
          >
            Menú
          </button>
          <a className="header__link" href="#como-ordenar">
            Cómo ordenar
          </a>
          <a className="header__link" href="#ubicacion">
            Ubicación
          </a>
          <button className="header__link" type="button">
            Consultar pedido
          </button>
        </nav>

        <button
          className="button button--primary header__cta"
          type="button"
          onClick={() => onOrderClick()}
        >
          Ordenar ahora
        </button>
      </div>
    </header>
  );
}

export default Header;