export const getClosedDayLabel = (day) => {
  const pluralDays = {
    lunes: "lunes",
    martes: "martes",
    miércoles: "miércoles",
    jueves: "jueves",
    viernes: "viernes",
    sábado: "sábados",
    domingo: "domingos",
  };

  return pluralDays[day] || day;
};

export const formatSettingsTime = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();

  date.setHours(hours);
  date.setMinutes(minutes);

  return date.toLocaleTimeString("es-MX", {
    hour: "numeric",
    minute: "2-digit",
  });
};

export const getWhatsAppUrl = (phone, message) => {
  const cleanPhone = phone.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};