import { Icon } from '../../icons';
import { getStatusLabel, filterRegularServices } from '../../utils/orders/statusHelpers';

/**
 * Componente para lista de servicios con estado (pending/completed/cancelled)
 */
export function ServicesList({
  services,
  currentServices = [],
  flippingServices,
  onServiceClick,
  isReadOnly
}) {
  const regularServices = filterRegularServices(services);

  // Helper para obtener el icono actualizado de un servicio
  const getServiceIcon = (service) => {
    // Buscar servicio actual por ID para obtener icono actualizado (fallback a nombre para retrocompatibilidad)
    const current = service.serviceId
      ? currentServices.find(s => s.id === service.serviceId)
      : currentServices.find(s => s.name === service.serviceName);
    let icon = current?.emoji || service.icon || 'settings';

    // Si icon contiene caracteres emoji (no es nombre de icono Iconify), usar fallback
    if (icon && icon.length <= 4 && /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27BF}]/u.test(icon)) {
      icon = 'settings';
    }

    return icon;
  };

  return (
    <div className="order-pairs-section">
      <h3 className="section-title"><Icon name="services" size={20} /> Servicios ({regularServices.length})</h3>
      <div className="pairs-grid">
        {regularServices.map((service, index) => {
          const serviceIcon = getServiceIcon(service);

          return (
            <div
              key={service.id || index}
              className={`pair-detail-card pair-status-${service.status || 'pending'} ${flippingServices[service.id] ? 'flipping' : ''}`}
              onClick={isReadOnly ? undefined : () => onServiceClick(service.id, service.status)}
              title={isReadOnly ? "" : "Click para cambiar estado"}
              style={isReadOnly ? { cursor: 'default' } : {}}
            >
              <div className="pair-card-header">
                <div className="pair-header-left">
                  <span className="pair-number"><Icon name={serviceIcon} size={20} /> Servicio #{index + 1}</span>
              </div>
              <span className="pair-price-badge">${service.price}</span>
            </div>

            <div className="pair-card-body">
              <div className="pair-info-row">
                <span className="pair-info-label">Servicio:</span>
                <span className="pair-info-value">{service.serviceName}</span>
              </div>

              {/* Display de Estado (solo lectura visual) */}
              <div className="pair-status-display">
                <span className="pair-info-label">Estado:</span>
                <span className={`status-indicator status-${service.status || 'pending'}`}>
                  {getStatusLabel(service.status || 'pending')}
                </span>
              </div>

              {service.notes && (
                <div className="pair-notes">
                  <span className="pair-info-label">Notas:</span>
                  <p className="pair-notes-text">{service.notes}</p>
                </div>
              )}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
