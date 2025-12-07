import { useState, useMemo, useEffect } from 'react';
import ConfirmDialog from './ConfirmDialog';
import PaymentScreen from './PaymentScreen';
import VariablePriceModal from './VariablePriceModal';
import { getRelativeTimeWithHour } from '../utils/orders/orderHelpers';
import { checkAllItemsCompleted, getNextStatus, canMoveToStatus } from '../utils/orders/statusHelpers';
import { getServicesWithoutPrice } from '../utils/payments/paymentHelpers';
import { useAdminCheck } from '../contexts/AuthContext';

// Custom Hooks
import { useOrderDetail } from '../hooks/useOrderDetail';
import { useOrderActions } from '../hooks/useOrderActions';
import { useInvoiceManagement } from '../hooks/useInvoiceManagement';
import { usePaymentManagement } from '../hooks/usePaymentManagement';
import { useOrderStatusManagement } from '../hooks/useOrderStatusManagement';
import { useImageModal } from '../hooks/useImageModal';

// UI Components
import { OrderImages } from './orderDetail/OrderImages';
import { ServicesList } from './orderDetail/ServicesList';
import { ProductsList } from './orderDetail/ProductsList';
import { PaymentInfo } from './orderDetail/PaymentInfo';
import { DeliveryInfo } from './orderDetail/DeliveryInfo';
import { WhatsAppHistory } from './orderDetail/WhatsAppHistory';
import { OrderNotes } from './orderDetail/OrderNotes';
import { DeliverButton } from './orderDetail/DeliverButton';
import { OrderActions } from './orderDetail/OrderActions';
import { InvoicePreviewModal } from './orderDetail/InvoicePreviewModal';

import './OrderDetailView.css';

const OrderDetailView = ({
  order,
  currentTab,
  onClose,
  onSave,
  onCancel,
  onEmail,
  onWhatsApp,
  onEntregar,
  onBeforeClose,
  renderHeader,
  readOnly = false,
  employees = []
}) => {
  const isAdmin = useAdminCheck();

  // Determinar si la orden es de solo lectura
  const isReadOnly = readOnly || ['completados', 'cancelado'].includes(order.orderStatus);

  // ===== UI STATE =====
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [showVariablePriceModal, setShowVariablePriceModal] = useState(false);
  const [variablePriceServices, setVariablePriceServices] = useState([]);
  const [flippingServices, setFlippingServices] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'default'
  });

  // ===== CUSTOM HOOKS =====
  const {
    localServices,
    setLocalServices,
    localProducts,
    orderImages,
    setOrderImages,
    activeEmployees,
    orderAuthor,
    orderAuthorId,
    orderStatus,
    setOrderStatus,
    localDeliveryDate,
    setLocalDeliveryDate,
    generalNotes,
    setGeneralNotes,
    handleAuthorChange,
    latestOrderData
  } = useOrderDetail(order, currentTab, onSave, onBeforeClose, employees);

  const { isPrinting, handlePrint, handleWhatsApp } = useOrderActions(order);

  const {
    localInvoice,
    isPdfPreviewOpen,
    setIsPdfPreviewOpen,
    isGeneratingInvoice,
    handleGenerateInvoice,
    handleViewSavedInvoice,
    handleDownloadInvoice
  } = useInvoiceManagement(order);

  const {
    paymentData,
    setPaymentData,
    totalPrice,
    advancePayment,
    remainingPayment,
    isFullyPaid,
    hasServicesWithoutPrice,
    handleCobrar
  } = usePaymentManagement(order, localServices, confirmDialog, setConfirmDialog);

  // Hook para manejo de estado de orden
  const { handleOrderStatusChange: handleOrderStatusChangeFromHook } = useOrderStatusManagement(
    localServices,
    orderStatus,
    setOrderStatus
  );

  const { selectedImage, openImageModal, closeImageModal } = useImageModal();

  // ===== DERIVED CALCULATIONS =====
  const allItemsCompletedOrCancelled = useMemo(() => {
    return checkAllItemsCompleted(localServices);
  }, [localServices]);

  // Determinar si mostrar botón de Entregar/Cobrar (usar orderStatus local en lugar de currentTab)
  const showDeliverButton = orderStatus === 'enEntrega';

  // ===== HANDLERS =====
  // Cambiar estado de un servicio
  const handleServiceStatusChange = (serviceId, newStatus) => {
    const updatedServices = localServices.map(service =>
      service.id === serviceId ? { ...service, status: newStatus } : service
    );

    setLocalServices(updatedServices);
    // Cambios se guardarán al cerrar el modal
  };

  // Cambiar imágenes de la orden
  const handleOrderImagesChange = (newImages) => {
    setOrderImages(newImages);
    // Cambios se guardarán al cerrar el modal
  };

  // Handler para guardar la fecha de entrega
  const handleSaveDeliveryDate = (newDate) => {
    setLocalDeliveryDate(newDate);
    // Cambios se guardarán al cerrar el modal
  };

  // Handler para actualizar las notas generales
  const handleGeneralNotesChange = (e) => {
    setGeneralNotes(e.target.value);
    // Cambios se guardarán al cerrar el modal
  };

  // Función para ejecutar la entrega (extraída para reutilizar)
  const executeDelivery = (updatedOrderData = null) => {
    if (latestOrderData.current && onEntregar) {
      // Excluir campos temporales antes de pasar al padre
      const { currentStatus, ...cleanOrder } = order;

      // Construir objeto final con todos los cambios del ref
      const updatedOrder = {
        ...cleanOrder,
        ...latestOrderData.current,
        ...updatedOrderData // Incluir datos adicionales (como paymentStatus)
      };

      // Llamar a onEntregar del padre (Dashboard/Orders)
      // Este manejará la confirmación y marcará como completada
      onEntregar(updatedOrder);
    }
  };

  // Handler principal para entregar
  const handleEntregar = () => {
    // Si hay saldo pendiente, verificar primero precios variables
    if (!isFullyPaid) {
      // Detectar servicios con precio $0 (precio por definir)
      const servicesWithoutPrice = getServicesWithoutPrice(localServices);

      if (servicesWithoutPrice.length > 0) {
        // Hay servicios sin precio, mostrar modal para definirlos
        setVariablePriceServices(servicesWithoutPrice);
        setShowVariablePriceModal(true);
      } else {
        // No hay servicios sin precio, continuar a PaymentScreen
        setShowPaymentScreen(true);
      }
    } else {
      // Si ya está pagado, ejecutar entrega directamente
      executeDelivery();
    }
  };

  // Handler para cuando se confirma el cobro desde PaymentScreen
  const handlePaymentConfirm = async (paymentData) => {
    try {
      // Cerrar pantalla de cobro
      setShowPaymentScreen(false);

      // Actualizar orden con pago completo y ejecutar entrega
      executeDelivery({
        paymentStatus: 'paid',
        paymentMethod: paymentData.paymentMethod || order.paymentMethod
      });
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  // Handler para cancelar desde PaymentScreen
  const handlePaymentCancel = () => {
    setShowPaymentScreen(false);
  };

  // Handler para cuando se confirman los precios variables
  const handleVariablePricesConfirm = (assignedPrices) => {
    // Actualizar precios en los servicios locales
    const updatedServices = localServices.map(service => {
      if (assignedPrices[service.id]) {
        return {
          ...service,
          price: assignedPrices[service.id]
        };
      }
      return service;
    });

    setLocalServices(updatedServices);
    setShowVariablePriceModal(false);

    // El useEffect se encargará de actualizar latestOrderData.current con el nuevo totalPrice
    // automáticamente cuando localServices cambie

    // Continuar a PaymentScreen
    setShowPaymentScreen(true);
  };

  // Handler para cancelar desde VariablePriceModal
  const handleVariablePricesCancel = () => {
    setShowVariablePriceModal(false);
  };

  // Manejar click en servicio con animación flip
  const handleServiceClick = (serviceId, currentStatus) => {
    // Prevenir clicks durante animación
    if (flippingServices[serviceId]) return;

    const nextStatus = getNextStatus(currentStatus);

    // Activar animación flip
    setFlippingServices(prev => ({ ...prev, [serviceId]: true }));

    // Cambiar estado LOCAL cuando la carta es menos visible (400ms - justo en el keyframe 50%)
    setTimeout(() => {
      handleServiceStatusChange(serviceId, nextStatus);
    }, 400);

    // Desactivar animación después de 800ms (duración total de la animación CSS)
    setTimeout(() => {
      setFlippingServices(prev => ({ ...prev, [serviceId]: false }));
    }, 800);
  };

  // Llamar a renderHeader si existe, pasándole la info necesaria
  useEffect(() => {
    if (renderHeader) {
      renderHeader({
        orderNumber: parseInt(order.orderNumber, 10),
        client: order.client,
        createdAt: getRelativeTimeWithHour(order.createdAt),
        author: orderAuthor,
        authorId: orderAuthorId,
        activeEmployees: activeEmployees,
        onAuthorChange: handleAuthorChange,
        isReadOnly: isReadOnly
      });
    }
  }, [renderHeader, order.orderNumber, order.client, order.createdAt, orderAuthor, orderAuthorId, activeEmployees, isReadOnly, handleAuthorChange]);

  return (
    <div className="order-detail-view">
      {/* Modal de Precios Variables */}
      {showVariablePriceModal && (
        <VariablePriceModal
          services={variablePriceServices}
          onConfirm={handleVariablePricesConfirm}
          onCancel={handleVariablePricesCancel}
        />
      )}

      {/* Contenedor de flip global */}
      <div className={`order-detail-flip-container ${showPaymentScreen ? 'flipped' : ''}`}>
        {/* Front - Vista normal */}
        <div className="order-detail-flip-front">
          {/* Mensaje de Solo Lectura */}
          {isReadOnly && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.3)',
              borderRadius: '10px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <span style={{ color: '#fbbf24', fontWeight: 600, fontSize: '14px' }}>
                {order.orderStatus === 'completados'
                  ? 'Esta orden está completada y no puede editarse'
                  : order.orderStatus === 'cancelado'
                  ? 'Esta orden está cancelada y no puede editarse'
                  : 'Esta orden no puede editarse'}
              </span>
            </div>
          )}

          {/* Galería de Imágenes de la Orden */}
          <OrderImages
            images={orderImages}
            onChange={handleOrderImagesChange}
            isReadOnly={isReadOnly}
          />

          {/* Información de Servicios */}
          <ServicesList
            services={localServices}
            flippingServices={flippingServices}
            onServiceClick={handleServiceClick}
            isReadOnly={isReadOnly}
          />

          {/* Información de Productos */}
          <ProductsList products={localProducts} />

          {/* Información de Pago y Entrega */}
          <div className="order-details-grid">
            <PaymentInfo
              order={order}
              totalPrice={totalPrice}
              advancePayment={advancePayment}
              remainingPayment={remainingPayment}
              paymentMethod={paymentData.paymentMethod}
              isFullyPaid={isFullyPaid}
              paymentStatus={paymentData.paymentStatus}
            />

            <DeliveryInfo
              localDeliveryDate={localDeliveryDate}
              orderStatus={orderStatus}
              allItemsCompletedOrCancelled={allItemsCompletedOrCancelled}
              onDeliveryDateChange={handleSaveDeliveryDate}
              onOrderStatusChange={handleOrderStatusChangeFromHook}
              isReadOnly={isReadOnly}
            />
          </div>

          {/* Historial de Notificaciones de WhatsApp */}
          <WhatsAppHistory whatsappNotifications={order.whatsappNotifications} />

          {/* Notas Generales */}
          <OrderNotes
            generalNotes={generalNotes}
            onChange={handleGeneralNotesChange}
            isReadOnly={isReadOnly}
          />

          {/* Botones de Cierre de Orden */}
          <DeliverButton
            showDeliverButton={showDeliverButton}
            isReadOnly={isReadOnly}
            isFullyPaid={isFullyPaid}
            remainingPayment={remainingPayment}
            onEntregar={handleEntregar}
          />

          {/* Botones de Acción */}
          <OrderActions
            order={order}
            isPrinting={isPrinting}
            isGeneratingInvoice={isGeneratingInvoice}
            localInvoice={localInvoice}
            onPrint={handlePrint}
            onGenerateInvoice={handleGenerateInvoice}
            onViewSavedInvoice={handleViewSavedInvoice}
            onDownloadInvoice={handleDownloadInvoice}
            isReadOnly={isReadOnly}
          />

          {/* Botón de Cancelar Orden (solo admin) */}
          {!isReadOnly && isAdmin && (
            <div className="order-actions-footer">
              <div className="action-buttons-grid">
                <button
                  className="action-btn btn-cancel"
                  onClick={() => onCancel && onCancel(order)}
                >
                  <span className="action-icon">🗑️</span>
                  <span className="action-text">Cancelar Orden</span>
                </button>
              </div>
            </div>
          )}

          {/* Modal de Imagen */}
          {selectedImage && (
            <div className="image-modal" onClick={closeImageModal}>
              <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="image-modal-close" onClick={closeImageModal}>
                  ✕
                </button>
                <img src={selectedImage} alt="Vista ampliada" className="image-modal-img" />
              </div>
            </div>
          )}

          {/* Confirm Dialog */}
          <ConfirmDialog
            isOpen={confirmDialog.isOpen}
            title={confirmDialog.title}
            message={confirmDialog.message}
            type={confirmDialog.type}
            onConfirm={confirmDialog.onConfirm}
            onCancel={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
          />
        </div>

        {/* Back - Payment Screen */}
        <div className="order-detail-flip-back">
          <PaymentScreen
            services={localServices}
            products={localProducts}
            subtotal={order.subtotal || totalPrice}
            totalDiscount={order.totalDiscount || 0}
            appliedPromotions={order.appliedPromotions || []}
            totalPrice={totalPrice}
            advancePayment={paymentData.advancePayment}
            paymentMethod={paymentData.paymentMethod}
            allowEditMethod={true}
            orderStatus={orderStatus}
            onConfirm={handlePaymentConfirm}
            onCancel={handlePaymentCancel}
          />
        </div>
      </div>

      {/* Modal de Preview de Factura */}
      <InvoicePreviewModal
        isOpen={isPdfPreviewOpen}
        invoiceData={localInvoice}
        onClose={() => setIsPdfPreviewOpen(false)}
      />
    </div>
  );
};

export default OrderDetailView;
