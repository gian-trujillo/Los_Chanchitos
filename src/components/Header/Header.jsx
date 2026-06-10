import "./Header.css";

function Header({ cartCount, onNavigateHome, onOrderClick, onCartClick, onStatusClick, onSectionClick }) {
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
          <button className="header__link" type="button" onClick={() => onSectionClick("como-ordenar")}>
            Cómo ordenar
          </button>

          <button className="header__link" type="button" onClick={() => onSectionClick("ubicacion")}>
            Ubicación
          </button>
          <button className="header__link" type="button" onClick={onStatusClick}>
            Consultar pedido
          </button>
        </nav>

        <div className="header__actions">
          <button
            className="header__cart"
            type="button"
            onClick={onCartClick}
            aria-label="Abrir carrito"
          >
            Carrito
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>

          <button
            className="button button--primary header__cta"
            type="button"
            onClick={() => onOrderClick()}
          >
            Ordenar ahora
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;