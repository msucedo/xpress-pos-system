import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { transitions } from '../animations';
import PaymentScreen from './PaymentScreen';
import VariablePriceModal from './VariablePriceModal';
import DeliveryCalendarModal from './DeliveryCalendarModal';
import { useAuth } from '../hooks/useAuth';
import { CustomerInfoSection } from './orders/CustomerInfoSection';
import { ServiceSelector } from './orders/ServiceSelector';
import { ProductSelector } from './orders/ProductSelector';
import { CartSummary } from './orders/CartSummary';
import { PaymentSection } from './orders/PaymentSection';
import { PhotoUploadSection } from './orders/PhotoUploadSection';
import { useOrderFormData } from '../hooks/useOrderFormData';
import { useCartManagement } from '../hooks/useCartManagement';
import { usePromotionsCalculation } from '../hooks/usePromotionsCalculation';
import { useEmployeeAssignment } from '../hooks/useEmployeeAssignment';
import { useOrderImages } from '../hooks/useOrderImages';
import { getPromotionPriority, getItemsWithPromoBadge, isPromotionRelevantForCart } from '../utils/promotions/promotionHelpers';
import { calculateSubtotal, calculateTotalDiscount, calculateTotalPrice } from '../utils/promotions/promotionCalculations';
import { generateCartItemId, expandServicesForOrder, transformProductsForOrder, hasExpressService } from '../utils/cart/cartHelpers';
import './OrderForm.css';

const OrderForm = ({ onSubmit, onCancel, initialData = null, employees = [], allOrders = {} }) => {
  const { employee } = useAuth();

  // Custom Hooks
  const { formData, errors, handleChange, handleClientInputChange, handleSelectClient, handleSelectClientByPhone, validateBasicForm, validateForm, setFormData, setErrors } = useOrderFormData(initialData);
  const { cart, setCart, handleAddToCart: addToCartFromHook, handleRemoveFromCart } = useCartManagement(initialData);
  const { orderImages, setOrderImages } = useOrderImages();
  const { selectedEmployee, setSelectedEmployee } = useEmployeeAssignment(employees, allOrders);

  // Wrapper para limpiar error de carrito al agregar items
  const handleAddToCart = (item, type = 'service') => {
    addToCartFromHook(item, type);
    // Limpiar error de carrito vacío si existe
    if (errors.cart) {
      setErrors(prev => ({ ...prev, cart: '' }));
    }
  };

  // Estado local de UI
  const [showMenu, setShowMenu] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [showVariablePriceModal, setShowVariablePriceModal] = useState(false);
  const [variablePriceServices, setVariablePriceServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [requireFullPayment, setRequireFullPayment] = useState(false);

  // Cargar servicios, productos y clientes desde Firebase
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [activePromotions, setActivePromotions] = useState([]);
  const [clients, setClients] = useState([]);

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

  // Hook de promociones
  const { appliedPromotions, promotionValidations } = usePromotionsCalculation(cart, formData.phone, activePromotions);

  // Auto-calcular fecha de entrega al seleccionar un servicio
  useEffect(() => {
    if (cart.length > 0 && !formData.deliveryDate) {
      const serviceItems = cart.filter(item => item.type === 'service');

      if (serviceItems.length > 0) {
        const maxDays = Math.max(...serviceItems.map(item => item.daysToAdd || 2));
        const today = new Date();
        today.setDate(today.getDate() + maxDays);
        setFormData(prev => ({
          ...prev,
          deliveryDate: today.toISOString().split('T')[0]
        }));
      }
    }
  }, [cart, formData.deliveryDate]);

  // Listener para cerrar con tecla ESC (lógica jerárquica)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        // Cerrar en orden de prioridad: modal > payment screen > payment view > sidebar
        if (showCalendarModal) {
          setShowCalendarModal(false);
        } else if (showPaymentScreen) {
          setShowPaymentScreen(false);
        } else if (showPayment) {
          setShowPayment(false);
        } else {
          onCancel();
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showCalendarModal, showPaymentScreen, showPayment, onCancel]);

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

  // Calcular valores
  const subtotal = calculateSubtotal(cart);
  const totalDiscount = calculateTotalDiscount(appliedPromotions);
  const totalPrice = calculateTotalPrice(cart, appliedPromotions);

  // Handler para mostrar la vista de pago
  const handleShowPayment = () => {
    if (validateBasicForm(cart)) {
      const serviceItems = cart.filter(item => item.type === 'service');
      const hasServices = serviceItems.length > 0;

      if (!hasServices && !formData.deliveryDate) {
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({ ...prev, deliveryDate: today }));
      }

      setShowPayment(true);
    }
  };

  // Handler para enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const serviceItems = cart.filter(item => item.type === 'service');
      const hasServices = serviceItems.length > 0;

      if (!hasServices) {
        if (formData.paymentMethod === 'pending') {
          alert('⚠️ Las órdenes sin servicios deben tener un método de pago definido.\n\nPor favor selecciona: Efectivo, Tarjeta o Transferencia.');
          setErrors({ payment: 'Las órdenes sin servicios deben tener un método de pago definido. Selecciona efectivo, tarjeta o transferencia.' });
          return;
        }
        setRequireFullPayment(true);
        setShowPaymentScreen(true);
        return;
      }

      if (formData.paymentMethod !== 'pending') {
        const servicesWithoutPrice = serviceItems.filter(item => item.price === 0);
        if (servicesWithoutPrice.length > 0) {
          setVariablePriceServices(servicesWithoutPrice);
          setShowVariablePriceModal(true);
        } else {
          setRequireFullPayment(false);
          setShowPaymentScreen(true);
        }
      } else {
        createOrder();
      }
    }
  };

  // Función para crear la orden
  const createOrder = async (paymentStatus = null, advancePayment = 0, isOrderWithoutServices = false) => {
    setIsSubmitting(true);

    const services = expandServicesForOrder(cart);
    const products = transformProductsForOrder(cart);

    const orderData = {
      ...formData,
      clientId: formData.clientId,
      clientName: formData.client,
      services,
      products,
      orderImages: orderImages,
      subtotal: subtotal,
      totalDiscount: totalDiscount,
      totalPrice: totalPrice,
      appliedPromotions: appliedPromotions.map(promo => ({
        id: promo.id,
        name: promo.name,
        type: promo.type,
        discountAmount: promo.discountAmount
      })),
      advancePayment: advancePayment,
      paymentStatus: paymentStatus || (formData.paymentMethod === 'pending' ? 'pending' : 'partial'),
      priority: hasExpressService(cart) ? 'high' : 'normal',
      author: selectedEmployee ? selectedEmployee.name : '',
      authorId: selectedEmployee ? selectedEmployee.id : null,
      orderCreatedBy: employee ? { id: employee.id, name: employee.name } : null,
      isOrderWithoutServices: isOrderWithoutServices
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

    setTimeout(() => {
      onSubmit(orderData);
    }, 1500);
  };

  // Handlers para PaymentScreen
  const handlePaymentConfirm = (paymentData) => {
    setShowPaymentScreen(false);
    createOrder(paymentData.paymentStatus, paymentData.advancePayment, paymentData.isOrderWithoutServices || false);
  };

  const handlePaymentCancel = () => {
    setShowPaymentScreen(false);
  };

  // Handlers para VariablePriceModal
  const handleVariablePricesConfirm = (assignedPrices) => {
    const updatedCart = cart.map(item => {
      if (item.type === 'service' && assignedPrices[item.id]) {
        return { ...item, price: assignedPrices[item.id] };
      }
      return item;
    });
    setCart(updatedCart);
    setShowVariablePriceModal(false);
    setShowPaymentScreen(true);
  };

  const handleVariablePricesCancel = () => {
    setShowVariablePriceModal(false);
  };

  // Handler para menú de acciones
  const handleMenuAction = (action) => {
    setShowMenu(false);
    switch(action) {
      case 'invoice':
        alert('Generar factura para ' + formData.client);
        break;
      case 'email':
        alert('Enviar correo a ' + formData.client + '\nSe seleccionará la plantilla según la etapa de la orden');
        break;
      case 'contact':
        const phone = formData.phone.replace(/\D/g, '');
        window.open(`https://wa.me/${phone}`, '_blank');
        break;
      case 'delete':
        if (confirm('¿Estás seguro de eliminar esta orden?')) {
          alert('Orden eliminada');
          onCancel();
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="order-form-container">
      {/* Animación de Éxito */}
      {isSubmitting && (
        <div className="success-overlay">
          <div className="success-animation">
            <div className="success-checkmark">
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
            <h2 className="success-title">{initialData ? '¡Orden Actualizada!' : '¡Orden Creada!'}</h2>
            <p className="success-message">Procesando...</p>
          </div>
        </div>
      )}

      {/* Menu Button (only show when editing) */}
      {initialData && (
        <div className="order-menu-container">
          <button className="order-menu-button" onClick={() => setShowMenu(!showMenu)} type="button">
            ⋮
          </button>
          {showMenu && (
            <div className="order-menu-dropdown">
              <button className="menu-item menu-invoice" onClick={() => handleMenuAction('invoice')} type="button">
                <span className="menu-icon">🧾</span>
                <span className="menu-text">Generar Factura</span>
              </button>
              <button className="menu-item menu-email" onClick={() => handleMenuAction('email')} type="button">
                <span className="menu-icon">📧</span>
                <span className="menu-text">Enviar Correo</span>
              </button>
              <button className="menu-item menu-contact" onClick={() => handleMenuAction('contact')} type="button">
                <span className="menu-icon">💬</span>
                <span className="menu-text">Contactar WhatsApp</span>
              </button>
              <button className="menu-item menu-delete" onClick={() => handleMenuAction('delete')} type="button">
                <span className="menu-icon">🗑️</span>
                <span className="menu-text">Eliminar Orden</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal de Precios Variables */}
      {showVariablePriceModal && (
        <VariablePriceModal
          services={variablePriceServices}
          onConfirm={handleVariablePricesConfirm}
          onCancel={handleVariablePricesCancel}
        />
      )}

      {/* Modal de Calendario de Entregas */}
      <DeliveryCalendarModal
        isOpen={showCalendarModal}
        onClose={() => setShowCalendarModal(false)}
        allOrders={allOrders}
      />

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
          requireFullPayment={requireFullPayment}
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
            <div className="order-form-layout">
          {/* Lado Izquierdo - Formulario con Flip */}
          <div className="order-form-left">
            <div className={`left-flip-container ${showPayment ? 'flipped' : ''}`}>
              {/* Frente - Información del Cliente y Servicios */}
              <div className="left-flip-front">
                <CustomerInfoSection
                  formData={formData}
                  errors={errors}
                  clients={clients}
                  onClientChange={handleClientInputChange}
                  onSelectClient={handleSelectClient}
                  onSelectClientByPhone={handleSelectClientByPhone}
                  onPhoneChange={handleChange}
                />

                <ServiceSelector
                  services={services}
                  onAddToCart={handleAddToCart}
                />

                <ProductSelector
                  products={products}
                  onAddToCart={handleAddToCart}
                />
                {errors.cart && <span className="error-message">{errors.cart}</span>}
              </div>

              {/* Reverso - Subir Fotos */}
              <PhotoUploadSection
                images={orderImages}
                onChange={setOrderImages}
              />
            </div>
          </div>

          {/* Lado Derecho - Carrito con Flip */}
          <div className="order-cart-sidebar">
            <div className={`cart-flip-container ${showPayment ? 'flipped' : ''}`}>
              {/* Frente - Carrito */}
              <CartSummary
                cart={cart}
                onRemoveFromCart={handleRemoveFromCart}
                appliedPromotions={appliedPromotions}
                promotionValidations={promotionValidations}
                activePromotions={activePromotions}
                itemPromotionMap={itemPromotionMap}
                subtotal={subtotal}
                totalDiscount={totalDiscount}
                totalPrice={totalPrice}
                employees={employees}
                selectedEmployee={selectedEmployee}
                onSelectEmployee={setSelectedEmployee}
                allOrders={allOrders}
                onCancel={onCancel}
                onShowPayment={handleShowPayment}
                isPromotionRelevantForCart={isPromotionRelevantForCart}
              />

              {/* Reverso - Pago */}
              <PaymentSection
                formData={formData}
                errors={errors}
                totalPrice={totalPrice}
                onChange={handleChange}
                onBack={() => setShowPayment(false)}
                onSubmit={handleSubmit}
                onShowCalendar={() => setShowCalendarModal(true)}
                isEditing={!!initialData}
              />
            </div>
          </div>
        </div>
          </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default OrderForm;
