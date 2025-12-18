import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../../icons';

/**
 * Grid de iconos con hover states y selección
 *
 * @param {Array} icons - Array de nombres de iconos a mostrar
 * @param {string} selectedIcon - Icono seleccionado actualmente
 * @param {function} onIconSelect - Callback cuando se selecciona un icono
 * @param {string} searchQuery - Query de búsqueda para filtrar iconos
 */
const IconGrid = ({ icons, selectedIcon, onIconSelect, searchQuery = '' }) => {
  // Filtrar iconos basado en búsqueda
  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) return icons;

    const query = searchQuery.toLowerCase();
    return icons.filter((iconName) =>
      iconName.toLowerCase().includes(query)
    );
  }, [icons, searchQuery]);

  // Mostrar mensaje si no hay resultados
  if (filteredIcons.length === 0) {
    return (
      <div className="icon-grid-empty">
        <Icon name="search" size={48} />
        <p>No se encontraron iconos</p>
        <span>Intenta con otro término de búsqueda</span>
      </div>
    );
  }

  return (
    <div className="icon-grid">
      {filteredIcons.map((iconName) => (
        <button
          key={iconName}
          type="button"
          className={`icon-grid-item ${selectedIcon === iconName ? 'selected' : ''}`}
          onClick={() => onIconSelect(iconName)}
          title={iconName}
          aria-label={`Seleccionar icono ${iconName}`}
          aria-pressed={selectedIcon === iconName}
        >
          <Icon name={iconName} size={32} />
          <span className="icon-name">{iconName}</span>
        </button>
      ))}
    </div>
  );
};

IconGrid.propTypes = {
  icons: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedIcon: PropTypes.string,
  onIconSelect: PropTypes.func.isRequired,
  searchQuery: PropTypes.string
};

export default IconGrid;
