import { useState } from "react";
import "./AdminInventoryManager.css";

function AdminInventoryManager({ inventoryItems, onUpdateInventoryItem }) {
  const [editingItemId, setEditingItemId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");

  const getDisplayQuantity = (item) => {
    if (item.storedUnit === "grams") {
      return item.quantity / 1000;
    }

    return item.quantity;
  };

  const getStoredQuantityFromInput = (item, value) => {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue) || numericValue < 0) {
      return item.quantity;
    }

    if (item.storedUnit === "grams") {
      return Math.round(numericValue * 1000);
    }

    return numericValue;
  };

  const isLowStock = (item) => {
    return item.quantity <= item.lowStockThreshold;
  };

  const handleEditClick = (item) => {
    setEditingItemId(item.id);
    setInputValue(String(getDisplayQuantity(item)));
  };

  const handleCancel = () => {
    setEditingItemId(null);
    setInputValue("");
  };

  const handleSave = async (item) => {
    const updatedQuantity = getStoredQuantityFromInput(item, inputValue);

    const result = await onUpdateInventoryItem({
      ...item,
      quantity: updatedQuantity,
    });

    if (result.success) {
      setFormMessage("Inventario actualizado correctamente.");
      setFormError("");
      handleCancel();
    } else {
      setFormError(result.message || "No se pudo actualizar el inventario.");
      setFormMessage("");
    }
  };

  const handleQuickAdjust = async (item, amount) => {
    const updatedQuantity = Math.max(0, item.quantity + amount);

    const result = await onUpdateInventoryItem({
      ...item,
      quantity: updatedQuantity,
    });

    if (result.success) {
      setFormMessage("Inventario actualizado correctamente.");
      setFormError("");
    } else {
      setFormError(result.message || "No se pudo actualizar el inventario.");
      setFormMessage("");
    }
  };

  return (
    <section className="admin-inventory">
      <div className="admin-inventory__header">
        <div>
          <p className="section__eyebrow">Inventario</p>
          <h2>Control de stock</h2>
          <p>
            Ajusta la disponibilidad diaria de pollo, sirloin y complementos.
            Por ahora estos cambios son temporales hasta conectar el backend.
          </p>
        </div>
      </div>

      {formMessage && <p className="admin-inventory__success">{formMessage}</p>}
      {formError && <p className="admin-inventory__error">{formError}</p>}

      <div className="admin-inventory__grid">
        {inventoryItems.map((item) => {
          const displayQuantity = getDisplayQuantity(item);
          const lowStock = isLowStock(item);
          const isEditing = editingItemId === item.id;

          return (
            <article className="admin-inventory__card" key={item.id}>
              <div className="admin-inventory__card-top">
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </div>

                <span
                  className={`admin-inventory__status ${
                    lowStock ? "admin-inventory__status--low" : ""
                  }`}
                >
                  {lowStock ? "Bajo stock" : "Disponible"}
                </span>
              </div>

              <div className="admin-inventory__quantity">
                <strong>{displayQuantity}</strong>
                <span>{item.unitLabel}</span>
              </div>

              {item.storedUnit === "grams" && (
                <p className="admin-inventory__note">
                  Guardado internamente como {item.quantity} gramos.
                </p>
              )}

              {isEditing ? (
                <div className="admin-inventory__edit">
                  <label>
                    <span>Nueva cantidad ({item.displayUnit})</span>
                    <input
                      type="number"
                      min="0"
                      step={item.storedUnit === "grams" ? "0.1" : "1"}
                      value={inputValue}
                      onChange={(event) => setInputValue(event.target.value)}
                    />
                  </label>

                  <div className="admin-inventory__actions">
                    <button
                      className="button button--primary"
                      type="button"
                      onClick={() => handleSave(item)}
                    >
                      Guardar
                    </button>
                    <button
                      className="button button--secondary"
                      type="button"
                      onClick={handleCancel}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="admin-inventory__actions">
                  <button
                    className="button button--secondary"
                    type="button"
                    onClick={() => handleEditClick(item)}
                  >
                    Editar
                  </button>

                  <button
                    className="admin-inventory__small-button"
                    type="button"
                    onClick={() => handleQuickAdjust(item, -1)}
                    disabled={item.storedUnit === "grams"}
                  >
                    -1
                  </button>

                  <button
                    className="admin-inventory__small-button"
                    type="button"
                    onClick={() => handleQuickAdjust(item, 1)}
                    disabled={item.storedUnit === "grams"}
                  >
                    +1
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default AdminInventoryManager;