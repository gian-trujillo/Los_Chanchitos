import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import CartDrawer from "./components/CartDrawer/CartDrawer";
import HomePage from "./pages/HomePage/HomePage";
import OrderPage from "./pages/OrderPage/OrderPage";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const featuredPackages = [
    {
      id: "paquete-medio-asado",
      category: "Paquetes",
      name: "Paquete Medio Asado",
      price: 319,
      badge: "Para compartir",
      image: "/images/products/paquete-medio-asado.jpg",
      description:
        "1/2 pollo asado, 1/2 kg de sirloin, media cebolla asada y 1 salchicha.",
    },
    {
      id: "paquete-medio-ataud",
      category: "Paquetes",
      name: "Paquete Medio Ataúd",
      price: 319,
      badge: "Sabor especial",
      image: "/images/products/paquete-medio-ataud.jpg",
      description:
        "1/2 pollo al ataúd, 1/2 kg de sirloin, media cebolla asada y 1 salchicha.",
    },
    {
      id: "paquete-familiar-asado",
      category: "Paquetes",
      name: "Paquete Familiar Asado",
      price: 589,
      badge: "Más completo",
      image: "/images/products/paquete-familiar-asado.jpg",
      description:
        "1 pollo asado, 1 kg de sirloin, 1 cebolla asada y 1 salchicha.",
    },
    {
      id: "paquete-familiar-ataud",
      category: "Paquetes",
      name: "Paquete Familiar Ataúd",
      price: 589,
      badge: "Especial familiar",
      image: "/images/products/paquete-familiar-ataud.jpg",
      description:
        "1 pollo al ataúd, 1 kg de sirloin, 1 cebolla asada y 1 salchicha.",
    },
  ];

  const menuItems = [
    {
      id: "pollo-asado",
      category: "Individuales",
      name: "1 Pollo Asado",
      price: 225,
      image: "/images/products/pollo-asado.jpg",
      description: "Pollo entero preparado al carbón.",
      badge: "Clásico",
    },
    {
      id: "pollo-ataud",
      category: "Individuales",
      name: "1 Pollo al Ataúd",
      price: 225,
      image: "/images/products/pollo-ataud.jpg",
      description: "Pollo entero con preparación especial al ataúd.",
      badge: "Especial",
    },
    {
      id: "medio-pollo-asado",
      category: "Individuales",
      name: "1/2 Pollo Asado",
      price: 130,
      image: "/images/products/medio-pollo-asado.jpg",
      description: "Media pieza de pollo asado al carbón.",
      badge: "Pedido mínimo",
    },
    {
      id: "medio-pollo-ataud",
      category: "Individuales",
      name: "1/2 Pollo al Ataúd",
      price: 130,
      image: "/images/products/medio-pollo-ataud.jpg",
      description: "Media pieza de pollo al ataúd.",
      badge: "Pedido mínimo",
    },
    {
      id: "sirloin-kg",
      category: "Individuales",
      name: "1 kg Sirloin",
      price: 399,
      image: "/images/products/sirloin-kg.jpg",
      description: "Sirloin preparado al carbón, ideal para compartir.",
      badge: "Al carbón",
    },
    {
      id: "sirloin-medio-kg",
      category: "Individuales",
      name: "1/2 kg Sirloin",
      price: 219,
      image: "/images/products/sirloin-medio-kg.jpg",
      description: "Media porción de sirloin preparado al carbón.",
      badge: "Al carbón",
    },
    ...featuredPackages,
    {
      id: "salchicha",
      category: "Complementos",
      name: "Salchicha",
      price: 25,
      image: "/images/products/salchicha.jpg",
      description: "Salchicha asada para acompañar tu pedido.",
      badge: "Complemento",
    },
    {
      id: "arroz",
      category: "Complementos",
      name: "Arroz",
      price: "Desde $20",
      image: "/images/products/arroz.jpg",
      description: "Disponible en presentación chica o grande.",
      badge: "Complemento",
    },
    {
      id: "frijoles",
      category: "Complementos",
      name: "Frijoles",
      price: "Desde $20",
      image: "/images/products/frijoles.jpg",
      description: "Disponible en presentación chica o grande.",
      badge: "Complemento",
    },
    {
      id: "cebolla-asada",
      category: "Complementos",
      name: "Cebolla Asada",
      price: 30,
      image: "/images/products/cebolla-asada.jpg",
      description: "Cebolla asada para acompañar pollo o sirloin.",
      badge: "Complemento",
    },
    {
      id: "papitas-picositas",
      category: "Complementos",
      name: "Papitas Picositas",
      price: 45,
      image: "/images/products/papitas-picositas.jpg",
      description: "Papitas con toque picosito.",
      badge: "Complemento",
    },
    {
      id: "totopos",
      category: "Complementos",
      name: "Totopos",
      price: 20,
      image: "/images/products/totopos.jpg",
      description: "Totopos crujientes para acompañar.",
      badge: "Complemento",
    },
    {
      id: "quesadilla-uno",
      category: "Complementos",
      name: "Quesadilla (1)",
      price: 15,
      image: "/images/products/quesadilla.jpg",
      description: "Una quesadilla recién hecha.",
      badge: "Complemento",
    },
    {
      id: "quesadillas-cuatro",
      category: "Complementos",
      name: "Quesadillas (4)",
      price: 50,
      image: "/images/products/quesadillas-cuatro.jpg",
      description: "Orden de cuatro quesadillas.",
      badge: "Complemento",
    },
    {
      id: "coca-cola",
      category: "Bebidas",
      name: "Coca Cola",
      price: 30,
      image: "/images/products/coca-cola.jpg",
      description: "Refresco para acompañar tu pedido.",
      badge: "Bebida",
    },
    {
      id: "coke-zero",
      category: "Bebidas",
      name: "Coke Zero",
      price: 30,
      image: "/images/products/coke-zero.jpg",
      description: "Refresco sin azúcar.",
      badge: "Bebida",
    },
    {
      id: "sprite",
      category: "Bebidas",
      name: "Sprite",
      price: 30,
      image: "/images/products/sprite.jpg",
      description: "Refresco sabor lima-limón.",
      badge: "Bebida",
    },
    {
      id: "joya",
      category: "Bebidas",
      name: "Joya",
      price: 30,
      image: "/images/products/joya.jpg",
      description: "Refresco Joya.",
      badge: "Bebida",
    },
    {
      id: "agua",
      category: "Bebidas",
      name: "Agua",
      price: 20,
      image: "/images/products/agua.jpg",
      description: "Agua natural para acompañar tu pedido.",
      badge: "Bebida",
    },
    {
      id: "ensalada-cesar",
      category: "Ensaladas",
      name: "Ensalada César",
      price: 100,
      image: "/images/products/ensalada-cesar.jpg",
      description: "Ensalada César para acompañar.",
      badge: "Ensalada",
    },
    {
      id: "carlota",
      category: "Postres",
      name: "Carlota",
      price: 40,
      image: "/images/products/carlota.jpg",
      description: "Postre frío y cremoso para cerrar tu comida.",
      badge: "Postre",
    },
  ];

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

  const handleAddToCart = (item) => {
    if (typeof item.price !== "number") {
      alert("Este producto necesita selección de tamaño antes de agregarse.");
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...currentItems, { ...item, quantity: 1 }];
    });

    setIsCartOpen(true);
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

  return (
    <div className="app">
      <Header
        cartCount={cartCount}
        onNavigateHome={handleNavigateHome}
        onOrderClick={handleOpenOrderPage}
        onCartClick={() => setIsCartOpen(true)}
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
              onAddToCart={handleAddToCart}
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
      </Routes>

      <Footer
        onNavigateHome={handleNavigateHome}
        onOrderClick={handleOpenOrderPage}
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
      />
    </div>
  );
}

export default App;