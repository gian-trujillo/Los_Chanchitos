import "./FeaturedPackages.css";

function FeaturedPackages({ packages, onAddToCart }) {
  return (
    <section className="featured section" id="paquetes">
      <div className="section__inner">
        <div className="featured__header">
          <div>
            <p className="section__eyebrow">Paquetes</p>
            <h2 className="section__title">Los favoritos para compartir.</h2>
          </div>
          <p className="section__text featured__text">
            Paquetes con pollo al carbón, sirloin y complementos. Elige pollo
            asado o al ataúd al ordenar.
          </p>
        </div>

        <div className="featured__grid">
          {packages.map((item) => (
            <article
              className={`featured__card ${
                item.inventoryStatus?.isSoldOut ? "featured__card--sold-out" : ""
              }`}
              key={item.id}
            >
              <div className="featured__image-wrap">
                <img src={item.image} alt={item.name} />
              </div>

              <div className="featured__content">
                <span className="badge">{item.badge}</span>

                {item.inventoryStatus?.isLowStock && (
                  <span className="featured__stock-badge">
                    {item.inventoryStatus.lowStockLabel}
                  </span>
                )}

                {item.inventoryStatus?.isSoldOut && (
                  <span className="featured__stock-badge featured__stock-badge--sold-out">
                    Agotado
                  </span>
                )}
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="featured__bottom">
                  <strong>${item.price} MXN</strong>
                  <button
                    className="button button--fire"
                    type="button"
                    disabled={item.inventoryStatus?.isSoldOut}
                    onClick={() => onAddToCart(item)}
                  >
                    {item.inventoryStatus?.isSoldOut ? "Agotado" : "Agregar"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedPackages;