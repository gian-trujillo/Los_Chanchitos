import { getWhatsAppUrl } from "../../utils/restaurantFormatters";
import "./FloatingWhatsApp.css";

function FloatingWhatsApp({ restaurantSettings }) {
  const whatsappUrl = getWhatsAppUrl(
    restaurantSettings.whatsappPhone,
    "Hola, quiero hacer un pedido."
  );

  return (
    <a
      className="floating-whatsapp"
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <img
        className="floating-whatsapp__icon"
        src="/whatsapp_logo.png"
        alt="Icono de WhatsApp de Los Chanchitos"
      />
    </a>
  );
}

export default FloatingWhatsApp;