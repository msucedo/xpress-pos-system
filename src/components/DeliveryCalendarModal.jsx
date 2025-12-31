import { useEffect } from 'react';
import './DeliveryCalendarModal.css';
import { Icon } from '../icons';

const DeliveryCalendarModal = ({ isOpen, onClose, allOrders }) => {
  // Listener para cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Obtener los próximos 3 días
  const getNextThreeDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 1; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }

    return days;
  };

  // Formatear fecha para mostrar (ej: "28 Ene")
  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleDateString('es-ES', { month: 'short' });
    return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)}`;
  };

  // Obtener nombre del día de la semana
  const getDayName = (date) => {
    const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
    return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  };

  // Detectar si es fin de semana
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Domingo, 6 = Sábado
  };

  // Formatear fecha para comparación (YYYY-MM-DD) usando zona horaria local
  const formatDateForComparison = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Obtener todas las órdenes de todas las columnas
  const getAllOrders = () => {
    const orders = [];
    if (allOrders) {
      Object.keys(allOrders).forEach(status => {
        if (Array.isArray(allOrders[status])) {
          orders.push(...allOrders[status]);
        }
      });
    }
    return orders;
  };

  // Filtrar órdenes por fecha de entrega
  const getOrdersForDate = (date) => {
    const dateStr = formatDateForComparison(date);
    const allOrdersList = getAllOrders();

    return allOrdersList.filter(order => {
      if (!order.deliveryDate) return false;
      // Normalizar la fecha de la orden para comparación
      const orderDate = order.deliveryDate.split('T')[0];
      return orderDate === dateStr;
    });
  };

  // Obtener configuración de estado
  const getStatusConfig = (status) => {
    const configs = {
      recibidos: { label: 'Recibido', emoji: '📥', color: 'blue' },
      proceso: { label: 'Proceso', emoji: '🔧', color: 'orange' },
      listos: { label: 'Listo', emoji: '✅', color: 'green' },
      enEntrega: { label: 'Entrega', emoji: '🚚', color: 'purple' },
      completados: { label: 'Completado', emoji: '✓', color: 'success' },
      cancelado: { label: 'Cancelado', emoji: '✗', color: 'red' }
    };
    return configs[status] || { label: status, emoji: '❓', color: 'gray' };
  };

  // Agrupar servicios por emoji
  const getServiceEmojis = (order) => {
    if (!order.services || order.services.length === 0) return [];

    const activeServices = order.services.filter(service => service.status !== 'cancelled');
    const grouped = {};

    activeServices.forEach(service => {
      const emoji = service.icon || '🛠️';
      if (!grouped[emoji]) {
        grouped[emoji] = { emoji, count: 0 };
      }
      grouped[emoji].count++;
    });

    return Object.values(grouped);
  };

  const nextThreeDays = getNextThreeDays();

  return (
    <div className="delivery-calendar-overlay" onClick={onClose}>
      <div className="delivery-calendar-modal" onClick={(e) => e.stopPropagation()}>
        <div className="delivery-calendar-header">
          <h3>📅 Entregas Próximos 3 Días</h3>
          <button className="calendar-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="delivery-calendar-content">
          {nextThreeDays.map((date, index) => {
            const ordersForDate = getOrdersForDate(date);

            return (
              <div key={index} className="calendar-day-column">
                <div className={`calendar-day-header ${isWeekend(date) ? 'weekend' : ''}`}>
                  <div className="day-number">{formatDate(date)}</div>
                  <div className="day-name">{getDayName(date)}</div>
                  {isWeekend(date) && <span className="weekend-badge">Fin de semana</span>}
                </div>
                <div className="calendar-day-orders">
                  {ordersForDate.length === 0 ? (
                    <div className="calendar-empty-day">
                      Sin entregas
                    </div>
                  ) : (
                    ordersForDate.map((order) => {
                      const serviceEmojis = getServiceEmojis(order);
                      const statusConfig = getStatusConfig(order.orderStatus);

                      return (
                        <div key={order.id} className="calendar-order-item">
                          <div className="calendar-order-number">#{parseInt(order.orderNumber, 10)}</div>
                          {serviceEmojis.length > 0 && (
                            <div className="calendar-order-services">
                              {serviceEmojis.map((service, idx) => (
                                <span key={idx} className="calendar-service-emoji">
                                  <Icon name={service.emoji} size={14} />
                                </span>
                              ))}
                            </div>
                          )}
                          <span className={`calendar-order-status-badge status-${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="calendar-day-count">
                  {ordersForDate.length} {ordersForDate.length === 1 ? 'orden' : 'órdenes'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DeliveryCalendarModal;
