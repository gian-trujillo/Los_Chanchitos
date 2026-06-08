import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import { saveOrderToStorage } from "./utils/orderStorage";
import { featuredPackages, menuItems } from "./data/menuData";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import CartDrawer from "./components/CartDrawer/CartDrawer";
import HomePage from "./pages/HomePage/HomePage";
import OrderPage from "./pages/OrderPage/OrderPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage/OrderConfirmationPage";
import OrderStatusPage from "./pages/OrderStatusPage/OrderStatusPage";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState(null);
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenOrderPage = (itemId = null) => {
    if (itemId) {
      navigate(`/ordenar?item=${itemId}`);
    } else {
      navigate("/ordenar");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getRestaurantStatus = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const currentMinutes = hour * 60 + minutes;

    const openingMinutes = 12 * 60;
    const closingMinutes = 17 * 60;

    const isTuesday = day === 2;
    const isOpen =
      !isTuesday &&
      currentMinutes >= openingMinutes &&
      currentMinutes < closingMinutes;

    if (isTuesday) {
      return {
        isOpen,
        label: "Cerrado hoy",
        detail: "Cerrado los martes",
      };
    }

    if (currentMinutes < openingMinutes) {
      return {
        isOpen,
        label: "Cerrado por ahora",
        detail: "Abrimos hoy a las 12:00 PM",
      };
    }

    if (currentMinutes >= closingMinutes) {
      return {
        isOpen,
        label: "Cerrado por ahora",
        detail: "Volvemos a abrir mañana a las 12:00 PM",
      };
    }

    return {
      isOpen,
      label: "Abierto ahora",
      detail: "Abierto hasta las 5:00 PM",
    };
  };

  const restaurantStatus = getRestaurantStatus();

  const handleAddToCart = (item, selectedOption = null) => {
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
    setCartItems([]);
    setIsCartOpen(false);
    navigate("/pedido-confirmado");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenStatusLookup = () => {
    navigate("/consultar-pedido");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app">
      <Header
        cartCount={cartCount}
        onNavigateHome={handleNavigateHome}
        onOrderClick={handleOpenOrderPage}
        onCartClick={() => setIsCartOpen(true)}
        onStatusClick={handleOpenStatusLookup}
      />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              featuredPackages={featuredPackages}
              menuItems={menuItems}
              restaurantStatus={restaurantStatus}
              onOrderClick={handleOpenOrderPage}
              onAddToCart={handleAddToCartAndOpenMenu}
            />
          }
        />

        <Route
          path="/ordenar"
          element={
            <OrderPage
              menuItems={menuItems}
              restaurantStatus={restaurantStatus}
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
      </Routes>

      <Footer
        onNavigateHome={handleNavigateHome}
        onOrderClick={handleOpenOrderPage}
        onStatusClick={handleOpenStatusLookup}
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
    </div>
  );
}

export default App;