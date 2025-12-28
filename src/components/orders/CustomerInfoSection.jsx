import ClientAutocomplete from '../ClientAutocomplete';
import { ValidatedPhoneInput } from '../inputs';

/**
 * Sección de información del cliente
 * Extraído de OrderForm.jsx para reutilización
 */
export function CustomerInfoSection({
  formData,
  errors,
  onClientChange,
  onSelectClient,
  onPhoneChange
}) {
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
            error={errors.client}
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
        />
      </div>
    </>
  );
}
