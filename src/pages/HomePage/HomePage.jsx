import "./HomePage.css";
import Hero from "../../components/Hero/Hero";
import FeaturedPackages from "../../components/FeaturedPackages/FeaturedPackages";
import MenuPreview from "../../components/MenuPreview/MenuPreview";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import LocationHours from "../../components/LocationHours/LocationHours";

function HomePage({ featuredPackages, menuItems, restaurantStatus, restaurantSettings, onOrderClick, onAddToCart }) {
    const previewItems = menuItems.filter((item) =>
        [
            "pollo-asado",
            "pollo-ataud",
            "medio-pollo-asado",
            "sirloin-kg",
            "paquete-medio-asado",
            "paquete-familiar-asado",
        ].includes(item.id)
    );

    const heroItem = featuredPackages.find(
        (item) => item.id === "paquete-familiar-asado"
    );

    return (
        <>
        <Hero heroItem={heroItem} restaurantStatus={restaurantStatus} onOrderClick={onOrderClick} onAddToCart={onAddToCart} restaurantSettings={restaurantSettings} />
        <FeaturedPackages packages={featuredPackages} onAddToCart={onAddToCart} />
        <MenuPreview menuItems={previewItems} onOrderClick={onOrderClick} onAddToCart={onAddToCart} />
        <HowItWorks />
        <LocationHours restaurantStatus={restaurantStatus} restaurantSettings={restaurantSettings} onOrderClick={onOrderClick} />
        </>
    );
}

export default HomePage;