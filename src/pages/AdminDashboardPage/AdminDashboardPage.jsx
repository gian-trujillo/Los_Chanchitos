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

    const dashboardCards = [
        {
            label: "Pedidos nuevos",
            value: "0",
            text: "Aquí aparecerán los pedidos pendientes.",
        },
        {
            label: "Menú",
            value: "Activo",
            text: "Administra productos, precios e imágenes.",
        },
        {
            label: "Inventario",
            value: "Pendiente",
            text: "Control de pollo, sirloin y complementos.",
        },
        {
            label: "Estado",
            value: "Abierto/Cerrado",
            text: "Más adelante podrás pausar pedidos.",
        },
    ];

    const renderActiveSection = () => {
        if (activeSection === "menu") {
            return (
                <AdminMenuManager
                    menuItems={menuItems}
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
                    <h2>Siguientes módulos</h2>

                    <div className="admin-dashboard__tasks">
                        <article>
                            <h3>Pedidos</h3>
                            <p>
                                Ver nuevos pedidos, cambiar estados, abrir WhatsApp y marcar
                                pedidos como listos.
                            </p>
                        </article>

                        <article>
                            <h3>Menú</h3>
                            <p>
                                Crear, editar, eliminar productos y subir imágenes a la nube.
                            </p>
                        </article>

                        <article>
                            <h3>Inventario</h3>
                            <p>
                                Ajustar pollo asado, pollo al ataúd, sirloin en kg y
                                complementos.
                            </p>
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