import { useState } from "react";
import "./AdminMenuManager.css";

function AdminMenuManager({
  menuItems,
  inventoryItems,
  onCreateMenuItem,
  onUpdateMenuItem,
  onToggleMenuItemAvailability,
  onDeleteMenuItem,
  onUploadMenuImage,
}) {
  const emptyForm = {
    id: "",
    name: "",
    category: "Individuales",
    price: "",
    badge: "",
    description: "",
    image: "",
    imagePublicId: "",
    options: [],
    inventoryUsage: [],
    isFeatured: false,
    isAvailable: true,
  };

  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [formValues, setFormValues] = useState(emptyForm);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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
    setFormMessage("");
    setFormError("");
    setSelectedImageFile(null);
    setIsUploadingImage(false);
  };

  const handleOpenCreateForm = () => {
    setFormValues(emptyForm);
    setEditingItemId(null);
    setIsFormOpen(true);
  };

  const handleEditItem = (item) => {
    setFormValues({
      _id: item._id,
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      badge: item.badge || "",
      description: item.description || "",
      image: item.image || "",
      imagePublicId: item.imagePublicId || "",
      options: (item.options || []).map((option) => ({
        ...option,
        tempId: crypto.randomUUID(),
      })),
      inventoryUsage: (item.inventoryUsage || []).map((usage) => ({
        ...usage,
        tempId: crypto.randomUUID(),
      })),
      isFeatured: Boolean(item.isFeatured),
      isAvailable: item.isAvailable !== false,
    });
    setEditingItemId(item.id);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setSelectedImageFile(file);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    setFormMessage("");
    setFormError("");

    const generatedId = createSlug(formValues.name);
    const itemId = editingItemId || generatedId;

    const hasOptions = formValues.options.length > 0;

    const priceValue = hasOptions ? formValues.price : Number(formValues.price);

    if (
      !formValues.name ||
      !formValues.category ||
      (!hasOptions && Number.isNaN(priceValue))
    ) {
      setFormError("Completa los campos requeridos correctamente.");
      setIsSubmitting(false);
      return;
    }



    let imageUrl = formValues.image || "/images/products/placeholder-product.jpg";
    let imagePublicId = formValues.imagePublicId || "";

    if (selectedImageFile) {
      setIsUploadingImage(true);

      const uploadResult = await onUploadMenuImage(selectedImageFile);

      setIsUploadingImage(false);

      if (!uploadResult.success) {
        setFormError(uploadResult.message || "No se pudo subir la imagen.");
        setIsSubmitting(false);
        return;
      }

      imageUrl = uploadResult.imageUrl;
      imagePublicId = uploadResult.publicId;
    }

    const cleanOptions = formValues.options
      .filter((option) => option.name && option.price !== "")
      .map((option) => ({
        id: option.id || createSlug(option.name),
        name: option.name,
        price: Number(option.price),
      }));

    const cleanInventoryUsage = formValues.inventoryUsage
      .filter((usage) => usage.inventoryId && usage.amount !== "")
      .map((usage) => ({
        inventoryId: usage.inventoryId,
        amount: Number(usage.amount),
      }));

    const itemPayload = {
      ...formValues,
      id: itemId,
      price: cleanOptions.length > 0 ? `Desde $${cleanOptions[0].price}` : priceValue,
      image: imageUrl,
      imagePublicId,
      options: cleanOptions.length > 0 ? cleanOptions : undefined,
      inventoryUsage:
        cleanInventoryUsage.length > 0 ? cleanInventoryUsage : undefined,
    };

    let result;

    if (editingItemId) {
      result = await onUpdateMenuItem(itemPayload);
    } else {
      result = await onCreateMenuItem(itemPayload);
    }

    if (result.success) {
      setFormMessage(
        editingItemId
          ? "Producto actualizado correctamente."
          : "Producto creado correctamente."
      );
      resetForm();
    } else {
      setFormError(result.message || "No se pudo guardar el producto.");
    }

    setIsSubmitting(false);
  };

  const handleAddOption = () => {
    setFormValues((currentValues) => ({
      ...currentValues,
      options: [
        ...currentValues.options,
        {
          tempId: crypto.randomUUID(),
          id: "",
          name: "",
          price: "",
        },
      ],
    }));
  };

  const handleOptionChange = (optionIndex, field, value) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      options: currentValues.options.map((option, index) =>
        index === optionIndex
          ? {
              ...option,
              [field]: value,
            }
          : option
      ),
    }));
  };

  const handleRemoveOption = (optionIndex) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      options: currentValues.options.filter((option, index) => {
        return index !== optionIndex;
      }),
    }));
  };

  const handleAddInventoryUsage = () => {
    const firstInventoryItem = inventoryItems[0];

    if (!firstInventoryItem) {
      return;
    }

    setFormValues((currentValues) => ({
      ...currentValues,
      inventoryUsage: [
        ...currentValues.inventoryUsage,
        {
          tempId: crypto.randomUUID(),
          inventoryId: firstInventoryItem.id,
          amount: "",
        },
      ],
    }));
  };

  const handleInventoryUsageChange = (usageIndex, field, value) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      inventoryUsage: currentValues.inventoryUsage.map((usage, index) =>
        index === usageIndex
          ? {
              ...usage,
              [field]: value,
            }
          : usage
      ),
    }));
  };

  const handleRemoveInventoryUsage = (usageIndex) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      inventoryUsage: currentValues.inventoryUsage.filter((usage, index) => {
        return index !== usageIndex;
      }),
    }));
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

            <section className="admin-menu__subsection admin-menu__field--wide">
              <div className="admin-menu__subsection-header">
                <div>
                  <h4>Opciones del producto</h4>
                  <p>
                    Úsalo para productos como arroz o frijoles con tamaños/precios
                    diferentes.
                  </p>
                </div>

                <button
                  className="button button--secondary"
                  type="button"
                  onClick={handleAddOption}
                >
                  Agregar tamaño/opción
                </button>
              </div>

              {formValues.options.length > 0 && (
                <div className="admin-menu__nested-list">
                  {formValues.options.map((option, index) => (
                    <div className="admin-menu__nested-row" key={option.tempId}>
                      <label className="admin-menu__field">
                        <span>Nombre de opción</span>
                        <input
                          type="text"
                          value={option.name}
                          onChange={(event) =>
                            handleOptionChange(index, "name", event.target.value)
                          }
                          placeholder="Ej. Chico"
                        />
                      </label>

                      <label className="admin-menu__field">
                        <span>Precio</span>
                        <input
                          type="number"
                          min="0"
                          value={option.price}
                          onChange={(event) =>
                            handleOptionChange(index, "price", event.target.value)
                          }
                          placeholder="20"
                        />
                      </label>

                      <button
                        className="admin-menu__remove-button"
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
            <section className="admin-menu__subsection admin-menu__field--wide">
              <div className="admin-menu__subsection-header">
                <div>
                  <h4>Uso de inventario</h4>
                  <p>
                    Define qué inventario se descuenta cuando se vende este producto. Déjalo
                    vacío para productos no rastreados.
                  </p>
                </div>

                <button
                  className="button button--secondary"
                  type="button"
                  onClick={handleAddInventoryUsage}
                >
                  Agregar ingrediente
                </button>
              </div>

              {formValues.inventoryUsage.length > 0 && (
                <div className="admin-menu__nested-list">
                  {formValues.inventoryUsage.map((usage, index) => (
                    <div
                      className="admin-menu__nested-row"
                      key={usage.tempId}
                    >
                      <label className="admin-menu__field">
                        <span>Inventario</span>
                        <select
                          value={usage.inventoryId}
                          onChange={(event) =>
                            handleInventoryUsageChange(
                              index,
                              "inventoryId",
                              event.target.value
                            )
                          }
                        >
                          {inventoryItems.map((inventoryItem) => (
                            <option value={inventoryItem.id} key={inventoryItem.id}>
                              {inventoryItem.name} ({inventoryItem.displayUnit})
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="admin-menu__field">
                        <span>Cantidad a descontar</span>
                        <input
                          type="number"
                          min="0"
                          value={usage.amount}
                          onChange={(event) =>
                            handleInventoryUsageChange(index, "amount", event.target.value)
                          }
                          placeholder="Ej. 1"
                        />
                      </label>

                      <button
                        className="admin-menu__remove-button"
                        type="button"
                        onClick={() => handleRemoveInventoryUsage(index)}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="admin-menu__helper">
                Referencia: pollo entero = 2 medios, medio pollo = 1 medio, 1 kg sirloin =
                1000 gramos, 1/2 kg sirloin = 500 gramos.
              </p>
              {formValues.inventoryUsage.length === 0 && (
                <p className="admin-menu__inventory-warning">
                  Este producto no descontará inventario. Esto está bien para productos no
                  rastreados, pero no para paquetes, pollo o sirloin.
                </p>
              )}
            </section>

            <div className="admin-menu__field admin-menu__field--wide">
              <span>Imagen del producto</span>

              {formValues.image && (
                <img
                  className="admin-menu__image-preview"
                  src={formValues.image}
                  alt="Vista previa del producto"
                />
              )}

              <input
                name="imageFile"
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
              />

              <small>
                Sube una imagen nueva o conserva la imagen actual. Tamaño máximo recomendado:
                10 MB. Las imágenes subidas aquí se guardan en Cloudinary.
              </small>
            </div>

            <label className="admin-menu__field admin-menu__field--wide">
              <span>Ruta manual de imagen — avanzado</span>
              <small>
                Úsalo solo para imágenes que ya existen en la carpeta public, por ejemplo:
                /images/products/pollo-asado.jpg.
              </small>
              <input
                name="image"
                type="text"
                value={formValues.image}
                onChange={handleChange}
                placeholder="/images/products/nuevo-producto.jpg"
              />
            </label>

            <label className="admin-menu__checkbox">
              <input
                name="isFeatured"
                type="checkbox"
                checked={formValues.isFeatured}
                onChange={handleChange}
              />
              <span>
                Destacar en inicio
                <small>Actualmente solo aparece en inicio si el producto es un paquete.</small>
              </span>
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
            <button className="button button--primary" type="submit" disabled={isSubmitting || isUploadingImage}>
              {isSubmitting || isUploadingImage ? "Guardando..." : editingItemId ? "Guardar cambios" : "Guardar producto"}
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
            {formMessage && <p className="admin-menu__success">{formMessage}</p>}
            {formError && <p className="admin-menu__error">{formError}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}

export default AdminMenuManager;