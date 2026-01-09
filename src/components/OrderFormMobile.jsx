import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ClientAutocomplete from './ClientAutocomplete';
import PaymentScreen from './PaymentScreen';
import DeliveryCalendarModal from './DeliveryCalendarModal';
import PromotionBadge from './PromotionBadge';
import ImageUpload from './ImageUpload';
import { CartPromotionsBanner } from './cart/CartPromotionsBanner';
import { ValidatedPhoneInput } from './inputs';
import { Icon } from '../icons';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { slideVariants, transitions } from '../animations';
import { useOrderFormData } from '../hooks/useOrderFormData';
import { useCartManagement } from '../hooks/useCartManagement';
import { usePromotionsCalculation } from '../hooks/usePromotionsCalculation';
import { useOrderImages } from '../hooks/useOrderImages';
import { useEmployeeAssignment } from '../hooks/useEmployeeAssignment';
import { calculateSubtotal, calculateTotalDiscount, calculateTotalPrice } from '../utils/promotions/promotionCalculations';
import { getPromotionPriority, getItemsWithPromoBadge, isPromotionRelevantForCart } from '../utils/promotions/promotionHelpers';
import { generateCartItemId, expandServicesForOrder, hasExpressService } from '../utils/cart/cartHelpers';
import './OrderFormMobile.css';

/**
 * Formulario de orden para dispositivos móviles
 * Arquitectura modular: Reutiliza hooks y utilidades de OrderForm.jsx
 *
 * HOOKS REUTILIZADOS:
 * - useOrderFormData: Estado del formulario y validaciones
 * - useCartManagement: Manejo del carrito (agregar/quitar items)
 * - usePromotionsCalculation: Cálculo automático de promociones
 * - useOrderImages: Manejo de imágenes de la orden
 * - useEmployeeAssignment: Asignación automática de empleados
 *
 * UTILIDADES REUTILIZADAS:
 * - promotionCalculations: Cálculos de subtotal, descuentos, total
 * - promotionHelpers: Helpers de promociones
 * - cartHelpers: Helpers del carrito
 *
 * DIFERENCIAS CON DESKTOP:
 * - Layout mobile-first con stack vertical
 * - PaymentScreen como pantalla completa separada
 * - CSS específico para móvil (.order-form-mobile-*)
 */
const OrderFormMobile = ({ onSubmit, onCancel, initialData = null, employees = [], allOrders = {} }) => {
  const { employee } = useAuth();
  const { showValidationErrors } = useNotification();

  // Hooks reutilizados de OrderForm
  const { formData, errors, handleChange, handleClientInputChange, handleSelectClient, handleSelectClientByPhone, validateBasicForm, validateForm, setErrors } = useOrderFormData(initialData);
  const { cart, handleAddToCart: addToCartFromHook, handleRemoveFromCart } = useCartManagement();

  // Wrapper para limpiar error de carrito al agregar items
  const handleAddToCart = (item, type = 'service') => {
    addToCartFromHook(item, type);
    // Limpiar error de carrito vacío si existe
    if (errors.cart) {
      setErrors(prev => ({ ...prev, cart: '' }));
    }
  };
  const { orderImages, setOrderImages } = useOrderImages(initialData);
  const { selectedEmployee, setSelectedEmployee } = useEmployeeAssignment(employees, allOrders, employee);

  // Estado específico de móvil
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [activePromotions, setActivePromotions] = useState([]);
  const [clients, setClients] = useState([]);

  // Hook de promociones con parámetros correctos
  const { appliedPromotions, promotionValidations, refetchPromotions } = usePromotionsCalculation(cart, formData.phone, activePromotions);

  // Memoizar el mapa de items -> promoción asignada
  const itemPromotionMap = useMemo(() => {
    const map = new Map();
    const sortedPromotions = [...(appliedPromotions || [])].sort((a, b) =>
      getPromotionPriority(a) - getPromotionPriority(b)
    );

    sortedPromotions.forEach(promo => {
      cart.forEach(item => {
        if (map.has(item.id)) return;

        let applies = false;
        switch (promo.type) {
          case 'percentage':
            if (promo.appliesTo === 'all') applies = true;
            else if (promo.appliesTo === 'services') applies = item.type === 'service';
            else if (promo.appliesTo === 'products') applies = item.type === 'product';
            else if (promo.appliesTo === 'specific' && promo.specificItems) {
              const itemId = item.type === 'service' ? item.serviceId : item.productId;
              applies = promo.specificItems.includes(itemId);
            }
            break;
          case 'fixed':
            if (!promo.applicableItems || promo.applicableItems.length === 0) {
              applies = true;
            } else {
              const itemId = item.type === 'service' ? item.serviceId : item.productId;
              applies = promo.applicableItems.includes(itemId);
            }
            break;
          case 'buyXgetY':
          case 'buyXgetYdiscount':
            const itemsWithBadge = getItemsWithPromoBadge(promo, cart, map);
            applies = itemsWithBadge.includes(item.id);
            break;
          case 'combo':
            if (promo.comboItems?.length > 0) {
              const itemId = item.type === 'service' ? item.serviceId : item.productId;
              applies = promo.comboItems.some(ci => ci.id === itemId);
            }
            break;
          case 'specificPrice':
            if (promo.applicableItems && promo.applicableItems.length > 0) {
              const itemId = item.type === 'service' ? item.serviceId : item.productId;
              applies = promo.applicableItems.includes(itemId);
            }
            break;
          case 'dayOfWeek':
            applies = true;
            break;
        }

        if (applies) {
          map.set(item.id, promo);
        }
      });
    });

    return map;
  }, [appliedPromotions, cart]);

  // Cargar servicios desde Firebase
  useEffect(() => {
    const loadServices = async () => {
      try {
        const { subscribeToServices } = await import('../services/firebaseService');
        const unsubscribe = subscribeToServices((servicesData) => {
          const processedServices = servicesData.map(service => {
            const durationMatch = service.duration?.match(/(\d+)(?:-(\d+))?/);
            const daysToAdd = durationMatch ? parseInt(durationMatch[2] || durationMatch[1]) : 2;
            return { ...service, daysToAdd };
          });
          setServices(processedServices);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error('Error loading services:', error);
      }
    };

    const loadProducts = async () => {
      try {
        const { subscribeToInventory } = await import('../services/firebaseService');
        const unsubscribe = subscribeToInventory((productsData) => {
          const availableProducts = productsData.filter(p => p.stock > 0);
          setProducts(availableProducts);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    const loadPromotions = async () => {
      try {
        const { getActivePromotions } = await import('../services/firebaseService');
        const promotions = await getActivePromotions();
        setActivePromotions(promotions);
      } catch (error) {
        console.error('Error loading promotions:', error);
      }
    };

    const loadClients = async () => {
      try {
        const { subscribeToClients } = await import('../services/firebaseService');
        const unsubscribe = subscribeToClients((clientsData) => {
          setClients(clientsData);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error('Error loading clients:', error);
      }
    };

    loadServices();
    loadProducts();
    loadPromotions();
    loadClients();
  }, []);

  // Auto-calcular fecha de entrega al seleccionar servicios
  useEffect(() => {
    if (cart.length > 0 && !formData.deliveryDate) {
      const serviceItems = cart.filter(item => item.type === 'service');
      if (serviceItems.length > 0) {
        const maxDays = Math.max(...serviceItems.map(item => item.daysToAdd || 2));
        const today = new Date();
        today.setDate(today.getDate() + maxDays);
        formData.deliveryDate = today.toISOString().split('T')[0];
      }
    }
  }, [cart, formData.deliveryDate]);

  /**
   * Maneja el submit del formulario
   * Si el método de pago NO es pending, muestra PaymentScreen primero
   * Si es pending, crea la orden directamente
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateBasicForm(cart)) {
      if (formData.paymentMethod !== 'pending') {
        setShowPaymentScreen(true);
      } else {
        createOrder();
      }
    }
  };

  /**
   * Crea la orden con los datos del carrito y formulario
   * Función extraída para ser llamada desde submit o desde PaymentScreen
   */
  const createOrder = async (paymentStatus = null, advancePayment = 0) => {
    setIsSubmitting(true);

    const serviceItems = cart.filter(item => item.type === 'service');
    const productItems = cart.filter(item => item.type === 'product');

    // Expandir servicios con cantidades a servicios individuales
    const services = expandServicesForOrder(serviceItems);

    // Transformar productos a formato de orden (con snapshot de datos)
    const products = productItems.map(item => ({
      id: generateCartItemId(),
      productId: item.productId,
      name: item.name,
      salePrice: item.price,
      purchasePrice: item.purchasePrice,
      sku: item.sku,
      barcode: item.barcode,
      category: item.category,
      emoji: item.emoji,
      quantity: item.quantity
    }));

    const orderData = {
      ...formData,
      clientId: formData.clientId,
      clientName: formData.client,
      services,
      products,
      orderImages: orderImages,
      subtotal: subtotal,
      totalDiscount: totalDiscount,
      appliedPromotions: appliedPromotions.map(promo => ({
        id: promo.id,
        name: promo.name,
        type: promo.type,
        discountAmount: promo.discountAmount,
        emoji: promo.emoji
      })),
      totalPrice: totalPrice,
      advancePayment: advancePayment,
      paymentStatus: paymentStatus || (formData.paymentMethod === 'pending' ? 'pending' : 'partial'),
      priority: hasExpressService(cart) ? 'high' : 'normal',
      author: selectedEmployee ? selectedEmployee.name : '',
      authorId: selectedEmployee ? selectedEmployee.id : null,
      orderCreatedBy: employee ? { id: employee.id, name: employee.name } : null
    };

    // Incrementar uso de promociones
    if (appliedPromotions.length > 0) {
      const { incrementPromotionUsage } = await import('../services/firebaseService');
      for (const promo of appliedPromotions) {
        try {
          await incrementPromotionUsage(promo.id, formData.phone);
        } catch (error) {
          console.error('Error incrementing promotion usage:', error);
        }
      }
    }

    // Esperar 1.5s para mostrar animación antes de cerrar
    setTimeout(() => {
      onSubmit(orderData);
    }, 1500);
  };

  /**
   * Handler cuando se confirma el cobro desde PaymentScreen
   */
  const handlePaymentConfirm = (paymentData) => {
    setShowPaymentScreen(false);
    createOrder(paymentData.paymentStatus, paymentData.advancePayment);
  };

  /**
   * Handler para cancelar desde PaymentScreen
   */
  const handlePaymentCancel = () => {
    setShowPaymentScreen(false);
  };

  // Calcular totales usando utilidades
  const subtotal = calculateSubtotal(cart);
  const totalDiscount = calculateTotalDiscount(appliedPromotions);
  const totalPrice = calculateTotalPrice(cart, appliedPromotions);
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className="order-form-mobile-container">
      {/* Animación de Éxito */}
      {isSubmitting && (
        <div className="success-overlay-mobile">
          <div className="success-animation-mobile">
            <div className="success-checkmark-mobile">
              <svg className="checkmark-mobile" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark-circle-mobile" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark-check-mobile" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
            <h2 className="success-title-mobile">{initialData ? '¡Orden Actualizada!' : '¡Orden Creada!'}</h2>
            <p className="success-message-mobile">Procesando...</p>
          </div>
        </div>
      )}

      {/* Renderizado condicional: PaymentScreen o Formulario */}
      <AnimatePresence mode="wait">
        {showPaymentScreen ? (
          <motion.div
            key="payment-screen"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={transitions.normal}
            style={{ width: '100%', height: '100%' }}
          >
            <PaymentScreen
          services={cart.filter(item => item.type === 'service').flatMap(item => {
            const services = [];
            for (let i = 0; i < (item.quantity || 1); i++) {
              services.push({
                id: generateCartItemId(),
                serviceName: item.serviceName,
                price: item.price,
                icon: item.icon
              });
            }
            return services;
          })}
          products={cart.filter(item => item.type === 'product').map(item => ({
            id: item.id,
            name: item.name,
            salePrice: item.price,
            emoji: item.emoji,
            quantity: item.quantity
          }))}
          subtotal={subtotal}
          totalDiscount={totalDiscount}
          appliedPromotions={appliedPromotions}
          totalPrice={totalPrice}
          advancePayment={0}
          paymentMethod={formData.paymentMethod}
          onConfirm={handlePaymentConfirm}
          onCancel={handlePaymentCancel}
        />
          </motion.div>
      ) : (
          <motion.div
            key="order-form"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={transitions.normal}
            style={{ width: '100%', height: '100%' }}
          >
        <form className="order-form-mobile" onSubmit={handleSubmit}>
          <div className="form-mobile-content">
            {/* Información del Cliente */}
            <div className="form-section-mobile">
              <h3 className="section-title-mobile"><Icon name="user" size={20} /> Cliente</h3>

              <div className="form-group-mobile">
                <label className="form-label-mobile">
                  Nombre <span className="required">*</span>
                </label>
                <ClientAutocomplete
                  value={formData.client}
                  onChange={handleClientInputChange}
                  onSelect={handleSelectClient}
                  clients={clients}
                  className="input-mobile"
                  error={errors.client}
                  isValid={formData.clientId && formData.phone.length === 10}
                />
                {errors.client && <span className="error-message-mobile">{errors.client}</span>}
              </div>

              <div className="form-group-mobile">
                <label className="form-label-mobile">
                  Teléfono <span className="required">*</span>
                </label>
                <ValidatedPhoneInput
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(###) ###-####"
                  required={true}
                  error={errors.phone}
                  className="input-mobile"
                  clients={clients}
                  onSelectClient={handleSelectClientByPhone}
                  showAutocomplete={!formData.client}
                />
              </div>
            </div>

            {/* Servicios */}
            <div className="form-section-mobile">
              <div className="services-grid-mobile">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    className="service-btn-mobile"
                    onClick={() => handleAddToCart(service, 'service')}
                    title={`${service.name} - $${service.price}`}
                  >
                    <span className="service-icon-mobile"><Icon name={service.emoji || 'cleaning'} size={32} /></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Productos */}
            {products.length > 0 && (
              <div className="form-section-mobile">
                <div className="services-grid-mobile">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      className="service-btn-mobile"
                      onClick={() => handleAddToCart(product, 'product')}
                      title={`${product.name} - $${product.salePrice} (Stock: ${product.stock})`}
                    >
                      <span className="service-icon-mobile"><Icon name={product.emoji || 'package'} size={32} /></span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Carrito */}
            <div className="form-section-mobile cart-section-mobile">
              <div className="cart-header-mobile">
                <h3 className="section-title-mobile"><Icon name="cart" size={20} /> Carrito</h3>
                <span className="cart-count-mobile">{totalItems} items</span>
              </div>

              {errors.cart && <span className="error-message-mobile">{errors.cart}</span>}

              {/* Banner de promociones disponibles con funcionalidad de colapsar */}
              <CartPromotionsBanner
                activePromotions={activePromotions}
                appliedPromotions={appliedPromotions}
                promotionValidations={promotionValidations}
                isPromotionRelevantForCart={isPromotionRelevantForCart}
                cartItems={cart}
              />

              {cart.length === 0 ? (
                <div className="cart-empty-mobile">
                  <span className="empty-icon-mobile"><Icon name="cart" size={48} /></span>
                  <p>Agrega servicios o productos</p>
                </div>
              ) : (
                <div className="cart-items-mobile">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item-mobile">
                      <span className="cart-item-icon-mobile"><Icon name={item.icon} size={20} /></span>
                      <div className="cart-item-info-mobile">
                        <span className="cart-item-name-mobile">
                          {item.type === 'service' ? item.serviceName : item.name}
                        </span>
                        <span className="cart-item-price-mobile">
                          ${item.price} × {item.quantity} = ${item.price * item.quantity}
                        </span>
                        {/* Badge de promoción aplicada a este item */}
                        {(() => {
                          const assignedPromo = itemPromotionMap.get(item.id);
                          if (!assignedPromo) return null;
                          return (
                            <PromotionBadge
                              key={assignedPromo.id}
                              promotion={assignedPromo}
                              discountAmount={assignedPromo.discountAmount}
                            />
                          );
                        })()}
                      </div>
                      <button
                        type="button"
                        className="cart-item-remove-mobile"
                        onClick={() => handleRemoveFromCart(item.id)}
                      >
                        {item.quantity > 1 ? '−' : '✕'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Resumen del carrito con descuentos */}
              <div className="cart-total-mobile">
                {totalDiscount > 0 && (
                  <>
                    <div className="cart-subtotal-row">
                      <span>Subtotal:</span>
                      <span className='subtotal-value'>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="cart-discount-row">
                      <span>
                        Descuentos:
                      </span>
                      <span className="discount-value">-${totalDiscount.toFixed(2)}</span>
                    </div>
                  </>
                )}
                <div className="cart-total-row">
                  <span className='total-label'>Total:</span>
                  <strong className='total-value'>${totalPrice.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            {/* Asignación de Empleado */}
            {employees && employees.length > 0 && (
              <div className="form-section-mobile">
                <div className="employee-assignment-header-mobile">
                  <h3 className="section-title-mobile"><Icon name="user" size={20} /> Asignar a:</h3>
                  <span className="assignment-hint-mobile">(Opcional)</span>
                </div>
                <div className="employee-selection-grid-mobile">
                  {employees.map((emp) => {
                    const orderCount = allOrders ? Object.values(allOrders).filter(order =>
                      order.authorId === emp.id &&
                      order.status !== 'completed' &&
                      order.status !== 'cancelled'
                    ).length : 0;

                    return (
                      <button
                        key={emp.id}
                        type="button"
                        className={`employee-card-mobile ${selectedEmployee?.id === emp.id ? 'selected' : ''}`}
                        onClick={() => setSelectedEmployee(selectedEmployee?.id === emp.id ? null : emp)}
                        title={`${emp.name} - ${orderCount} órdenes activas`}
                      >
                        <span className="employee-emoji-mobile"><Icon name={emp.emoji || 'user'} size={32} /></span>
                        <span className="employee-order-count-mobile">{orderCount}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Fecha de Entrega */}
            <div className="form-section-mobile">
              <h3 className="section-title-mobile"><Icon name="calendar" size={20} /> Fecha de Entrega</h3>
              <div className="form-group-mobile">
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  className="input-mobile"
                  required
                />
                {errors.deliveryDate && <span className="error-message-mobile">{errors.deliveryDate}</span>}
              </div>
            </div>

            {/* Método de Pago */}
            <div className="form-section-mobile">
              <h3 className="section-title-mobile"><Icon name="credit-card" size={20} /> Método de Pago</h3>
              <div className="payment-methods-compact">
                <button
                  type="button"
                  className={`payment-method-btn ${formData.paymentMethod === 'cash' ? 'selected' : ''}`}
                  onClick={() => handleChange({ target: { name: 'paymentMethod', value: 'cash' } })}
                >
                  Efectivo
                </button>
                <button
                  type="button"
                  className={`payment-method-btn ${formData.paymentMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => handleChange({ target: { name: 'paymentMethod', value: 'card' } })}
                >
                  Tarjeta
                </button>
                <button
                  type="button"
                  className={`payment-method-btn ${formData.paymentMethod === 'transfer' ? 'selected' : ''}`}
                  onClick={() => handleChange({ target: { name: 'paymentMethod', value: 'transfer' } })}
                >
                  Transfer
                </button>
                <button
                  type="button"
                  className={`payment-method-btn ${formData.paymentMethod === 'pending' ? 'selected' : ''}`}
                  onClick={() => handleChange({ target: { name: 'paymentMethod', value: 'pending' } })}
                >
                  Pendiente
                </button>
              </div>
            </div>

            {/* Notas Generales */}
            <div className="form-section-mobile">
              <h3 className="section-title-mobile"><Icon name="notes" size={20} /> Notas Generales</h3>
              <textarea
                name="generalNotes"
                value={formData.generalNotes}
                onChange={handleChange}
                placeholder="Notas adicionales de la orden..."
                className="form-input form-textarea"
                rows={3}
              />
            </div>

            {/* Fotos */}
            <div className="form-section-mobile">
              <h3 className="section-title-mobile"><Icon name="camera" size={20} /> Fotos</h3>
              <ImageUpload
                images={orderImages}
                onImagesChange={setOrderImages}
                maxImages={10}
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="form-actions-mobile">
            <button
              type="button"
              className="btn-cancel-mobile"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-submit-mobile"
              disabled={cart.length === 0}
            >
              {initialData ? 'Actualizar Orden' : 'Crear Orden'}
            </button>
          </div>
        </form>
          </motion.div>
      )}
      </AnimatePresence>

      {/* Modal de Calendario */}
      {showCalendarModal && (
        <DeliveryCalendarModal
          onClose={() => setShowCalendarModal(false)}
          onSelectDate={(date) => {
            formData.deliveryDate = date;
            setShowCalendarModal(false);
          }}
        />
      )}
    </div>
  );
};

export default OrderFormMobile;
