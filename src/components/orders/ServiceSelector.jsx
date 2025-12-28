import { Icon } from '../../icons';

/**
 * Selector de servicios disponibles
 * Extraído de OrderForm.jsx para reutilización
 */
export function ServiceSelector({ services, onAddToCart }) {
  return (
    <>
      <div className="order-services-grid">
        {services.map((service) => (
          <button
            key={service.id}
            type="button"
            className="service-icon-button"
            onClick={() => onAddToCart(service, 'service')}
            title={`${service.name} - $${service.price}`}
          >
            <span className="service-icon-large"><Icon name={service.emoji || 'settings'} size={48} /></span>
          </button>
        ))}
      </div>
    </>
  );
}
