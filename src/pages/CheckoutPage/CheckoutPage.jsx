import { useState } from "react";
import "./CheckoutPage.css";

function CheckoutPage({
  cartItems,
  cartTotal,
  hasMainItem,
  restaurantStatus,
  onBackToMenu,
  onBackToCart,
  onSubmitOrder,
}) {
    const [formValues, setFormValues] = useState({
        name: "",
        phone: "",
        pickupType: "asap",
        pickupTime: "",
        details: "",
        paymentMethod: "pickup",
    });

    const isCartEmpty = cartItems.length === 0;
    const isScheduledPickup = formValues.pickupType === "scheduled";

    const isScheduledPickupTimeValid = () => {
        if (!isScheduledPickup) {
            return true;
        }

        if (!formValues.pickupTime) {
            return false;
        }

        const [hours, minutes] = formValues.pickupTime.split(":").map(Number);
        const selectedMinutes = hours * 60 + minutes;

        const openingMinutes = 12 * 60;
        const lastPickupMinutes = 16 * 60 + 45;

        return (
            selectedMinutes >= openingMinutes &&
            selectedMinutes <= lastPickupMinutes
        );
    };

    const pickupTimeIsValid = isScheduledPickupTimeValid();
    const restaurantIsOpen = restaurantStatus.isOpen;

    const canSubmit =
    !isCartEmpty &&
    hasMainItem &&
    formValues.name &&
    formValues.phone &&
    restaurantIsOpen &&
    pickupTimeIsValid;

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormValues((currentValues) => ({
        ...currentValues,
        [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!canSubmit) {
            return;
        }

        onSubmitOrder(formValues);
    };

    return (
        <section className="checkout section">
        <div className="checkout__inner section__inner">
            <div className="checkout__header">
                <button className="checkout__back" type="button" onClick={onBackToMenu}>
                    ← Volver al menú
                </button>

                <p className="section__eyebrow">Finalizar pedido</p>
                <h1 className="section__title">Confirma tu pedido.</h1>
                <p className="section__text">
                    Revisa tu orden, agrega tus datos y elige cómo quieres recoger y pagar.
                </p>
            </div>

            <div className="checkout__layout">
            <form className="checkout__form" onSubmit={handleSubmit}>
                <section className="checkout__block">
                    {!restaurantIsOpen && (
                        <p className="checkout__warning">
                            El restaurante está cerrado en este momento. Los pedidos se aceptan de
                            miércoles a lunes, de 12:00 PM a 5:00 PM.
                        </p>
                    )}
                    <h2>Datos del cliente</h2>

                    <label className="checkout__field">
                        <span>Nombre</span>
                        <input
                        name="name"
                        type="text"
                        value={formValues.name}
                        onChange={handleChange}
                        placeholder="Ej. Juan Pérez"
                        required
                        />
                    </label>

                    <label className="checkout__field">
                        <span>Teléfono</span>
                        <input
                        name="phone"
                        type="tel"
                        value={formValues.phone}
                        onChange={handleChange}
                        placeholder="Ej. 8112345678"
                        required
                        />
                    </label>
                </section>

                <section className="checkout__block">
                    <h2>Hora de recolección</h2>

                    <div className="checkout__options">
                        <label className="checkout__choice">
                        <input
                            type="radio"
                            name="pickupType"
                            value="asap"
                            checked={formValues.pickupType === "asap"}
                            onChange={handleChange}
                        />
                        <span>
                            <strong>Lo antes posible</strong>
                            <small>El restaurante preparará tu pedido en cuanto lo confirme.</small>
                        </span>
                        </label>

                        <label className="checkout__choice">
                        <input
                            type="radio"
                            name="pickupType"
                            value="scheduled"
                            checked={formValues.pickupType === "scheduled"}
                            onChange={handleChange}
                        />
                        <span>
                            <strong>Programar hora</strong>
                            <small>Elige una hora de recolección dentro del horario.</small>
                        </span>
                        </label>
                    </div>

                    {formValues.pickupType === "scheduled" && (
                        <label className="checkout__field checkout__field--small">
                        <span>Hora</span>
                        <input
                            name="pickupTime"
                            type="time"
                            min="12:00"
                            max="16:45"
                            value={formValues.pickupTime}
                            onChange={handleChange}
                        />
                        </label>
                    )}

                    <p className="checkout__note">
                        Horario: 12:00 PM a 5:00 PM. Cerrado los martes. Última recolección sugerida:
                        4:45 PM.
                    </p>
                    {isScheduledPickup && !pickupTimeIsValid && (
                        <p className="checkout__warning">
                            Selecciona una hora válida dentro del horario de recolección.
                        </p>
                    )}
                </section>

                <section className="checkout__block">
                    <h2>Detalles del pedido</h2>

                    <label className="checkout__field">
                        <span>Notas para el restaurante</span>
                        <textarea
                        name="details"
                        value={formValues.details}
                        onChange={handleChange}
                        placeholder="Ej. Extra salsa, sin cebolla, cortar el pollo en piezas..."
                        rows="5"
                        ></textarea>
                    </label>
                </section>

                <section className="checkout__block">
                    <h2>Método de pago</h2>

                    <div className="checkout__options">
                        <label className="checkout__choice checkout__choice--featured">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="pickup"
                            checked={formValues.paymentMethod === "pickup"}
                            onChange={handleChange}
                        />
                        <span>
                            <strong>Pagar al recoger</strong>
                            <small>Opción recomendada. Aparta tu pedido y paga en el local.</small>
                        </span>
                        </label>

                        <label className="checkout__choice">
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="online"
                            checked={formValues.paymentMethod === "online"}
                            onChange={handleChange}
                        />
                        <span>
                            <strong>Pago en línea</strong>
                            <small>Más adelante conectaremos Mercado Pago o Stripe.</small>
                        </span>
                        </label>
                    </div>
                </section>

                {/* {!restaurantIsOpen && (
                    <p className="checkout__warning">
                        El restaurante está cerrado en este momento. Los pedidos se aceptan de
                        miércoles a lunes, de 12:00 PM a 5:00 PM.
                    </p>
                )} */}

                <button
                className="button button--primary checkout__submit"
                type="submit"
                disabled={!canSubmit}
                >
                    Confirmar pedido
                </button>

                {!hasMainItem && (
                <p className="checkout__warning">
                    Para realizar un pedido, agrega al menos un pollo, sirloin o paquete.
                </p>
                )}
            </form>

            <aside className="checkout__summary">
                <div className="checkout__status">
                    <span
                        className={
                        restaurantStatus.isOpen
                            ? "checkout__status-dot checkout__status-dot--open"
                            : "checkout__status-dot checkout__status-dot--closed"
                        }
                    ></span>
                    <div>
                        <strong>{restaurantStatus.label}</strong>
                        <p>{restaurantStatus.detail}</p>
                    </div>
                </div>

                <h2>Resumen</h2>

                {cartItems.length === 0 ? (
                    <div className="checkout__empty">
                        <p>Tu carrito está vacío.</p>
                        <button className="button button--secondary" type="button" onClick={onBackToMenu}>
                            Ver menú
                        </button>
                    </div>
                ) : (
                <>
                    <div className="checkout__items">
                        {cartItems.map((item) => (
                            <article className="checkout__item" key={item.id}>
                            <img src={item.image} alt={item.name} />
                            <div>
                                <h3>{item.name}</h3>
                                <p>${item.price} MXN × {item.quantity}</p>
                            </div>
                            <strong>${item.price * item.quantity}</strong>
                            </article>
                        ))}
                    </div>

                    <button className="checkout__edit-cart" type="button" onClick={onBackToCart}>
                    Editar carrito
                    </button>

                    <div className="checkout__total">
                        <span>Total</span>
                        <strong>${cartTotal} MXN</strong>
                    </div>
                </>
                )}
            </aside>
            </div>
        </div>
        </section>
    );
}

export default CheckoutPage;