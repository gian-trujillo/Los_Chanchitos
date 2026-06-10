import { useState } from "react";
import "./AdminDashboardPage.css";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import AdminMenuManager from "../../components/AdminMenuManager/AdminMenuManager";
import AdminInventoryManager from "../../components/AdminInventoryManager/AdminInventoryManager";
import AdminOrdersManager from "../../components/AdminOrdersManager/AdminOrdersManager";
import AdminSettingsManager from "../../components/AdminSettingsManager/AdminSettingsManager";
// import { menuItems } from "../../data/menuData";

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

    // const activeOrders = [];
    const lowStockItems = inventoryItems.filter(
    (item) => item.quantity <= item.lowStockThreshold
    );
    const unavailableMenuItems = menuItems.filter(
    (item) => item.isAvailable === false
    );
    const visibleMenuItems = menuItems.filter((item) => item.isAvailable !== false);

    const dashboardCards = [
    {
        label: "Productos activos",
        value: String(visibleMenuItems.length),
        text: "Productos visibles para clientes.",
    },
    {
        label: "Productos ocultos",
        value: String(unavailableMenuItems.length),
        text: "Productos desactivados desde el panel.",
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
            return <AdminOrdersManager />;
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

                <section className="admin-dashboard__grid">
                    {dashboardCards.map((card) => (
                        <article className="admin-dashboard__card" key={card.label}>
                        <span>{card.label}</span>
                        <h3>{card.value}</h3>
                        <p>{card.text}</p>
                        </article>
                    ))}
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
            onSectionChange={setActiveSection}
            onLogout={onLogout}
        >
            {renderActiveSection()}
        </AdminLayout>
    );
}

export default AdminDashboardPage;