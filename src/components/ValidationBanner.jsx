import { useNotification } from '../hooks/useNotification';
import { Icon } from '../icons';
import './ValidationBanner.css';

const ValidationBanner = () => {
  const { validationErrors, clearValidationErrors } = useNotification();

  if (!validationErrors || validationErrors.length === 0) {
    return null;
  }

  return (
    <div className="validation-banner-wrapper">
      <div className="validation-banner">
        <div className="validation-banner-icon"><Icon name="warning" size={20} /></div>
        <div className="validation-banner-content">
          <div className="validation-banner-title">
            Campos requeridos faltantes:
          </div>
          <ul className="validation-banner-list">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
        <button
          className="validation-banner-close"
          onClick={clearValidationErrors}
          aria-label="Cerrar banner de validación"
        >
          <Icon name="close" size={16} />
        </button>
      </div>
    </div>
  );
};

export default ValidationBanner;
