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
    icons: ['adjacent', 'info', 'help', 'question', 'star', 'favorite', 'bookmark', 'flag', 'database', 'server', 'code', 'bug', 'close', 'close-2', 'close-3', 'launch', 'rocket', 'locked', 'unlocked', 'save-close']
  },
  media: {
    label: 'Medios e Imágenes',
    icons: ['compact-camera', 'camera', 'photo-camera', 'old-camera', 'camera-addon', 'camera-identification', 'rotate-camera', 'switch-camera', 'multiple-cameras', 'gallery', 'image-file', 'add-image', 'edit-image', 'remove-image', 'stack-of-photos', 'photo-reel', 'picture']
  },
  video: {
    label: 'Video y Audio',
    icons: ['video-file', 'audio-file', 'camcorder', 'camcorder-pro', 'no-video', 'video-call', 'clapperboard', 'film', 'film-reel']
  },
  business: {
    label: 'Negocios',
    icons: ['briefcase', 'address-book', 'contacts-book', 'signature', 'business', 'business-contact']
  },
  devices: {
    label: 'Dispositivos',
    icons: ['cell-phone', 'mobile', 'smartphone-tablet', 'tablet-android', 'tablet', 'multiple-smartphones', 'iphone', 'ipad', 'touchscreen-smartphone', 'two-smartphones', 'multiple-devices']
  },
  tools: {
    label: 'Herramientas',
    icons: ['calculator', 'calc', 'area-chart', 'doughnut-chart', 'heat-map', 'mind-map', 'radar-plot', 'scatter-plot', 'clear-filters', 'ruler']
  },
  data: {
    label: 'Datos',
    icons: ['export', 'export-data', 'import', 'import-data', 'statistics', 'stats', 'organization', 'org', 'genealogy', 'tree-structure', 'org-unit', 'flow-chart']
  },
  connectivity: {
    label: 'Conectividad',
    icons: ['wifi', 'wi-fi', 'wifi-logo', 'online-support', 'webcam', 'integrated-webcam', 'nfc-sign', 'nfc']
  },
  education: {
    label: 'Educación',
    icons: ['graduation-cap', 'graduation', 'diploma-1', 'diploma-2', 'diploma', 'certificate']
  },
  security: {
    label: 'Seguridad',
    icons: ['privacy', 'data-protection', 'data-encryption', 'encryption', 'data-recovery', 'recovery', 'key', 'safe', 'biohazard']
  },
  files: {
    label: 'Archivos',
    icons: ['filing-cabinet', 'cabinet', 'fine-print', 'disclaimer', 'opened-folder']
  },
  clothes: {
    label: 'Ropa',
    icons: [
      'alteration', 'apple-watch', 'apron', 'backpack', 'bag', 'baseball-cap',
      'beeswax', 'boots', 'bowler-hat', 'cap', 'choose-a-dress', 'closed-umbrella',
      'diamond-ring', 'earrings', 'fabric-sample', 'farmer-hat', 'flip-flops',
      'footwear', 'geta', 'glasses', 'hand-fan', 'hand-with-bracelet', 'hanger',
      'heel', 'mens-belt', 'mitten', 'map', 'map-2', 'noticeboard', 'pin', 'pin-2',
      'pin-3', 'pair-of-sneakers', 'pair-of-socks', 'rubber-boots', 'sandals',
      'safety-pin', 'santa-hat', 'scarf', 'school-backpack', 'shoe-brush', 'shoes',
      'slippers', 'smart-watch', 'socks', 'sun-glasses', 'trainers', 'umbrella',
      'uncomfortable-shoes', 'valenki', 'wash-by-hand', 'watches-front-view',
      'winter-boots', 'womens-shoe', 'womens-belt', 'work-boot', 'zipper'
    ]
  },
  characters: {
    label: 'Personajes',
    icons: [
      'aang', 'agent-smith', 'anonymous', 'baby-yoda', 'batman', 'beast', 'black-blood', 'bmo',
      'c3po', 'captain-america', 'chewbacca', 'chucky', 'cartman', 'cookie-monster', 'cylon',
      'darth-vader', 'deadpool', 'dobby', 'nemo', 'finn', 'freddy', 'bender', 'fry', 'professor-farnsworth',
      'gizmo', 'goofy', 'billy-mandy', 'green-lantern', 'grinch', 'groot', 'hammerstein', 'harry-potter',
      'hercules', 'homer', 'hulk', 'ice-king', 'iron-man', 'jake', 'jason', 'jetpack', 'jerry',
      'jimmy-neutron', 'joe-pineapples', 'john-wick', 'joker', 'joker-suicide', 'kenny', 'kyle',
      'voldemort', 'luigi', 'lumpy-space', 'mek-quake', 'martian', 'dali', 'mongrol', 'mike', 'sulley',
      'morty', 'mummy', 'mystique', 'navi', 'neo', 'pennywise', 'popeye', 'pumbaa', 'r2d2',
      'scooby', 'fred-jones', 'shaggy', 'scream', 'shrek', 'simba', 'sonic', 'smurf', 'spongebob',
      'stan', 'steven', 'stitch', 'stormtrooper', 'mario', 'thanos', 'the-coon', 'thor', 'timon',
      'tom', 'totoro', 'trinity', 'venom', 'walter-white', 'wall-e', 'wolverine', 'woody', 'yoda'
    ]
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
