import PropTypes from 'prop-types';
import { PROMOTION_TYPE_CONFIG } from '../../utils/promotions/promotionTypes';

/**
 * Selector de tipo de promoción
 * Muestra un grid con las 7 opciones de promoción disponibles
 */
export function PromotionTypeSelector({ selectedType, onChange }) {
  const typeOrder = [
    'percentage',
    'fixed',
    'buyXgetY',
    'buyXgetYdiscount',
    'combo',
    'dayOfWeek',
    'specificPrice'
  ];

  return (
    <div className="form-section">
      <h3>Tipo de Promoción</h3>
      <div className="promotion-types">
        {typeOrder.map(typeKey => {
          const config = PROMOTION_TYPE_CONFIG[typeKey];
          return (
            <label
              key={typeKey}
              className={`type-option ${selectedType === typeKey ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="type"
                value={typeKey}
                checked={selectedType === typeKey}
                onChange={onChange}
              />
              <span className="type-label">
                <span className="type-icon">{config.icon}</span>
                <span>
                  <span>{config.label}</span>
                  <small className="type-example">{config.example}</small>
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

PromotionTypeSelector.propTypes = {
  selectedType: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
