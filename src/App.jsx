import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import { saveOrderToStorage } from "./utils/orderStorage";
import { menuItems as initialMenuItems } from "./data/menuData";
import { addInventoryStatusToMenuItems } from "./utils/inventoryUtils";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import CartDrawer from "./components/CartDrawer/CartDrawer";
import HomePage from "./pages/HomePage/HomePage";
import OrderPage from "./pages/OrderPage/OrderPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage/OrderConfirmationPage";
import OrderStatusPage from "./pages/OrderStatusPage/OrderStatusPage";
import AdminLoginPage from "./pages/AdminLoginPage/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage/AdminDashboardPage";
import FloatingWhatsApp from "./components/FloatingWhatsApp/FloatingWhatsApp";
import { initialInventoryItems } from "./data/inventoryData";
import { initialRestaurantSettings } from "./data/restaurantSettings";
import { getClosedDayLabel, formatSettingsTime } from "./utils/restaurantFormatters";
import { loginAdmin, getCurrentAdmin, getMenuItems, getInventoryItems, getRestaurantSettings, createMenuItem, updateMenuItem, deleteMenuItem, updateInventoryItem, updateRestaurantSettings } from "./utils/api";
import { saveAdminToken, getAdminToken, removeAdminToken } from "./utils/token";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [isCheckingAdminSession, setIsCheckingAdminSession] = useState(true);
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);
  const [restaurantSettings, setRestaurantSettings] = useState(initialRestaurantSettings);
  // const [isLoadingAppData, setIsLoadingAppData] = useState(true);
  const [appDataError, setAppDataError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const inventoryAwareMenuItems = addInventoryStatusToMenuItems(
    menuItems,
    inventoryItems
  );

  const visibleMenuItems = inventoryAwareMenuItems.filter(
    (item) => item.isAvailable !== false
  );

  const featuredPackages = visibleMenuItems.filter(
    (item) => item.category === "Paquetes" && item.isFeatured
  );

  useEffect(() => {
    const checkAdminSession = async () => {
      const token = getAdminToken();

      if (!token) {
        setIsCheckingAdminSession(false);
        return;
      }

      try {
        const data = await getCurrentAdmin(token);

        setAdminUser(data.admin);
        setIsAdminLoggedIn(true);
      } catch {
        removeAdminToken();
        setAdminUser(null);
        setIsAdminLoggedIn(false);
      } finally {
        setIsCheckingAdminSession(false);
      }
    };

    checkAdminSession();
  }, []);

  useEffect(() => {
    const loadAppData = async () => {
      try {
        const [menuData, inventoryData, settingsData] = await Promise.all([
          getMenuItems(),
          getInventoryItems(),
          getRestaurantSettings(),
        ]);

        setMenuItems(menuData);
        setInventoryItems(inventoryData);
        setRestaurantSettings(settingsData);
        setAppDataError("");
      } catch (error) {
        console.error(error);
        setAppDataError(
          "No se pudo cargar la información actualizada. Mostrando datos locales."
        );
      }
    };

    loadAppData();
  }, []);

  const handleNavigateHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigateToHomeSection = (sectionId) => {
    const scrollToSection = () => {
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scrollToSection, 100);
      return;
    }

    scrollToSection();
  };

  const handleOpenOrderPage = (itemId = null) => {
    if (itemId) {
      navigate(`/ordenar?item=${itemId}`);
    } else {
      navigate("/ordenar");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getMinutesFromTime = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const getDayName = (dayNumber) => {
    const days = [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ];

    return days[dayNumber];
  };

  const getRestaurantStatus = () => {
    const now = new Date();
    const currentDayName = getDayName(now.getDay());
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const openingMinutes = getMinutesFromTime(restaurantSettings.openingTime);
    const closingMinutes = getMinutesFromTime(restaurantSettings.closingTime);

    const isClosedDay = currentDayName === restaurantSettings.closedDay;

    const isWithinHours =
      currentMinutes >= openingMinutes && currentMinutes < closingMinutes;

    const isOpen =
      !isClosedDay &&
      !restaurantSettings.forceClosed &&
      !restaurantSettings.pauseOrders &&
      isWithinHours;

    const openingLabel = formatSettingsTime(restaurantSettings.openingTime);
    const closingLabel = formatSettingsTime(restaurantSettings.closingTime);
    const closedDayLabel = getClosedDayLabel(restaurantSettings.closedDay);

    if (restaurantSettings.pauseOrders) {
      return {
        isOpen: false,
        label: "Pedidos pausados",
        detail: "El restaurante pausó pedidos temporalmente.",
      };
    }

    if (restaurantSettings.forceClosed) {
      return {
        isOpen: false,
        label: "Cerrado por ahora",
        detail: `Horario regular: ${openingLabel} a ${closingLabel}.`,
      };
    }

    if (isClosedDay) {
      return {
        isOpen: false,
        label: "Cerrado hoy",
        detail: `Cerrado los ${closedDayLabel}.`,
      };
    }

    if (currentMinutes < openingMinutes) {
      return {
        isOpen: false,
        label: "Cerrado por ahora",
        detail: `Abrimos hoy a las ${openingLabel}.`,
      };
    }

    if (currentMinutes >= closingMinutes) {
      return {
        isOpen: false,
        label: "Cerrado por ahora",
        detail: `Volvemos a abrir a las ${openingLabel}.`,
      };
    }

    return {
      isOpen,
      label: "Abierto ahora",
      detail: `Abierto hasta las ${closingLabel}.`,
    };
  };

  const restaurantStatus = getRestaurantStatus();

  const handleAddToCart = (item, selectedOption = null) => {
    if (item.inventoryStatus?.isSoldOut) {
      alert("Este producto está agotado por ahora.");
      return;
    }

    if (item.options && !selectedOption) {
      alert("Selecciona una opción antes de agregar este producto.");
      return;
    }

    const cartItem = selectedOption
      ? {
          ...item,
          id: selectedOption.id,
          baseProductId: item.id,
          name: `${item.name} ${selectedOption.name}`,
          price: selectedOption.price,
          selectedOption,
        }
      : item;

    if (typeof cartItem.price !== "number") {
      alert("Este producto necesita selección de tamaño antes de agregarse.");
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (currentItem) => currentItem.id === cartItem.id
      );

      if (existingItem) {
        return currentItems.map((currentItem) =>
          currentItem.id === cartItem.id
            ? { ...currentItem, quantity: currentItem.quantity + 1 }
            : currentItem
        );
      }

      return [...currentItems, { ...cartItem, quantity: 1 }];
    });

    setIsCartOpen(true);
  };

  const handleAddToCartAndOpenMenu = (item, selectedOption = null) => {
    handleAddToCart(item, selectedOption);
    navigate("/ordenar");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleIncreaseQuantity = (itemId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (itemId) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (itemId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId)
    );
  };

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const hasMainItem = cartItems.some(
    (item) => item.category === "Individuales" || item.category === "Paquetes"
  );

  const generateOrderCode = () => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `LC-${randomNumber}`;
  };

  const reduceInventoryForOrder = (orderItems) => {
    setInventoryItems((currentInventoryItems) =>
      currentInventoryItems.map((inventoryItem) => {
        const totalUsed = orderItems.reduce((total, orderItem) => {
          if (!orderItem.inventoryUsage) {
            return total;
          }

          const matchingUsage = orderItem.inventoryUsage.find(
            (usage) => usage.inventoryId === inventoryItem.id
          );

          if (!matchingUsage) {
            return total;
          }

          return total + matchingUsage.amount * orderItem.quantity;
        }, 0);

        if (totalUsed === 0) {
          return inventoryItem;
        }

        return {
          ...inventoryItem,
          quantity: Math.max(0, inventoryItem.quantity - totalUsed),
        };
      })
    );
  };

  const handleSubmitOrder = (orderData) => {
    const newOrder = {
      id: generateOrderCode(),
      status: "received",
      statusLabel: "Pedido recibido",
      createdAt: new Date().toISOString(),
      items: cartItems,
      total: cartTotal,
      customer: {
        name: orderData.name,
        phone: orderData.phone,
      },
      pickup: {
        type: orderData.pickupType,
        time: orderData.pickupTime,
      },
      paymentMethod: orderData.paymentMethod,
      details: orderData.details,
    };

    setSubmittedOrder(newOrder);
    saveOrderToStorage(newOrder);
    reduceInventoryForOrder(cartItems);
    setCartItems([]);
    setIsCartOpen(false);
    navigate("/pedido-confirmado");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenStatusLookup = () => {
    navigate("/consultar-pedido");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdminLogin = async ({ email, password }) => {
    try {
      const data = await loginAdmin({ email, password });

      saveAdminToken(data.token);
      setAdminUser(data.admin);
      setIsAdminLoggedIn(true);

      navigate("/admin/dashboard");
      window.scrollTo({ top: 0, behavior: "smooth" });

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "No se pudo iniciar sesión.",
      };
    }
  };

  const handleAdminLogout = () => {
    removeAdminToken();
    setAdminUser(null);
    setIsAdminLoggedIn(false);
    navigate("/admin/login");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateMenuItem = async (newItem) => {
    const token = getAdminToken();

    try {
      const createdItem = await createMenuItem({
        item: newItem,
        token,
      });

      setMenuItems((currentItems) => [createdItem, ...currentItems]);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "No se pudo crear el producto.",
      };
    }
  };

  const handleUpdateMenuItem = async (updatedItem) => {
    const token = getAdminToken();

    try {
      const savedItem = await updateMenuItem({
        mongoId: updatedItem._id || updatedItem.id,
        item: updatedItem,
        token,
      });

      setMenuItems((currentItems) =>
        currentItems.map((item) =>
          item._id === savedItem._id ? savedItem : item
        )
      );

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "No se pudo actualizar el producto.",
      };
    }
  };

  const handleToggleMenuItemAvailability = async (itemId) => {
    const token = getAdminToken();
    const itemToUpdate = menuItems.find((item) => item.id === itemId);

    if (!itemToUpdate) {
      return;
    }

    const updatedItem = {
      ...itemToUpdate,
      isAvailable: itemToUpdate.isAvailable === false,
    };

    try {
      const savedItem = await updateMenuItem({
        mongoId: itemToUpdate._id || itemToUpdate.id,
        item: updatedItem,
        token,
      });

      setMenuItems((currentItems) =>
        currentItems.map((item) =>
          item._id === savedItem._id ? savedItem : item
        )
      );
    } catch (error) {
      alert(error.message || "No se pudo cambiar el estado del producto.");
    }
  };

  const handleDeleteMenuItem = async (itemId) => {
    const token = getAdminToken();
    const itemToDelete = menuItems.find((item) => item.id === itemId);

    if (!itemToDelete) {
      return;
    }

    try {
      await deleteMenuItem({
        mongoId: itemToDelete._id,
        token,
      });

      setMenuItems((currentItems) =>
        currentItems.filter((item) => item._id !== itemToDelete._id)
      );
    } catch (error) {
      alert(error.message || "No se pudo eliminar el producto.");
    }
  };

  const handleUpdateInventoryItem = async (updatedInventoryItem) => {
    const token = getAdminToken();

    try {
      const savedInventoryItem = await updateInventoryItem({
        mongoId: updatedInventoryItem._id || updatedInventoryItem.id,
        item: updatedInventoryItem,
        token,
      });

      setInventoryItems((currentItems) =>
        currentItems.map((item) =>
          item._id === savedInventoryItem._id ? savedInventoryItem : item
        )
      );

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "No se pudo actualizar el inventario.",
      };
    }
  };

  const handleUpdateRestaurantSettings = async (updatedSettings) => {
    const token = getAdminToken();

    try {
      const savedSettings = await updateRestaurantSettings({
        settings: updatedSettings,
        token,
      });

      setRestaurantSettings(savedSettings);

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "No se pudo actualizar la configuración.",
      };
    }
  };

  return (
    <div className="app">
      <Header
        cartCount={cartCount}
        onNavigateHome={handleNavigateHome}
        onOrderClick={handleOpenOrderPage}
        onCartClick={() => setIsCartOpen(true)}
        onStatusClick={handleOpenStatusLookup}
        onSectionClick={handleNavigateToHomeSection}
      />

      {appDataError && !isAdminRoute && (
        <div className="app__data-warning">
          {appDataError}
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              featuredPackages={featuredPackages}
              menuItems={visibleMenuItems}
              restaurantStatus={restaurantStatus}
              onOrderClick={handleOpenOrderPage}
              onAddToCart={handleAddToCartAndOpenMenu}
              restaurantSettings={restaurantSettings}
            />
          }
        />

        <Route
          path="/ordenar"
          element={
            <OrderPage
              menuItems={visibleMenuItems}
              restaurantStatus={restaurantStatus}
              restaurantSettings={restaurantSettings}
              onBackHome={handleNavigateHome}
              onAddToCart={handleAddToCart}
            />
          }
        />

        <Route
          path="/checkout"
          element={
            <CheckoutPage
              cartItems={cartItems}
              cartTotal={cartTotal}
              hasMainItem={hasMainItem}
              restaurantStatus={restaurantStatus}
              onBackToMenu={handleOpenOrderPage}
              onBackToCart={() => setIsCartOpen(true)}
              onSubmitOrder={handleSubmitOrder}
              restaurantSettings={restaurantSettings}
            />
          }
        />

        <Route
          path="/pedido-confirmado"
          element={
            <OrderConfirmationPage
              order={submittedOrder}
              onBackToMenu={handleOpenOrderPage}
              onBackHome={handleNavigateHome}
            />
          }
        />

        <Route
          path="/consultar-pedido"
          element={
            <OrderStatusPage
              onBackHome={handleNavigateHome}
              onBackToMenu={handleOpenOrderPage}
            />
          }
        />

        <Route
          path="/admin/login"
          element={
            <AdminLoginPage
              isAdminLoggedIn={isAdminLoggedIn}
              onLogin={handleAdminLogin}
            />
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            isCheckingAdminSession ? (
              <div className="app__loading">Verificando sesión...</div>
            ) : isAdminLoggedIn ? (
              <AdminDashboardPage
                adminUser={adminUser}
                menuItems={menuItems}
                inventoryItems={inventoryItems}
                restaurantSettings={restaurantSettings}
                onCreateMenuItem={handleCreateMenuItem}
                onUpdateMenuItem={handleUpdateMenuItem}
                onToggleMenuItemAvailability={handleToggleMenuItemAvailability}
                onDeleteMenuItem={handleDeleteMenuItem}
                onUpdateInventoryItem={handleUpdateInventoryItem}
                onUpdateRestaurantSettings={handleUpdateRestaurantSettings}
                onLogout={handleAdminLogout}
              />
            ) : (
              <AdminLoginPage
                isAdminLoggedIn={isAdminLoggedIn}
                onLogin={handleAdminLogin}
              />
            )
          }
        />
      </Routes>

      <Footer
        // restaurantSettings={restaurantSettings}
        onNavigateHome={handleNavigateHome}
        onOrderClick={handleOpenOrderPage}
        onStatusClick={handleOpenStatusLookup}
        onSectionClick={handleNavigateToHomeSection}
      />

      <CartDrawer
        cartItems={cartItems}
        cartTotal={cartTotal}
        cartCount={cartCount}
        hasMainItem={hasMainItem}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onIncreaseQuantity={handleIncreaseQuantity}
        onDecreaseQuantity={handleDecreaseQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onCheckout={handleOpenCheckout}
      />

      {!isAdminRoute && (
        <FloatingWhatsApp restaurantSettings={restaurantSettings} />
      )}
    </div>
  );
}

export default App;