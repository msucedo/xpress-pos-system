import PropTypes from 'prop-types';
import { PercentageConfig } from './PercentageConfig';
import { FixedConfig } from './FixedConfig';
import { BuyXGetYConfig } from './BuyXGetYConfig';
import { BuyXGetYDiscountConfig } from './BuyXGetYDiscountConfig';
import { ComboConfig } from './ComboConfig';
import { DayOfWeekConfig } from './DayOfWeekConfig';
import { SpecificPriceConfig } from './SpecificPriceConfig';

/**
 * Componente orquestador que renderiza la configuración específica
 * según el tipo de promoción seleccionado
 */
export function TypeConfigSection({
  type,
  formData,
  errors,
  onChange,
  onItemToggle,
  onComboItemToggle,
  onComboItemQuantityChange,
  onDayToggle,
  allItems
}) {
  const renderConfig = () => {
    const commonProps = {
      formData,
      errors,
      onChange,
      allItems
    };

    switch (type) {
      case 'percentage':
        return (
          <PercentageConfig
            {...commonProps}
            onItemToggle={onItemToggle}
          />
        );

      case 'fixed':
        return (
          <FixedConfig
            {...commonProps}
            onItemToggle={onItemToggle}
          />
        );

      case 'buyXgetY':
        return (
          <BuyXGetYConfig
            {...commonProps}
            onItemToggle={onItemToggle}
          />
        );

      case 'buyXgetYdiscount':
        return (
          <BuyXGetYDiscountConfig
            {...commonProps}
            onItemToggle={onItemToggle}
          />
        );

      case 'combo':
        return (
          <ComboConfig
            {...commonProps}
            onComboItemToggle={onComboItemToggle}
            onComboItemQuantityChange={onComboItemQuantityChange}
          />
        );

      case 'dayOfWeek':
        return (
          <DayOfWeekConfig
            {...commonProps}
            onDayToggle={onDayToggle}
          />
        );

      case 'specificPrice':
        return (
          <SpecificPriceConfig
            {...commonProps}
            onItemToggle={onItemToggle}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="form-section">
      <h3>Configuración del Descuento</h3>
      {renderConfig()}
    </div>
  );
}

TypeConfigSection.propTypes = {
  type: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onItemToggle: PropTypes.func.isRequired,
  onComboItemToggle: PropTypes.func.isRequired,
  onComboItemQuantityChange: PropTypes.func.isRequired,
  onDayToggle: PropTypes.func.isRequired,
  allItems: PropTypes.array.isRequired
};
