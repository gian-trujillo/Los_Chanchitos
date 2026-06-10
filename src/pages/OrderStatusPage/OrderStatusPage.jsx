import { useState } from "react";
import "./OrderStatusPage.css";
import { getOrderStatus } from "../../utils/api";
import { getOrderStatusStep } from "../../utils/orderStatus";

function OrderStatusPage({ onBackHome, onBackToMenu }) {
    const [formValues, setFormValues] = useState({
        orderCode: "",
        phone: "",
    });
    const [foundOrder, setFoundOrder] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormValues((currentValues) => ({
        ...currentValues,
        [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const matchingOrder = await getOrderStatus({
            code: formValues.orderCode,
            phone: formValues.phone,
            });

            setFoundOrder(matchingOrder);
        } catch {
            setFoundOrder(null);
        } finally {
            setHasSearched(true);
        }
    };

    const handleRefreshOrder = async () => {
        if (!foundOrder) {
            return;
        }

        try {
            const updatedOrder = await getOrderStatus({
            code: foundOrder.code,
            phone: foundOrder.customer.phone,
            });

            setFoundOrder(updatedOrder);
        } catch {
            setFoundOrder(null);
        }
    };

    const formatPickupText = (order) => {
        if (order.pickup.type === "asap") {
        return "Lo antes posible";
        }

        return `Programado para ${order.pickup.time}`;
    };

    const formatPaymentText = (order) => {
        return order.paymentMethod === "pickup" ? "Pagar al recoger" : "Pago en línea";
    };

    const getStepClassName = (stepNumber, currentStep, orderStatus) => {
        if (orderStatus === "cancelled") {
            return "status-page__step status-page__step--cancelled";
        }

        if (stepNumber < currentStep) {
            return "status-page__step status-page__step--completed";
        }

        if (stepNumber === currentStep) {
            return "status-page__step status-page__step--active";
        }

        return "status-page__step";
    };

    return (
        <section className="status-page section">
        <div className="status-page__inner section__inner">
            <div className="status-page__header">
                <p className="section__eyebrow">Consulta tu pedido</p>
                <h1 className="section__title">Revisa el estado de tu orden.</h1>
                <p className="section__text">
                    Ingresa tu número de pedido y teléfono para ver los detalles. En esta
                    versión, la consulta funciona con pedidos creados en este navegador.
                </p>
            </div>

            <div className="status-page__layout">
                <form className="status-page__form" onSubmit={handleSubmit}>
                    <h2>Buscar pedido</h2>

                    <label className="status-page__field">
                    <span>Número de pedido</span>
                    <input
                        name="orderCode"
                        type="text"
                        value={formValues.orderCode}
                        onChange={handleChange}
                        placeholder="Ej. LC-4821"
                        required
                    />
                    </label>

                    <label className="status-page__field">
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

                    <button className="button button--primary status-page__submit" type="submit">
                        Buscar pedido
                    </button>

                    {hasSearched && !foundOrder && (
                    <p className="status-page__warning">
                        No encontramos un pedido con esos datos. Revisa el número de
                        pedido y teléfono.
                    </p>
                    )}
                </form>

                <aside className="status-page__help">
                    <span className="badge">Ayuda</span>
                    <h2>¿Dónde encuentro mi código?</h2>
                    <p>
                        Al confirmar tu pedido aparece un código como <strong>LC-4821</strong>.
                        Guárdalo junto con el teléfono que usaste para ordenar.
                    </p>

                    <div className="status-page__actions">
                        <button className="button button--secondary" type="button" onClick={onBackToMenu}>
                            Hacer pedido
                        </button>
                        <button className="button button--secondary" type="button" onClick={onBackHome}>
                            Volver al inicio
                        </button>
                    </div>
                </aside>
            </div>

            {foundOrder && (
            <article className="status-page__result">
                <div className="status-page__result-header">
                    <div>
                        <p className="section__eyebrow">Resultado</p>
                        <h2>Pedido {foundOrder.code}</h2>
                    </div>

                    <div className="status-page__result-actions">
                        <span
                        className={`status-page__pill status-page__pill--${foundOrder.status}`}
                        >
                            {foundOrder.statusLabel}
                        </span>

                        <button
                        className="button button--secondary status-page__refresh"
                        type="button"
                        onClick={handleRefreshOrder}
                        >
                            Revisar si hay cambios
                        </button>
                        <p className="status-page__refresh-note">
                            El restaurante actualiza el estado conforme avanza tu pedido.
                        </p>
                    </div>
                </div>

                <div className="status-page__progress">
                    <div
                        className={getStepClassName(
                        1,
                        getOrderStatusStep(foundOrder.status),
                        foundOrder.status
                        )}
                    >
                        <span>1</span>
                        <strong>Recibido</strong>
                    </div>

                    <div
                        className={getStepClassName(
                        2,
                        getOrderStatusStep(foundOrder.status),
                        foundOrder.status
                        )}
                    >
                        <span>2</span>
                        <strong>Confirmado</strong>
                    </div>

                    <div
                        className={getStepClassName(
                        3,
                        getOrderStatusStep(foundOrder.status),
                        foundOrder.status
                        )}
                    >
                        <span>3</span>
                        <strong>Preparando</strong>
                    </div>

                    <div
                        className={getStepClassName(
                        4,
                        getOrderStatusStep(foundOrder.status),
                        foundOrder.status
                        )}
                    >
                        <span>4</span>
                        <strong>Listo</strong>
                    </div>

                    <div
                        className={getStepClassName(
                        5,
                        getOrderStatusStep(foundOrder.status),
                        foundOrder.status
                        )}
                    >
                        <span>5</span>
                        <strong>Completado</strong>
                    </div>
                </div>

                <div className="status-page__details">
                    <div>
                        <span>Cliente</span>
                        <strong>{foundOrder.customer.name}</strong>
                    </div>

                    <div>
                        <span>Teléfono</span>
                        <strong>{foundOrder.customer.phone}</strong>
                    </div>

                    <div>
                        <span>Recolección</span>
                        <strong>{formatPickupText(foundOrder)}</strong>
                    </div>

                    <div>
                        <span>Pago</span>
                        <strong>{formatPaymentText(foundOrder)}</strong>
                    </div>
                </div>

                {foundOrder.details && (
                    <div className="status-page__notes">
                        <span>Detalles</span>
                        <p>{foundOrder.details}</p>
                    </div>
                )}

                <div className="status-page__items">
                    <h3>Resumen</h3>

                    {foundOrder.items.map((item) => (
                        <article className="status-page__item" key={item.id}>
                        <img src={item.image} alt={item.name} />
                        <div>
                            <h4>{item.name}</h4>
                            <p>
                            ${item.price} MXN × {item.quantity}
                            </p>
                        </div>
                        <strong>${item.price * item.quantity}</strong>
                        </article>
                    ))}

                    <div className="status-page__total">
                        <span>Total</span>
                        <strong>${foundOrder.total} MXN</strong>
                    </div>
                </div>
            </article>
            )}
        </div>
        </section>
    );
}

export default OrderStatusPage;