import { useState } from "react";
import "./AdminMenuManager.css";

function AdminMenuManager({
  menuItems,
  onCreateMenuItem,
  onUpdateMenuItem,
  onToggleMenuItemAvailability,
  onDeleteMenuItem,
}) {
  const emptyForm = {
    id: "",
    name: "",
    category: "Individuales",
    price: "",
    badge: "",
    description: "",
    image: "",
    isFeatured: false,
    isAvailable: true,
  };

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [formValues, setFormValues] = useState(emptyForm);

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

  const createSlug = (value) => {
    return value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const resetForm = () => {
    setFormValues(emptyForm);
    setEditingItemId(null);
    setIsFormOpen(false);
  };

  const handleOpenCreateForm = () => {
    setFormValues(emptyForm);
    setEditingItemId(null);
    setIsFormOpen(true);
  };

  const handleEditItem = (item) => {
    setFormValues({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      badge: item.badge || "",
      description: item.description || "",
      image: item.image || "",
      isFeatured: Boolean(item.isFeatured),
      isAvailable: item.isAvailable !== false,
    });
    setEditingItemId(item.id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const generatedId = createSlug(formValues.name);
    const itemId = editingItemId || generatedId;

    const priceValue = Number(formValues.price);

    if (!formValues.name || !formValues.category || Number.isNaN(priceValue)) {
      return;
    }

    const itemPayload = {
      id: itemId,
      name: formValues.name,
      category: formValues.category,
      price: priceValue,
      badge: formValues.badge,
      description: formValues.description,
      image: formValues.image || "/images/products/placeholder-product.jpg",
      isFeatured: formValues.isFeatured,
      isAvailable: formValues.isAvailable,
    };

    if (editingItemId) {
      onUpdateMenuItem(itemPayload);
    } else {
      onCreateMenuItem(itemPayload);
    }

    resetForm();
  };

  return (
    <section className="admin-menu">
      <div className="admin-menu__header">
        <div>
          <p className="section__eyebrow">Menú</p>
          <h2>Administrar productos</h2>
          <p>
            Crea, edita, oculta y elimina productos. Estos cambios son temporales
            hasta que conectemos el backend.
          </p>
        </div>

        <button
          className="button button--primary"
          type="button"
          onClick={isFormOpen ? resetForm : handleOpenCreateForm}
        >
          {isFormOpen ? "Cerrar formulario" : "Agregar producto"}
        </button>
      </div>

      {isFormOpen && (
        <form className="admin-menu__form" onSubmit={handleSubmit}>
          <div className="admin-menu__form-header">
            <h3>{editingItemId ? "Editar producto" : "Nuevo producto"}</h3>
            <p>
              Por ahora usa una ruta de imagen existente, por ejemplo:
              /images/products/pollo-asado.jpg. Después agregaremos subida a la
              nube.
            </p>
          </div>

          <div className="admin-menu__form-grid">
            <label className="admin-menu__field">
              <span>Nombre</span>
              <input
                name="name"
                type="text"
                value={formValues.name}
                onChange={handleChange}
                placeholder="Ej. 1 Pollo Asado"
                required
              />
            </label>

            <label className="admin-menu__field">
              <span>Categoría</span>
              <select
                name="category"
                value={formValues.category}
                onChange={handleChange}
              >
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
              <input
                name="price"
                type="number"
                value={formValues.price}
                onChange={handleChange}
                placeholder="225"
                min="0"
                required
              />
            </label>

            <label className="admin-menu__field">
              <span>Etiqueta</span>
              <input
                name="badge"
                type="text"
                value={formValues.badge}
                onChange={handleChange}
                placeholder="Ej. Clásico"
              />
            </label>

            <label className="admin-menu__field admin-menu__field--wide">
              <span>Descripción</span>
              <textarea
                name="description"
                rows="4"
                value={formValues.description}
                onChange={handleChange}
                placeholder="Descripción breve del producto..."
              ></textarea>
            </label>

            <label className="admin-menu__field admin-menu__field--wide">
              <span>Ruta de imagen</span>
              <input
                name="image"
                type="text"
                value={formValues.image}
                onChange={handleChange}
                placeholder="/images/products/nuevo-producto.jpg"
              />
              <small>
                Después esto será reemplazado por subida a Cloudinary u otro
                servicio.
              </small>
            </label>

            <label className="admin-menu__checkbox">
              <input
                name="isFeatured"
                type="checkbox"
                checked={formValues.isFeatured}
                onChange={handleChange}
              />
              <span>Mostrar como destacado</span>
            </label>

            <label className="admin-menu__checkbox">
              <input
                name="isAvailable"
                type="checkbox"
                checked={formValues.isAvailable}
                onChange={handleChange}
              />
              <span>Producto activo</span>
            </label>
          </div>

          <div className="admin-menu__form-actions">
            <button className="button button--primary" type="submit">
              {editingItemId ? "Guardar cambios" : "Guardar producto"}
            </button>
            <button
              className="button button--secondary"
              type="button"
              onClick={resetForm}
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

            <span
              className={`admin-menu__status ${
                item.isAvailable === false ? "admin-menu__status--hidden" : ""
              }`}
            >
              {item.isAvailable === false ? "Oculto" : "Activo"}
            </span>

            <div className="admin-menu__actions">
              <button type="button" onClick={() => handleEditItem(item)}>
                Editar
              </button>
              <button
                type="button"
                onClick={() => onToggleMenuItemAvailability(item.id)}
              >
                {item.isAvailable === false ? "Mostrar" : "Ocultar"}
              </button>
              <button
                type="button"
                onClick={() => onDeleteMenuItem(item.id)}
              >
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AdminMenuManager;