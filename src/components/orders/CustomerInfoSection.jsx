import ClientAutocomplete from '../ClientAutocomplete';
import { ValidatedPhoneInput } from '../inputs';

/**
 * Sección de información del cliente
 * Extraído de OrderForm.jsx para reutilización
 * Soporta búsqueda bidireccional: por nombre y por teléfono
 */
export function CustomerInfoSection({
  formData,
  errors,
  clients = [],
  onClientChange,
  onSelectClient,
  onPhoneChange,
  onSelectClientByPhone
}) {
  // Validar si el cliente está completo: cliente seleccionado + teléfono de 10 dígitos
  const isClientValid = formData.clientId && formData.phone.length === 10;

  return (
    <>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">
            Cliente <span className="required">*</span>
          </label>
          <ClientAutocomplete
            value={formData.client}
            onChange={onClientChange}
            onSelectClient={onSelectClient}
            clients={clients}
            error={errors.client}
            isValid={isClientValid}
          />
          {errors.client && <span className="error-message">{errors.client}</span>}
        </div>

        <ValidatedPhoneInput
          name="phone"
          value={formData.phone}
          onChange={onPhoneChange}
          label="Teléfono"
          placeholder="5551234567"
          required={true}
          error={errors.phone}
          clients={clients}
          onSelectClient={onSelectClientByPhone}
          showAutocomplete={!formData.client}
        />
      </div>
    </>
  );
}
