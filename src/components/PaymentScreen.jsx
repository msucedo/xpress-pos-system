import { useState, useMemo, useEffect } from 'react';
import { Icon } from '../icons';
import { AlertDialog } from './animated';
import './PaymentScreen.css';

const PaymentScreen = ({
  services = [],
  products = [],
  subtotal = 0,
  totalDiscount = 0,
  appliedPromotions = [],
  totalPrice = 0,
  advancePayment = 0,
  paymentMethod = 'cash',
  allowEditMethod = false,
  requireFullPayment = false,
  orderStatus,
  currentServices = [],
  onConfirm,
  onCancel
}) => {
  const [amountReceived, setAmountReceived] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(paymentMethod);
  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning'
  });

  // Listener para cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onCancel]);

  // Helper para obtener el icono actualizado de un servicio
  const getServiceIcon = (service) => {
    // Buscar servicio actual por ID para obtener icono actualizado (fallback a nombre para retrocompatibilidad)
    const current = service.serviceId
      ? currentServices.find(s => s.id === service.serviceId)
      : currentServices.find(s => s.name === service.serviceName);
    return current?.emoji || service.icon || 'settings';
  };

  // Agrupar servicios por nombre
  const groupedServices = useMemo(() => {
    const grouped = {};
    services.forEach(service => {
      const serviceName = service.serviceName || 'Servicio';
      if (!grouped[serviceName]) {
        grouped[serviceName] = {
          serviceName: serviceName,
          icon: getServiceIcon(service),
          price: service.price || 0,
          quantity: 0
        };
      }
      grouped[serviceName].quantity++;
    });
    return Object.values(grouped);
  }, [services, currentServices]);

  // Calcular total (interno, usado solo si no se pasa subtotal como prop)
  const calculatedSubtotal = useMemo(() => {
    const servicesTotal = groupedServices.reduce((sum, service) => sum + ((service.price || 0) * service.quantity), 0);
    const productsTotal = products.reduce((sum, product) => sum + ((product.salePrice || 0) * (product.quantity || 1)), 0);
    return servicesTotal + productsTotal;
  }, [groupedServices, products]);

  // Usar subtotal del prop si está disponible, sino calcular internamente
  const finalSubtotal = subtotal || calculatedSubtotal;

  // Saldo restante a cobrar (después de anticipo) - usar totalPrice que ya incluye descuentos
  const remainingBalance = useMemo(() => totalPrice - advancePayment, [totalPrice, advancePayment]);

  // Calcular cambio (solo si es efectivo)
  const change = useMemo(() => {
    if (selectedMethod !== 'cash') return 0;
    const received = parseFloat(amountReceived) || 0;
    const changeAmount = received - remainingBalance;
    return changeAmount > 0 ? changeAmount : 0;
  }, [selectedMethod, amountReceived, remainingBalance]);

  const handleConfirm = () => {
    // Lógica para método de pago en efectivo
    if (selectedMethod === 'cash') {
      const received = parseFloat(amountReceived) || 0;

      // Bug 2: Si es entrega (status enEntrega), validar pago completo
      if (orderStatus === 'enEntrega' && received < remainingBalance) {
        setAlertDialog({
          isOpen: true,
          title: 'Monto Insuficiente',
          message: `Debe pagar el total.\n\nTotal a pagar: $${remainingBalance.toFixed(2)}\nRecibido: $${received.toFixed(2)}\nFalta: $${(remainingBalance - received).toFixed(2)}`,
          type: 'warning'
        });
        return;
      }

      // Si requireFullPayment, SOLO permitir pago completo
      if (requireFullPayment) {
        const isPaidInFull = received >= remainingBalance;  // Validación explícita

        if (!isPaidInFull) {
          setAlertDialog({
            isOpen: true,
            title: 'Pago Incompleto',
            message: `Las órdenes sin servicios requieren pago completo.\n\nTotal: $${remainingBalance.toFixed(2)}\nRecibido: $${received.toFixed(2)}\nFalta: $${(remainingBalance - received).toFixed(2)}`,
            type: 'warning'
          });
          return;
        }

        // Pago completo validado
        onConfirm({
          amountReceived: received,
          change: received - remainingBalance,
          paymentMethod: selectedMethod,
          advancePayment: remainingBalance,
          paymentStatus: 'paid',
          isOrderWithoutServices: true  // Flag
        });
        return;
      }

      // --- FLUJO NORMAL (órdenes CON servicios) ---

      // Si hay anticipo previo (cobro en entrega), validar monto suficiente
      if (advancePayment > 0 && received < remainingBalance) {
        setAlertDialog({
          isOpen: true,
          title: 'Monto Insuficiente',
          message: `Falta: $${(remainingBalance - received).toFixed(2)}`,
          type: 'warning'
        });
        return;
      }

      // Si es orden nueva (advancePayment === 0), permitir pago parcial
      if (advancePayment === 0) {
        if (received <= 0) {
          setAlertDialog({
            isOpen: true,
            title: 'Monto Inválido',
            message: 'Debe ingresar un monto mayor a $0',
            type: 'error'
          });
          return;
        }

        // Determinar si es pago parcial o completo
        if (received < remainingBalance) {
          // Pago parcial
          onConfirm({
            amountReceived: received,
            change: 0,
            paymentMethod: selectedMethod,
            advancePayment: received,
            paymentStatus: 'partial'
          });
          return;
        } else {
          // Pago completo (pero con servicios, va a "recibidos")
          onConfirm({
            amountReceived: received,
            change: received - remainingBalance,
            paymentMethod: selectedMethod,
            advancePayment: remainingBalance,
            paymentStatus: 'paid'
          });
          return;
        }
      }
    }

    // Para otros métodos de pago (tarjeta, transferencia)
    const confirmData = {
      amountReceived: selectedMethod === 'cash' ? parseFloat(amountReceived) : remainingBalance,
      change: change,
      paymentMethod: selectedMethod,
      advancePayment: remainingBalance,
      paymentStatus: 'paid'
    };

    // Si es orden sin servicios, agregar flag
    if (requireFullPayment) {
      confirmData.isOrderWithoutServices = true;
    }

    onConfirm(confirmData);
  };

  return (
    <div className="payment-screen">
      <div className="payment-header">
        <h2 className="payment-title"><Icon name="money" size={20} /> Confirmar Cobro</h2>
        <p className="payment-subtitle">Revisa el desglose y confirma el pago</p>
        {requireFullPayment && (
          <div className="payment-warning" style={{
            backgroundColor: '#FEF3C7',
            border: '2px solid #F59E0B',
            borderRadius: '8px',
            padding: '12px',
            marginTop: '12px',
            textAlign: 'center',
            color: '#92400E',
            fontWeight: '500'
          }}>
            <Icon name="warning" size={18} /> Esta orden solo contiene productos y debe pagarse completamente
          </div>
        )}
      </div>

      <div className="payment-content">
        {/* Desglose de Servicios */}
        {groupedServices.length > 0 && (
          <div className="payment-section">
            <h3 className="section-header"><Icon name="settings" size={20} /> Servicios</h3>
            <div className="items-list">
              {groupedServices.map((service, index) => (
                <div key={index} className="item-row">
                  <span className="item-icon"><Icon name={service.icon || 'settings'} size={20} /></span>
                  <span className="item-name">
                    {service.serviceName}
                    {service.quantity > 1 && (
                      <span className="item-quantity"> x{service.quantity}</span>
                    )}
                  </span>
                  <span className="item-price">${service.price * service.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Desglose de Productos */}
        {products.length > 0 && (
          <div className="payment-section">
            <h3 className="section-header"><Icon name="package" size={20} /> Productos</h3>
            <div className="items-list">
              {products.map((product, index) => (
                <div key={product.id || index} className="item-row">
                  <span className="item-icon"><Icon name={product.emoji || 'package'} size={20} /></span>
                  <span className="item-name">
                    {product.name} <span className="item-quantity">x{product.quantity}</span>
                  </span>
                  <span className="item-price">${product.salePrice * product.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resumen de Totales */}
        <div className="payment-summary">
          {totalDiscount > 0 && (
            <>
              <div className="summary-row subtotal-row">
                <span className="summary-label">Subtotal:</span>
                <span className="summary-value">${finalSubtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row discount-row">
                <span className="summary-label">
                  Descuentos:
                  {appliedPromotions.length > 0 && (
                    <span className="promotions-list">
                      {appliedPromotions.map((promo, idx) => (
                        <span key={idx} className="promo-tag">
                          <Icon name={promo.emoji || 'celebration'} size={16} /> {promo.name}
                        </span>
                      ))}
                    </span>
                  )}
                </span>
                <span className="summary-value discount-value">-${totalDiscount.toFixed(2)}</span>
              </div>
            </>
          )}

          <div className="summary-row total-row">
            <span className="summary-label">Total:</span>
            <span className="summary-value total-value">${totalPrice.toFixed(2)}</span>
          </div>

          {advancePayment > 0 && (
            <>
              <div className="summary-row advance-row">
                <span className="summary-label">Anticipo:</span>
                <span className="summary-value">-${advancePayment.toFixed(2)}</span>
              </div>
              <div className="summary-row remaining-row">
                <span className="summary-label">Saldo Restante:</span>
                <span className="summary-value remaining-value">${remainingBalance.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

        {/* Campo de Monto Recibido (solo efectivo) */}
        {selectedMethod === 'cash' && (
          <div className="cash-payment-section">
            <div className="cash-input-group">
              <label className="cash-label"><Icon name="money" size={18} /> Monto Recibido:</label>
              <input
                type="number"
                className="cash-input"
                placeholder="0.00"
                value={amountReceived}
                onChange={(e) => setAmountReceived(e.target.value)}
                step="0.01"
                min="0"
                autoFocus
              />
            </div>

            {change > 0 && (
              <div className="change-display">
                <span className="change-label">Cambio:</span>
                <span className="change-value">${change.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}

        {/* Método de pago - Editable o Read-only */}
        {allowEditMethod ? (
          <div className="payment-section">
            <h3 className="section-header">Método de Pago</h3>
            <div className="payment-methods-grid">
              <button
                type="button"
                className={`payment-method-btn ${selectedMethod === 'cash' ? 'selected' : ''}`}
                onClick={() => setSelectedMethod('cash')}
              >
                <Icon name="money" size={18} /> Efectivo
              </button>
              <button
                type="button"
                className={`payment-method-btn ${selectedMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setSelectedMethod('card')}
              >
                <Icon name="credit-card" size={18} /> Tarjeta
              </button>
              <button
                type="button"
                className={`payment-method-btn ${selectedMethod === 'transfer' ? 'selected' : ''}`}
                onClick={() => setSelectedMethod('transfer')}
              >
                <Icon name="smartphone" size={18} /> Transfer
              </button>
              {/* Bug 3: No mostrar "Pendiente" cuando status es enEntrega */}
              {orderStatus !== 'enEntrega' && (
                <button
                  type="button"
                  className={`payment-method-btn ${selectedMethod === 'pending' ? 'selected' : ''}`}
                  onClick={() => setSelectedMethod('pending')}
                >
                  <Icon name="pending" size={18} /> Pendiente
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="payment-method-info">
            <span className="method-label">Método de Pago:</span>
            <span className="method-value">
              {selectedMethod === 'cash' && <><Icon name="money" size={18} /> Efectivo</>}
              {selectedMethod === 'card' && <><Icon name="credit-card" size={18} /> Tarjeta</>}
              {selectedMethod === 'transfer' && <><Icon name="smartphone" size={18} /> Transferencia</>}
              {selectedMethod === 'pending' && <><Icon name="pending" size={18} /> Pendiente</>}
            </span>
          </div>
        )}
      </div>

      {/* Botones de Acción */}
      <div className="payment-actions">
        <button type="button" className="btn-cancel-payment" onClick={onCancel}>
          <Icon name="close" size={18} /> Cancelar
        </button>
        <button type="button" className="btn-confirm-payment" onClick={handleConfirm}>
          <Icon name="check" size={18} /> Confirmar Cobro
        </button>
      </div>

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        title={alertDialog.title}
        message={alertDialog.message}
        type={alertDialog.type}
        onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
      />
    </div>
  );
};

export default PaymentScreen;
