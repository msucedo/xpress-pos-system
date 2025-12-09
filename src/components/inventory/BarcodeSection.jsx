import PropTypes from 'prop-types';
import { ValidatedNumberInput } from '../inputs';
import { generateEAN13 } from '../../utils/inventory/inventoryCalculations';

/**
 * Sección de código de barras
 * Incluye input validado y botón para generar código EAN-13
 */
export function BarcodeSection({ formData, errors, onChange, onBarcodeGenerated }) {
  /**
   * Maneja la generación de código de barras
   * Solo genera si el campo está vacío
   */
  const handleGenerateBarcode = () => {
    // Solo generar si el campo está vacío
    if (formData.barcode.trim() !== '') {
      return;
    }

    const newBarcode = generateEAN13();
    onBarcodeGenerated(newBarcode);
  };

  return (
    <div className="form-group">
      <label htmlFor="barcode">Código de Barras</label>
      <div className="barcode-input-group">
        <ValidatedNumberInput
          name="barcode"
          value={formData.barcode}
          onChange={onChange}
          placeholder="Ej: 1234567890123"
          required={true}
          integer={true}
          error={errors.barcode}
          className=""
        />
        <button
          type="button"
          className="btn-generate-barcode"
          onClick={handleGenerateBarcode}
          disabled={formData.barcode.trim() !== ''}
          title={formData.barcode.trim() !== '' ? 'El campo ya tiene un código' : 'Generar código EAN-13 aleatorio'}
        >
          🎲 Generar
        </button>
      </div>
    </div>
  );
}

BarcodeSection.propTypes = {
  formData: PropTypes.shape({
    barcode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  }).isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onBarcodeGenerated: PropTypes.func.isRequired
};
