import "./HowItWorks.css";

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Elige tu pedido",
      text: "Selecciona pollo, sirloin, paquetes o complementos del menú.",
    },
    {
      number: "02",
      title: "Confirma tus datos",
      text: "Ingresa tu nombre, teléfono y cualquier detalle para tu pedido.",
    },
    {
      number: "03",
      title: "Paga al recoger",
      text: "Aparta tu pedido y paga en el local. También habrá pago en línea.",
    },
    {
      number: "04",
      title: "Pasa por él",
      text: "Consulta el estado de tu pedido y recógelo cuando esté listo.",
    },
  ];

  return (
    <section className="how section" id="como-ordenar">
      <div className="section__inner">
        <p className="section__eyebrow">Cómo ordenar</p>
        <h2 className="section__title">Rápido, claro y sin cuenta.</h2>

        <div className="how__grid">
          {steps.map((step) => (
            <article className="how__step" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;