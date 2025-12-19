import { formatCurrency, getPaymentStatusLabel, getPaymentMethodLabel } from '../../utils/payments/paymentHelpers';
import { formatDate, getAuthorInfo, getServiceIcons } from '../../utils/orders/orderHelpers';
import { getOrderStatusLabel } from '../../utils/orders/statusHelpers';
import { Icon } from '../../icons';

/**
 * Componente de fila individual para la tabla de órdenes
 */
export function OrderRow({ order, employees, onImageClick }) {
  const authorInfo = getAuthorInfo(order, employees);
  const serviceIcons = getServiceIcons(order);
  const firstImage = order.orderImages && order.orderImages.length > 0
    ? order.orderImages[0]
    : null;

  return (
    <tr className="oh-row">
      <td className="oh-order-number">#{parseInt(order.orderNumber, 10)}</td>

      <td className="oh-photo">
        {firstImage ? (
          <img
            src={firstImage}
            alt="Orden"
            className="oh-photo-thumbnail"
            onClick={() => onImageClick(firstImage)}
          />
        ) : (
          <div className="oh-photo-placeholder">
            <Icon name="camera" size={24} />
          </div>
        )}
      </td>

      <td className="oh-client">{order.client || 'Sin nombre'}</td>

      <td className="oh-created-date">{formatDate(order.createdAt)}</td>

      <td className="oh-delivery-date">{formatDate(order.deliveryDate)}</td>

      <td className="oh-status-order">
        <span className={`oh-status-badge ${order.statusCategory}`}>
          {getOrderStatusLabel(order.statusCategory)}
        </span>
      </td>

      <td className="oh-services">
        <div className="oh-services-icons">
          {serviceIcons.length > 0 ? (
            serviceIcons.map((service, idx) => (
              <div key={idx} className="oh-service-icon">
                <Icon name={service.emoji || 'settings'} size={20} />
                {service.count > 1 && (
                  <span className="oh-service-count">×{service.count}</span>
                )}
              </div>
            ))
          ) : (
            <span className="oh-no-services">Sin servicios</span>
          )}
        </div>
      </td>

      <td className="oh-total">{formatCurrency(order.totalPrice || 0)}</td>

      <td className="oh-payment-status">
        <span className={`oh-payment-badge ${order.paymentStatus}`}>
          {getPaymentStatusLabel(order.paymentStatus)}
        </span>
      </td>

      <td className="oh-payment-method">
        <span className={`oh-method-badge ${order.paymentMethod}`}>
          {getPaymentMethodLabel(order.paymentMethod)}
        </span>
      </td>

      <td className="oh-author">
        {authorInfo.emoji && (
          <span className="oh-author-emoji">
            <Icon name={authorInfo.emoji || 'user'} size={20} />
          </span>
        )}
        <span className="oh-author-name">{authorInfo.name}</span>
      </td>
    </tr>
  );
}
