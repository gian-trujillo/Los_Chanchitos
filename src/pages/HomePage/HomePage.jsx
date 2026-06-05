import "./HomePage.css";
import Hero from "../../components/Hero/Hero";
import FeaturedPackages from "../../components/FeaturedPackages/FeaturedPackages";
import MenuPreview from "../../components/MenuPreview/MenuPreview";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import LocationHours from "../../components/LocationHours/LocationHours";

function HomePage({ featuredPackages, menuItems, restaurantStatus, onOrderClick }) {
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

    return (
        <>
        <Hero restaurantStatus={restaurantStatus} onOrderClick={onOrderClick} />
        <FeaturedPackages packages={featuredPackages} onOrderClick={onOrderClick} />
        <MenuPreview menuItems={previewItems} onOrderClick={onOrderClick} />
        <HowItWorks />
        <LocationHours restaurantStatus={restaurantStatus} />
        </>
    );
}

export default HomePage;