import { useState, useRef, useEffect, useCallback } from 'react';
import { autoCompleteExpressServices } from '../utils/orders/statusHelpers';
import { detectChanges } from '../utils/orders/orderHelpers';
import { updateOrder } from '../services/firebaseService';

/**
 * Hook para manejar el estado y datos de una orden en detalle
 *
 * @param {Object} order - Orden completa
 * @param {string} currentTab - Tab actual donde se abre la orden
 * @param {Function} onSave - Callback para guardar cambios
 * @param {Function} onBeforeClose - Callback que se ejecuta antes de cerrar
 * @param {Array} employees - Lista de empleados activos
 * @returns {Object} Estados y funciones para manejar la orden
 */
export function useOrderDetail(order, currentTab, onSave, onBeforeClose, employees = []) {
  // Estados de la orden
  const [localServices, setLocalServices] = useState(() => {
    // Marcar automáticamente servicios "Servicio Express" como completados
    return autoCompleteExpressServices(order.services || []);
  });

  const [localProducts, setLocalProducts] = useState(order.products || []);
  const [orderImages, setOrderImages] = useState(order.orderImages || []);
  const [activeEmployees, setActiveEmployees] = useState(employees);
  const [orderAuthor, setOrderAuthor] = useState(order.author || '');
  const [orderAuthorId, setOrderAuthorId] = useState(order.authorId || null);
  const [orderStatus, setOrderStatus] = useState(order.orderStatus || currentTab || 'recibidos');
  const [localDeliveryDate, setLocalDeliveryDate] = useState(order.deliveryDate);
  const [generalNotes, setGeneralNotes] = useState(order.generalNotes || '');

  // Ref para mantener datos actualizados sin disparar cleanup
  const latestOrderData = useRef();

  // Ref para guardar valores iniciales y detectar cambios
  const initialData = useRef({
    services: order.services || [],
    products: order.products || [],
    orderImages: order.orderImages || [],
    orderStatus: order.orderStatus || currentTab || 'recibidos',
    deliveryDate: order.deliveryDate,
    generalNotes: order.generalNotes || '',
    authorId: order.authorId || null,
    author: order.author || '',
    totalPrice: order.totalPrice || 0
  });

  // Actualizar empleados activos cuando cambien las props
  useEffect(() => {
    setActiveEmployees(employees);
  }, [employees]);

  // Actualizar ref cada vez que cambien los estados locales
  useEffect(() => {
    latestOrderData.current = {
      services: localServices,
      products: localProducts,
      orderImages: orderImages,
      orderStatus: orderStatus,
      deliveryDate: localDeliveryDate,
      generalNotes: generalNotes,
      authorId: orderAuthorId,
      author: orderAuthor,
      totalPrice: order.totalPrice || 0
    };
  }, [localServices, localProducts, orderImages, orderStatus, localDeliveryDate, generalNotes, orderAuthor, orderAuthorId, order.totalPrice]);

  // Marcar mensajes de WhatsApp como leídos al abrir la orden
  useEffect(() => {
    const markAsRead = async () => {
      if (order.hasUnreadMessages === true) {
        try {
          await updateOrder(order.id, {
            hasUnreadMessages: false
          });
          console.log('✅ Mensajes de WhatsApp marcados como leídos');
        } catch (error) {
          console.error('❌ Error marcando mensajes como leídos:', error);
        }
      }
    };

    markAsRead();
  }, [order.id]);

  // Función que se ejecuta antes de cerrar el modal
  const handleBeforeClose = useCallback(() => {
    console.log('🔍 [1] handleBeforeClose ejecutado');

    if (!latestOrderData.current || !onSave) {
      console.log('⚠️ [2] No hay datos o no hay onSave', {
        hasLatestData: !!latestOrderData.current,
        hasOnSave: !!onSave
      });
      return;
    }

    const current = latestOrderData.current;
    const initial = initialData.current;

    console.log('📊 [3] Comparando datos:', {
      current,
      initial,
      currentJSON: JSON.stringify(current),
      initialJSON: JSON.stringify(initial)
    });

    // Detectar cambios comparando datos actuales vs iniciales
    const changed = detectChanges(current, initial);

    console.log('🔄 [4] ¿Hay cambios?', changed);

    // Solo guardar si hay cambios reales
    if (changed) {
      // Excluir campos temporales que no deben guardarse en Firebase
      const { currentStatus, ...cleanOrder } = order;

      const updatedOrder = {
        ...cleanOrder,
        ...latestOrderData.current
      };
      console.log('💾 [5] Llamando onSave con:', updatedOrder);
      onSave(updatedOrder);
    } else {
      console.log('⏭️ [6] No hay cambios, saltando guardado');
    }
  }, [order, onSave]);

  // Pasar handleBeforeClose al padre vía callback
  useEffect(() => {
    console.log('🔄 [EFFECT] Pasando handleBeforeClose al parent');
    if (typeof onBeforeClose === 'function') {
      onBeforeClose(handleBeforeClose);
    }
    // IMPORTANTE: Array vacío [] porque solo necesitamos "registrar" la función UNA VEZ al montar
    // NO incluir onBeforeClose ni handleBeforeClose en dependencias para evitar loop infinito
    // handleBeforeClose usa useCallback y refs, por lo que siempre tendrá valores actuales
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler para cambiar el autor de la orden
  const handleAuthorChange = useCallback((e) => {
    const selectedEmployeeId = e.target.value;

    if (!selectedEmployeeId || selectedEmployeeId === '') {
      setOrderAuthorId(null);
      setOrderAuthor('');
    } else {
      const selectedEmployee = activeEmployees.find(emp => emp.id === selectedEmployeeId);

      if (selectedEmployee) {
        setOrderAuthorId(selectedEmployee.id);
        setOrderAuthor(selectedEmployee.name);
      }
    }
  }, [activeEmployees]);

  return {
    // Estados
    localServices,
    setLocalServices,
    localProducts,
    setLocalProducts,
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

    // Handlers
    handleAuthorChange,
    handleBeforeClose,

    // Refs
    latestOrderData
  };
}
