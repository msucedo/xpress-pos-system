/**
 * Selector de servicios disponibles
 * Extraído de OrderForm.jsx para reutilización
 */
export function ServiceSelector({ services, onAddToCart }) {
  return (
    <>
      <div className="form-section-header">
        <h3 className="step-title-large">Servicios Disponibles</h3>
      </div>

      <div className="order-services-grid">
        {services.map((service) => (
          <button
            key={service.id}
            type="button"
            className="service-icon-button"
            onClick={() => onAddToCart(service, 'service')}
            title={`${service.name} - $${service.price}`}
          >
            <span className="service-icon-large">{service.emoji || '🛠️'}</span>
          </button>
        ))}
      </div>
    </>
  );
}
