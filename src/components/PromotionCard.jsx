import { AnimatedCard } from './animated';
import { Icon } from '../icons';
import './PromotionCard.css';

const PromotionCard = ({ promotion, onEdit, onDelete, isAdmin }) => {
  const {
    name,
    description,
    emoji,
    type,
    discountValue,
    isActive,
    dateRange,
    maxUses,
    currentUses,
    minPurchaseAmount,
    onePerClient,
    daysOfWeek
  } = promotion;

  // Determine promotion status
  const getPromotionStatus = () => {
    if (!isActive) return { label: 'Inactiva', color: 'gray' };

    // Comparar solo fechas (sin hora) para evitar problemas de timezone
    const today = new Date().toISOString().split('T')[0];

    // Check if expired
    if (dateRange?.endDate) {
      const endDate = dateRange.endDate.split('T')[0];
      if (today > endDate) {
        return { label: 'Expirada', color: 'red' };
      }
    }

    // Check if not started yet
    if (dateRange?.startDate) {
      const startDate = dateRange.startDate.split('T')[0];
      if (today < startDate) {
        return { label: 'Próximamente', color: 'blue' };
      }
    }

    // Check if max uses reached
    if (maxUses && currentUses >= maxUses) {
      return { label: 'Agotada', color: 'orange' };
    }

    return { label: 'Activa', color: 'green' };
  };

  // Get type label in Spanish
  const getTypeLabel = () => {
    const types = {
      percentage: 'Descuento %',
      fixed: 'Descuento Fijo',
      buyXgetY: '2x1 o 3x2',
      combo: 'Combo/Paquete',
      dayOfWeek: 'Día de la Semana'
    };
    return types[type] || type;
  };

  // Format discount value
  const formatDiscount = () => {
    switch (type) {
      case 'percentage':
      case 'dayOfWeek':
        return `${discountValue}% OFF`;
      case 'fixed':
        return `$${discountValue} OFF`;
      case 'buyXgetY':
        return `${promotion.buyQuantity}x${promotion.getQuantity}`;
      case 'buyXgetYdiscount':
        return `Compra ${promotion.buyQuantity} → ${promotion.discountPercentage}% OFF`;
      case 'combo':
        return `$${promotion.comboPrice}`;
      default:
        return '-';
    }
  };

  // Format date range
  const formatDateRange = () => {
    if (!dateRange) return null;

    const formatDate = (isoDate) => {
      if (!isoDate) return null;
      // Parsear como fecha local (no UTC) para evitar problemas de timezone
      const dateOnly = isoDate.split('T')[0]; // "2025-11-20"
      const [year, month, day] = dateOnly.split('-');
      const date = new Date(year, month - 1, day); // Crear en zona local
      return date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
    };

    const start = formatDate(dateRange.startDate);
    const end = formatDate(dateRange.endDate);

    if (start && end) return `${start} - ${end}`;
    if (start) return `Desde ${start}`;
    if (end) return `Hasta ${end}`;
    return null;
  };

  // Format days of week
  const formatDaysOfWeek = () => {
    if (!daysOfWeek || daysOfWeek.length === 0) return null;
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return daysOfWeek.map(d => dayNames[d]).join(', ');
  };

  const status = getPromotionStatus();

  return (
    <AnimatedCard
      className={`promotion-card ${!isActive ? 'inactive' : ''}`}
      hoverable={true}
    >
      <div className="promotion-header">
        <div className="promotion-title-section">
          <div className="promotion-name">
            <span className="promotion-emoji">
              {emoji ? <Icon name={emoji} size={24} /> : <Icon name="celebration" size={24} />}
            </span>
            {name}
          </div>
          <div className="promotion-type">{getTypeLabel()}</div>
        </div>
        <div className="promotion-discount">{formatDiscount()}</div>
      </div>

      <div className={`promotion-status-badge ${status.color}`}>
        {status.label}
      </div>

      <div className="promotion-description">{description}</div>

      <div className="promotion-details">
        {formatDateRange() && (
          <div className="promotion-detail">
            <span className="detail-icon"><Icon name="calendar" size={16} /></span>
            <span className="detail-text">{formatDateRange()}</span>
          </div>
        )}

        {formatDaysOfWeek() && (
          <div className="promotion-detail">
            <span className="detail-icon"><Icon name="calendar" size={16} /></span>
            <span className="detail-text">{formatDaysOfWeek()}</span>
          </div>
        )}

        {maxUses && (
          <div className="promotion-detail">
            <span className="detail-icon"><Icon name="tag" size={16} /></span>
            <span className="detail-text">{currentUses || 0} / {maxUses} usos</span>
          </div>
        )}

        {minPurchaseAmount && (
          <div className="promotion-detail">
            <span className="detail-icon"><Icon name="money" size={16} /></span>
            <span className="detail-text">Mínimo ${minPurchaseAmount}</span>
          </div>
        )}

        {onePerClient && (
          <div className="promotion-detail">
            <span className="detail-icon"><Icon name="user" size={16} /></span>
            <span className="detail-text">1 uso por cliente</span>
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="promotion-actions">
          <button
            className="btn-action edit"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(promotion);
            }}
          >
            <Icon name="edit" size={16} /> Editar
          </button>
          <button
            className="btn-action delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(promotion);
            }}
          >
            <Icon name="delete" size={16} /> Eliminar
          </button>
        </div>
      )}
    </AnimatedCard>
  );
};

export default PromotionCard;
