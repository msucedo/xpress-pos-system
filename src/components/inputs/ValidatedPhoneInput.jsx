import { useEffect, useState, useRef } from 'react';
import { useInputValidation } from '../../hooks/useInputValidation';
import { formatPhone } from '../../utils/inputValidation';
import './ValidatedInput.css';
import '../ClientAutocomplete.css';

/**
 * Input de teléfono validado - Solo permite dígitos (0-9)
 * Previene la entrada de letras y caracteres especiales en tiempo real
 * Limita a 10 dígitos
 * Opcionalmente puede mostrar autocomplete de clientes por teléfono
 */
const ValidatedPhoneInput = ({
  name,
  value,
  onChange,
  label,
  placeholder = '5551234567',
  required = false,
  error = '',
  hint = '',
  autoFocus = false,
  disabled = false,
  className = '',
  // Props para autocomplete
  clients = [],
  onSelectClient,
  showAutocomplete = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredClients, setFilteredClients] = useState([]);
  const wrapperRef = useRef(null);
  const {
    value: internalValue,
    setValue,
    onChange: handleValidatedChange,
    onKeyPress,
    onPaste,
    showFeedback,
  } = useInputValidation(value, 'PHONE', {
    maxLength: 10,
    onChange: (e) => {
      // Formatear el teléfono (solo dígitos, máximo 10)
      const formatted = formatPhone(e.target.value);

      // Propagar el cambio al componente padre
      if (onChange) {
        onChange({
          target: {
            name,
            value: formatted,
          },
        });
      }
    },
  });

  // Sincronizar con el valor externo
  useEffect(() => {
    if (value !== internalValue) {
      setValue(value);
    }
  }, [value]);

  // Manejar click fuera del dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrar clientes por teléfono (igual que ClientAutocomplete)
  useEffect(() => {
    if (!showAutocomplete || !clients.length) {
      setFilteredClients([]);
      return;
    }

    let filtered;

    if (internalValue.trim() === '') {
      // Mostrar todos los clientes cuando está vacío
      filtered = [...clients];
    } else {
      // Filtrar clientes cuyo teléfono incluya los dígitos ingresados
      filtered = clients.filter(client =>
        client.phone.includes(internalValue)
      );
    }

    // Ordenar alfabéticamente por nombre
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    setFilteredClients(filtered);
  }, [internalValue, clients, showAutocomplete]);

  // Handlers para autocomplete
  const handleInputChange = (e) => {
    handleValidatedChange(e);
    if (showAutocomplete) {
      setIsOpen(true);
    }
  };

  const handleFocus = () => {
    if (showAutocomplete) {
      setIsOpen(true);
    }
  };

  const handleSelectClient = (client) => {
    if (onSelectClient) {
      onSelectClient(client);
    }
    setIsOpen(false);
  };

  const getInitials = (name) => {
    const names = name.split(' ');
    return names.map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Mostrar indicador de validez (10 dígitos)
  const isValid = internalValue.length === 10;
  const showValidationIcon = internalValue.length > 0;

  return (
    <div className={`form-group ${className}`} ref={wrapperRef}>
      {label && (
        <label className="form-label">
          {label}{' '}
          {required ? (
            <span className="required">*</span>
          ) : (
            <span className="optional">(Opcional)</span>
          )}
        </label>
      )}
      <div className="validated-input-wrapper">
        <input
          type="tel"
          name={name}
          className={`form-input ${error ? 'error' : ''} ${
            showFeedback ? 'shake' : ''
          } ${isValid && !error ? 'valid' : ''}`}
          placeholder={placeholder}
          value={internalValue}
          onChange={handleInputChange}
          onKeyPress={onKeyPress}
          onPaste={onPaste}
          onFocus={handleFocus}
          autoFocus={autoFocus}
          disabled={disabled}
          maxLength={10}
        />
        {showValidationIcon && !error && (
          <span className={`validation-icon ${isValid ? 'valid' : 'incomplete'}`}>
            {isValid ? '✓' : `${internalValue.length}/10`}
          </span>
        )}
        {showFeedback && (
          <div className="input-feedback">
            {internalValue.length >= 10
              ? 'Máximo 10 dígitos alcanzado'
              : 'Solo se permiten números'}
          </div>
        )}
      </div>
      {error && <span className="error-message">{error}</span>}
      {hint && !error && <span className="field-hint">{hint}</span>}

      {/* Autocomplete dropdown */}
      {showAutocomplete && isOpen && filteredClients.length > 0 && (
        <div className="autocomplete-dropdown">
          <div className="dropdown-header">
            <span className="dropdown-title">Clientes con este teléfono</span>
            <span className="dropdown-count">{filteredClients.length}</span>
          </div>
          <div className="dropdown-list">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="dropdown-item"
                onClick={() => handleSelectClient(client)}
              >
                <div className={`client-avatar-small ${client.isVip ? 'vip' : ''}`}>
                  {getInitials(client.name)}
                </div>
                <div className="client-info-small">
                  <div className="client-name-small">
                    {client.name}
                    {client.isVip && <span className="vip-badge">⭐</span>}
                  </div>
                  <div className="client-phone-small">{client.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidatedPhoneInput;
