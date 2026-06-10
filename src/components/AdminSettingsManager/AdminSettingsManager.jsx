import { useState } from "react";
import "./AdminSettingsManager.css";

function AdminSettingsManager({ restaurantSettings, onUpdateRestaurantSettings }) {
  const [formValues, setFormValues] = useState(restaurantSettings);
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const result = await onUpdateRestaurantSettings({
      ...formValues,
      estimatedPrepTime: Number(formValues.estimatedPrepTime),
    });

    if (result.success) {
      setFormMessage("Configuración guardada correctamente.");
    } else {
      setFormError(result.message || "No se pudo guardar la configuración.");
    }

    setIsSubmitting(false);
  };

  const handleReset = () => {
    setFormValues(restaurantSettings);
  };

  return (
    <section className="admin-settings">
      <div className="admin-settings__header">
        <div>
          <p className="section__eyebrow">Configuración</p>
          <h2>Ajustes del restaurante</h2>
          <p>
            Controla horario, disponibilidad, WhatsApp y datos generales del
            restaurante. Por ahora estos cambios son temporales hasta conectar el backend.
          </p>
        </div>
      </div>

      <form className="admin-settings__form" onSubmit={handleSubmit}>
        <section className="admin-settings__block">
          <h3>Estado de pedidos</h3>

          <div className="admin-settings__toggles">
            <label className="admin-settings__toggle">
              <input
                name="forceClosed"
                type="checkbox"
                checked={formValues.forceClosed}
                onChange={handleChange}
              />
              <span>
                <strong>Forzar cerrado</strong>
                <small>
                  El sitio mostrará el restaurante como cerrado aunque esté dentro del horario.
                </small>
              </span>
            </label>

            <label className="admin-settings__toggle">
              <input
                name="pauseOrders"
                type="checkbox"
                checked={formValues.pauseOrders}
                onChange={handleChange}
              />
              <span>
                <strong>Pausar pedidos</strong>
                <small>
                  El restaurante puede estar abierto, pero no aceptar pedidos temporalmente.
                </small>
              </span>
            </label>
          </div>
        </section>

        <section className="admin-settings__block">
          <h3>Horario</h3>

          <div className="admin-settings__grid">
            <label className="admin-settings__field">
              <span>Hora de apertura</span>
              <input
                name="openingTime"
                type="time"
                value={formValues.openingTime}
                onChange={handleChange}
              />
            </label>

            <label className="admin-settings__field">
              <span>Hora de cierre</span>
              <input
                name="closingTime"
                type="time"
                value={formValues.closingTime}
                onChange={handleChange}
              />
            </label>

            <label className="admin-settings__field">
              <span>Última recolección</span>
              <input
                name="lastPickupTime"
                type="time"
                value={formValues.lastPickupTime}
                onChange={handleChange}
              />
            </label>

            <label className="admin-settings__field">
              <span>Día cerrado</span>
              <select
                name="closedDay"
                value={formValues.closedDay}
                onChange={handleChange}
              >
                <option value="lunes">Lunes</option>
                <option value="martes">Martes</option>
                <option value="miércoles">Miércoles</option>
                <option value="jueves">Jueves</option>
                <option value="viernes">Viernes</option>
                <option value="sábado">Sábado</option>
                <option value="domingo">Domingo</option>
              </select>
            </label>

            <label className="admin-settings__field">
              <span>Tiempo estimado de preparación</span>
              <input
                name="estimatedPrepTime"
                type="number"
                min="5"
                step="5"
                value={formValues.estimatedPrepTime}
                onChange={handleChange}
              />
              <small>En minutos.</small>
            </label>
          </div>
        </section>

        <section className="admin-settings__block">
          <h3>Información del restaurante</h3>

          <div className="admin-settings__grid">
            <label className="admin-settings__field">
              <span>Nombre</span>
              <input
                name="restaurantName"
                type="text"
                value={formValues.restaurantName}
                onChange={handleChange}
              />
            </label>

            <label className="admin-settings__field">
              <span>WhatsApp</span>
              <input
                name="whatsappPhone"
                type="tel"
                value={formValues.whatsappPhone}
                onChange={handleChange}
                placeholder="528112345678"
              />
              <small>Incluye código de país. Ejemplo México: 52...</small>
            </label>

            <label className="admin-settings__field admin-settings__field--wide">
              <span>Dirección</span>
              <textarea
                name="address"
                rows="3"
                value={formValues.address}
                onChange={handleChange}
              ></textarea>
            </label>
          </div>
        </section>

        <div className="admin-settings__actions">
          <button
            className="button button--primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Guardando..." : "Guardar configuración"}
          </button>
          <button className="button button--secondary" type="button" onClick={handleReset}>
            Descartar cambios
          </button>
        </div>

        {formMessage && <p className="admin-settings__success">{formMessage}</p>}
        {formError && <p className="admin-settings__error">{formError}</p>}
      </form>
    </section>
  );
}

export default AdminSettingsManager;