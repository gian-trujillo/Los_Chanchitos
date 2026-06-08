import "./AdminLayout.css";

function AdminLayout({
  children,
  activeSection = "dashboard",
  onSectionChange,
  onLogout,
}) {
  const navItems = [
    {
      id: "dashboard",
      label: "Resumen",
    },
    {
      id: "orders",
      label: "Pedidos",
    },
    {
      id: "menu",
      label: "Menú",
    },
    {
      id: "inventory",
      label: "Inventario",
    },
    {
      id: "settings",
      label: "Configuración",
    },
  ];

  return (
    <section className="admin-layout">
      <aside className="admin-layout__sidebar">
        <div className="admin-layout__brand">
          <img src="/images/logo-los-chanchitos.png" alt="" />
          <div>
            <h2>Los Chanchitos</h2>
            <p>Admin</p>
          </div>
        </div>

        <nav className="admin-layout__nav" aria-label="Navegación de admin">
          {navItems.map((item) => (
            <button
              className={`admin-layout__nav-button ${
                activeSection === item.id
                  ? "admin-layout__nav-button--active"
                  : ""
              }`}
              type="button"
              key={item.id}
              onClick={() => onSectionChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          className="admin-layout__logout"
          type="button"
          onClick={onLogout}
        >
          Cerrar sesión
        </button>
      </aside>

      <div className="admin-layout__main">
        <header className="admin-layout__topbar">
          <div>
            <p className="section__eyebrow">Panel administrativo</p>
            <h1>Dashboard</h1>
          </div>

          <a className="button button--secondary" href="/" target="_blank">
            Ver sitio
          </a>
        </header>

        {children}
      </div>
    </section>
  );
}

export default AdminLayout;