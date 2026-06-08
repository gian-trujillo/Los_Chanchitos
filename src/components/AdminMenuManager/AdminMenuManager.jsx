import { useState } from "react";
import "./AdminMenuManager.css";

function AdminMenuManager({ menuItems }) {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const categories = [
    "Todos",
    "Individuales",
    "Paquetes",
    "Complementos",
    "Bebidas",
    "Ensaladas",
    "Postres",
  ];

  const visibleItems =
    selectedCategory === "Todos"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  const formatPrice = (price) => {
    return typeof price === "number" ? `$${price} MXN` : price;
  };

  return (
    <section className="admin-menu">
      <div className="admin-menu__header">
        <div>
          <p className="section__eyebrow">Menú</p>
          <h2>Administrar productos</h2>
          <p>
            Aquí podrás crear, editar, ocultar y eliminar productos. Por ahora es
            una interfaz de diseño conectada a los datos locales.
          </p>
        </div>

        <button
          className="button button--primary"
          type="button"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? "Cerrar formulario" : "Agregar producto"}
        </button>
      </div>

      {isFormOpen && (
        <form className="admin-menu__form">
          <div className="admin-menu__form-header">
            <h3>Nuevo producto</h3>
            <p>
              Más adelante este formulario enviará la información al backend y
              subirá la imagen a la nube.
            </p>
          </div>

          <div className="admin-menu__form-grid">
            <label className="admin-menu__field">
              <span>Nombre</span>
              <input type="text" placeholder="Ej. 1 Pollo Asado" />
            </label>

            <label className="admin-menu__field">
              <span>Categoría</span>
              <select defaultValue="Individuales">
                <option>Individuales</option>
                <option>Paquetes</option>
                <option>Complementos</option>
                <option>Bebidas</option>
                <option>Ensaladas</option>
                <option>Postres</option>
              </select>
            </label>

            <label className="admin-menu__field">
              <span>Precio</span>
              <input type="number" placeholder="225" />
            </label>

            <label className="admin-menu__field">
              <span>Etiqueta</span>
              <input type="text" placeholder="Ej. Clásico" />
            </label>

            <label className="admin-menu__field admin-menu__field--wide">
              <span>Descripción</span>
              <textarea
                rows="4"
                placeholder="Descripción breve del producto..."
              ></textarea>
            </label>

            <label className="admin-menu__field admin-menu__field--wide">
              <span>Imagen</span>
              <input type="file" accept="image/*" />
              <small>
                Después esto subirá la imagen a Cloudinary u otro servicio y
                guardará la URL.
              </small>
            </label>
          </div>

          <div className="admin-menu__form-actions">
            <button className="button button--primary" type="button">
              Guardar producto
            </button>
            <button
              className="button button--secondary"
              type="button"
              onClick={() => setIsFormOpen(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="admin-menu__filters">
        {categories.map((category) => (
          <button
            className={`admin-menu__filter ${
              selectedCategory === category ? "admin-menu__filter--active" : ""
            }`}
            type="button"
            key={category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="admin-menu__table">
        <div className="admin-menu__table-head">
          <span>Producto</span>
          <span>Categoría</span>
          <span>Precio</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>

        {visibleItems.map((item) => (
          <article className="admin-menu__row" key={item.id}>
            <div className="admin-menu__product">
              <img src={item.image} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                {item.options && (
                  <small>
                    Opciones:{" "}
                    {item.options
                      .map((option) => `${option.name} $${option.price}`)
                      .join(", ")}
                  </small>
                )}
              </div>
            </div>

            <span>{item.category}</span>
            <strong>{formatPrice(item.price)}</strong>

            <span className="admin-menu__status">Activo</span>

            <div className="admin-menu__actions">
              <button type="button">Editar</button>
              <button type="button">Ocultar</button>
              <button type="button">Eliminar</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AdminMenuManager;