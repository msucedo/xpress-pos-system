import PropTypes from 'prop-types';
import { iconMap } from '../../icons';

/**
 * Categorías de iconos disponibles
 * Basado en el iconMap.js
 */
export const ICON_CATEGORIES = {
  all: {
    label: 'Todos',
    icons: Object.keys(iconMap)
  },
  products: {
    label: 'Productos',
    icons: ['package', 'box', 'product', 'inventory', 'shop', 'store']
  },
  services: {
    label: 'Servicios',
    icons: ['settings', 'config', 'processing', 'workflow', 'api', 'services']
  },
  users: {
    label: 'Usuarios',
    icons: ['user', 'client', 'customer', 'employee', 'team', 'profile', 'admin']
  },
  promotions: {
    label: 'Promociones',
    icons: ['celebration', 'promotion', 'offer', 'gift', 'sparkles', 'discount', 'sale', 'tag']
  },
  status: {
    label: 'Estados',
    icons: ['success', 'checkmark', 'check', 'approve', 'thumbs-up', 'like', 'error', 'cancel', 'warning', 'alert', 'danger', 'loading', 'processing', 'pending', 'completed', 'active', 'inactive']
  },
  actions: {
    label: 'Acciones',
    icons: ['save', 'backup', 'edit', 'add', 'plus', 'minus', 'search', 'filter', 'print', 'download', 'upload', 'share', 'sync', 'delete', 'remove', 'close']
  },
  finance: {
    label: 'Finanzas',
    icons: ['money', 'cash', 'payment', 'credit-card', 'wallet', 'invoice', 'expense', 'withdraw']
  },
  documents: {
    label: 'Documentos',
    icons: ['document', 'file', 'list', 'history', 'clipboard', 'note', 'archive', 'reports']
  },
  navigation: {
    label: 'Navegación',
    icons: ['home', 'back', 'forward', 'up', 'down', 'left', 'right', 'menu', 'more']
  },
  commerce: {
    label: 'Comercio',
    icons: ['cart', 'order', 'delivery', 'shipping']
  },
  calendar: {
    label: 'Calendario',
    icons: ['calendar', 'date', 'time', 'clock', 'schedule', 'deadline']
  },
  charts: {
    label: 'Reportes',
    icons: ['chart', 'bar-chart', 'line-chart', 'pie-chart', 'statistics', 'performance', 'dashboard']
  },
  communication: {
    label: 'Comunicación',
    icons: ['notification', 'message', 'email', 'phone', 'call', 'chat']
  },
  misc: {
    label: 'Otros',
    icons: ['info', 'help', 'question', 'star', 'favorite', 'bookmark', 'flag', 'database', 'server', 'code', 'bug', 'launch', 'rocket', 'locked', 'unlocked']
  }
};

/**
 * Componente de tabs de categorías para el IconPicker
 *
 * @param {string} selectedCategory - Categoría seleccionada actual
 * @param {function} onCategoryChange - Callback cuando se selecciona una categoría
 */
const IconCategories = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="icon-categories">
      <div className="category-tabs">
        {Object.keys(ICON_CATEGORIES).map((categoryKey) => (
          <button
            key={categoryKey}
            className={`category-tab ${selectedCategory === categoryKey ? 'active' : ''}`}
            onClick={() => onCategoryChange(categoryKey)}
            type="button"
          >
            {ICON_CATEGORIES[categoryKey].label}
          </button>
        ))}
      </div>
    </div>
  );
};

IconCategories.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired
};

export default IconCategories;
