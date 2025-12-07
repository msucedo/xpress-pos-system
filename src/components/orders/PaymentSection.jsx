/**
 * Sección de pago con fecha de entrega y métodos de pago
 * Extraído de OrderForm.jsx para reutilización
 */
export function PaymentSection({
  formData,
  errors,
  totalPrice,
  onChange,
  onBack,
  onSubmit,
  onShowCalendar,
  isEditing
}) {
  return (
    <div className="cart-flip-back">
      <div className="cart-header">
        <button
          type="button"
          className="btn-back"
          onClick={onBack}
        >
          ← Volver
        </button>
        <h3>💰 Pago</h3>
      </div>

      <div className="payment-form">
        <div className="payment-summary-box">
          <div className="payment-total">
            <span>Total a cobrar:</span>
            <span className="payment-amount">${totalPrice}</span>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Fecha de Entrega <span className="required">*</span>
          </label>
          <div className="date-input-with-button">
            <input
              type="date"
              name="deliveryDate"
              className={`form-input ${errors.deliveryDate ? 'error' : ''}`}
              value={formData.deliveryDate}
              onChange={onChange}
            />
            <button
              type="button"
              className="view-dates-btn"
              onClick={onShowCalendar}
              title="Ver calendario de entregas"
            >
              📅 Ver fechas
            </button>
          </div>
          {errors.deliveryDate && <span className="error-message">{errors.deliveryDate}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Método de Pago</label>
          <div className="payment-methods-compact">
            <button
              type="button"
              className={`payment-method-btn ${formData.paymentMethod === 'cash' ? 'selected' : ''}`}
              onClick={() => onChange({ target: { name: 'paymentMethod', value: 'cash' } })}
            >
              💵 Efectivo
            </button>
            <button
              type="button"
              className={`payment-method-btn ${formData.paymentMethod === 'card' ? 'selected' : ''}`}
              onClick={() => onChange({ target: { name: 'paymentMethod', value: 'card' } })}
            >
              💳 Tarjeta
            </button>
            <button
              type="button"
              className={`payment-method-btn ${formData.paymentMethod === 'transfer' ? 'selected' : ''}`}
              onClick={() => onChange({ target: { name: 'paymentMethod', value: 'transfer' } })}
            >
              📱 Transfer
            </button>
            <button
              type="button"
              className={`payment-method-btn ${formData.paymentMethod === 'pending' ? 'selected' : ''}`}
              onClick={() => onChange({ target: { name: 'paymentMethod', value: 'pending' } })}
            >
              ⏳ Pendiente
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notas generales</label>
          <textarea
            name="generalNotes"
            className="form-input form-textarea"
            placeholder="Notas generales de la orden..."
            rows="2"
            value={formData.generalNotes}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="cart-actions">
        <button type="button" className="btn-secondary" onClick={onBack}>
          ← Volver al Carrito
        </button>
        <button type="button" className="btn-primary" onClick={onSubmit}>
          {isEditing ? '💾 Guardar' : '✨ Crear Orden'}
        </button>
      </div>
    </div>
  );
}
