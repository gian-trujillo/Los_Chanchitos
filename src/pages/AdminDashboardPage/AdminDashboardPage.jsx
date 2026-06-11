import { useEffect, useState, useRef } from "react";
import { socket } from "../../utils/socket";
import { getAdminOrders } from "../../utils/api";
import { getAdminToken } from "../../utils/token";
import "./AdminDashboardPage.css";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import AdminMenuManager from "../../components/AdminMenuManager/AdminMenuManager";
import AdminInventoryManager from "../../components/AdminInventoryManager/AdminInventoryManager";
import AdminOrdersManager from "../../components/AdminOrdersManager/AdminOrdersManager";
import AdminSettingsManager from "../../components/AdminSettingsManager/AdminSettingsManager";

function AdminDashboardPage({
  adminUser,
  menuItems,
  inventoryItems,
  restaurantSettings,
  onCreateMenuItem,
  onUpdateMenuItem,
  onToggleMenuItemAvailability,
  onDeleteMenuItem,
  onUpdateInventoryItem,
  onUpdateRestaurantSettings,
  onUploadMenuImage,
  onLogout,
}) {
    const [activeSection, setActiveSection] = useState("dashboard");
    const [adminOrders, setAdminOrders] = useState([]);
    const [newOrdersCount, setNewOrdersCount] = useState(0);
    const [newOrderItems, setNewOrderItems] = useState([]);

    const knownOrderIdsRef = useRef(new Set());
    const hasLoadedOrdersRef = useRef(false);

    useEffect(() => {
        let intervalId;

        const loadDashboardOrders = async ({ notifyNewOrders = false } = {}) => {
            const token = getAdminToken();

            try {
            const orders = await getAdminOrders(token);

            const currentKnownIds = knownOrderIdsRef.current;
            const incomingOrders = orders.filter(
                (order) => !currentKnownIds.has(order._id)
            );

            if (
                notifyNewOrders &&
                hasLoadedOrdersRef.current &&
                incomingOrders.length > 0
            ) {
                setNewOrdersCount((currentCount) => currentCount + incomingOrders.length);
                setNewOrderItems((currentItems) => [
                ...incomingOrders,
                ...currentItems,
                ]);
            }

            knownOrderIdsRef.current = new Set(orders.map((order) => order._id));
            hasLoadedOrdersRef.current = true;

            setAdminOrders(orders);
            } catch {
            setAdminOrders([]);
            }
        };

        loadDashboardOrders();

        intervalId = window.setInterval(() => {
            loadDashboardOrders({ notifyNewOrders: true });
        }, 15000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, []);

    useEffect(() => {
        socket.connect();

        const handleOrderCreated = (order) => {
            setAdminOrders((currentOrders) => {
            const alreadyExists = currentOrders.some(
                (currentOrder) => currentOrder._id === order._id
            );

            if (alreadyExists) {
                return currentOrders;
            }

            return [order, ...currentOrders];
            });

            setNewOrdersCount((currentCount) => currentCount + 1);
            setNewOrderItems((currentItems) => [order, ...currentItems]);
        };

        const handleOrderUpdated = (updatedOrder) => {
            setAdminOrders((currentOrders) =>
            currentOrders.map((order) =>
                order._id === updatedOrder._id ? updatedOrder : order
            )
            );
        };

        socket.on("order:created", handleOrderCreated);
        socket.on("order:updated", handleOrderUpdated);

        return () => {
            socket.off("order:created", handleOrderCreated);
            socket.off("order:updated", handleOrderUpdated);
            socket.disconnect();
        };
    }, []);

    const lowStockItems = inventoryItems.filter(
    (item) => item.quantity <= item.lowStockThreshold
    );

    const visibleMenuItems = menuItems.filter((item) => item.isAvailable !== false);

    const activeOrderStatuses = ["received", "confirmed", "preparing", "ready"];

    const activeOrders = adminOrders.filter((order) =>
        activeOrderStatuses.includes(order.status)
    );

    const newOrders = adminOrders.filter((order) => order.status === "received");

    const readyOrders = adminOrders.filter((order) => order.status === "ready");

    const dashboardCards = [
        {
            label: "Pedidos activos",
            value: String(activeOrders.length),
            text:
            activeOrders.length > 0
                ? `${newOrders.length} nuevos, ${readyOrders.length} listos.`
                : "No hay pedidos activos.",
        },
        {
            label: "Productos activos",
            value: String(visibleMenuItems.length),
            text: "Productos visibles para clientes.",
        },
        {
            label: "Bajo inventario",
            value: String(lowStockItems.length),
            text:
            lowStockItems.length > 0
                ? lowStockItems.map((item) => item.name).join(", ")
                : "Sin alertas de inventario.",
        },
        {
            label: "Estado",
            value: restaurantSettings.pauseOrders
            ? "Pausado"
            : restaurantSettings.forceClosed
                ? "Cerrado"
                : "Activo",
            text: restaurantSettings.pauseOrders
            ? "Los pedidos están pausados temporalmente."
            : restaurantSettings.forceClosed
                ? "El restaurante está forzado como cerrado."
                : "El sitio puede recibir pedidos dentro del horario configurado.",
        },
    ];

    const handleSectionChange = (sectionId) => {
        setActiveSection(sectionId);

        if (sectionId === "orders") {
            setNewOrdersCount(0);
            setNewOrderItems([]);
        }
    };
    

    const renderActiveSection = () => {
        if (activeSection === "menu") {
            return (
                <AdminMenuManager
                    menuItems={menuItems}
                    inventoryItems={inventoryItems}
                    onCreateMenuItem={onCreateMenuItem}
                    onUpdateMenuItem={onUpdateMenuItem}
                    onToggleMenuItemAvailability={onToggleMenuItemAvailability}
                    onDeleteMenuItem={onDeleteMenuItem}
                    onUploadMenuImage={onUploadMenuImage}
                />
            );
        }

        if (activeSection === "orders") {
            return (
                <AdminOrdersManager
                orders={adminOrders}
                onOrdersChange={setAdminOrders}
                newOrderItems={newOrderItems}
                onClearNewOrders={() => {
                    setNewOrdersCount(0);
                    setNewOrderItems([]);
                }}
                />
            );
        }

        if (activeSection === "inventory") {
            return (
                <AdminInventoryManager
                    inventoryItems={inventoryItems}
                    onUpdateInventoryItem={onUpdateInventoryItem}
                />
            );
        }

        if (activeSection === "settings") {
            return (
                <AdminSettingsManager
                    restaurantSettings={restaurantSettings}
                    onUpdateRestaurantSettings={onUpdateRestaurantSettings}
                />
            );
        }

        return (
            <div className="admin-dashboard">
                <section className="admin-dashboard__welcome">
                    <div>
                        <p className="section__eyebrow">Resumen</p>
                        <h2>Bienvenido al panel.</h2>
                        <p>
                            Esta es la base del dashboard. Después conectaremos pedidos, menú,
                            inventario, configuración e imágenes.
                        </p>
                    </div>
                </section>

                {newOrderItems.length > 0 && activeSection === "dashboard" && (
                    <section className="admin-dashboard__new-orders">
                        <div>
                        <h2>Nuevo pedido recibido</h2>
                        <p>
                            Hay {newOrderItems.length} pedido
                            {newOrderItems.length === 1 ? "" : "s"} nuevo
                            {newOrderItems.length === 1 ? "" : "s"} por revisar.
                        </p>

                        <ul>
                            {newOrderItems.map((order) => (
                            <li key={order._id}>
                                {order.code} — {order.customer.name} — ${order.total} MXN
                            </li>
                            ))}
                        </ul>
                        </div>

                        <button type="button" onClick={() => handleSectionChange("orders")}>
                        Ver pedidos
                        </button>
                    </section>
                )}

                <section className="admin-dashboard__grid">
                    {dashboardCards.map((card) => (
                        <article className="admin-dashboard__card" key={card.label}>
                        <span>{card.label}</span>
                        <h3>{card.value}</h3>
                        <p>{card.text}</p>
                        </article>
                    ))}
                </section>

                <section className="admin-dashboard__activity">
                    <div>
                        <h2>Pedidos recientes</h2>
                        <p>Últimos pedidos recibidos en el sistema.</p>
                    </div>

                    {adminOrders.length === 0 ? (
                        <p className="admin-dashboard__empty-text">
                        Todavía no hay pedidos registrados.
                        </p>
                    ) : (
                        <div className="admin-dashboard__activity-list">
                        {adminOrders.slice(0, 5).map((order) => (
                            <article key={order._id}>
                            <div>
                                <strong>{order.code}</strong>
                                <span>{order.customer.name}</span>
                            </div>

                            <div>
                                <strong>${order.total} MXN</strong>
                                <span>{order.statusLabel}</span>
                            </div>
                            </article>
                        ))}
                        </div>
                    )}
                </section>

                <section className="admin-dashboard__next">
                    <h2>Acciones rápidas</h2>

                    <div className="admin-dashboard__tasks">
                        <article>
                        <h3>Revisar pedidos</h3>
                        <p>
                            Consulta pedidos activos, cambia estados y contacta clientes por
                            WhatsApp.
                        </p>
                        <button type="button" onClick={() => setActiveSection("orders")}>
                            Ir a pedidos
                        </button>
                        </article>

                        <article>
                        <h3>Actualizar inventario</h3>
                        <p>
                            Ajusta pollo, sirloin y complementos antes o durante el servicio.
                        </p>
                        <button type="button" onClick={() => setActiveSection("inventory")}>
                            Ir a inventario
                        </button>
                        </article>

                        <article>
                        <h3>Editar menú</h3>
                        <p>
                            Cambia precios, imágenes, opciones, inventario usado y disponibilidad.
                        </p>
                        <button type="button" onClick={() => setActiveSection("menu")}>
                            Ir al menú
                        </button>
                        </article>
                    </div>
                </section>
            </div>
        );
    };

    return (
        <AdminLayout
            adminUser={adminUser}
            activeSection={activeSection}
            newOrdersCount={newOrdersCount}
            onSectionChange={handleSectionChange}
            onLogout={onLogout}
        >
            {renderActiveSection()}
        </AdminLayout>
    );
}

export default AdminDashboardPage;