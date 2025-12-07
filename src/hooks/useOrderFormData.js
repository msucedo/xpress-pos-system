import { useState, useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';

/**
 * Hook para manejar el estado del formulario de orden y validaciones
 *
 * @param {Object} initialData - Datos iniciales (para edición)
 * @returns {Object} - { formData, errors, handleChange, handleClientInputChange, handleSelectClient, validateBasicForm, validateForm, setFormData, setErrors }
 */
export function useOrderFormData(initialData = null) {
  const { showValidationErrors } = useNotification();

  const [formData, setFormData] = useState({
    client: '',
    clientId: null,
    phone: '',
    email: '',
    deliveryDate: '',
    paymentMethod: 'pending',
    advancePayment: '',
    generalNotes: ''
  });

  const [errors, setErrors] = useState({});

  // Cargar datos iniciales (para editar órdenes existentes)
  useEffect(() => {
    if (initialData) {
      setFormData({
        client: initialData.client || initialData.clientName || '',
        clientId: initialData.clientId || null,
        phone: initialData.phone || '',
        email: initialData.email || '',
        deliveryDate: initialData.deliveryDate || '',
        paymentMethod: initialData.paymentMethod || 'pending',
        advancePayment: initialData.advancePayment || '',
        generalNotes: initialData.generalNotes || ''
      });
    }
  }, [initialData]);

  // Handler genérico para cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handler para input de cliente (autocomplete)
  const handleClientInputChange = (e) => {
    setFormData(prev => ({ ...prev, client: e.target.value }));
    if (errors.client) {
      setErrors(prev => ({ ...prev, client: '' }));
    }
  };

  // Handler para seleccionar un cliente del autocomplete
  const handleSelectClient = (client) => {
    setFormData(prev => ({
      ...prev,
      client: client.name,
      clientId: client.id,
      phone: client.phone,
      email: client.email || ''
    }));
    setErrors(prev => ({ ...prev, client: '', phone: '' }));
  };

  // Validar datos básicos antes de ir a cobrar
  const validateBasicForm = (cart) => {
    const newErrors = {};

    if (!formData.client.trim()) {
      newErrors.client = 'El nombre del cliente es requerido';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'El teléfono debe tener exactamente 10 dígitos';
    }
    if (cart.length === 0) {
      newErrors.cart = 'Debe agregar al menos un servicio al carrito';
    }

    setErrors(newErrors);

    // Mostrar banner de validación si hay errores
    if (Object.keys(newErrors).length > 0) {
      showValidationErrors(newErrors);
    }

    return Object.keys(newErrors).length === 0;
  };

  // Validar formulario completo antes de enviar
  const validateForm = () => {
    const newErrors = {};

    if (!formData.deliveryDate) {
      newErrors.deliveryDate = 'La fecha de entrega es requerida';
    }

    setErrors(newErrors);

    // Mostrar banner de validación si hay errores
    if (Object.keys(newErrors).length > 0) {
      showValidationErrors(newErrors);
    }

    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    errors,
    handleChange,
    handleClientInputChange,
    handleSelectClient,
    validateBasicForm,
    validateForm,
    setFormData,
    setErrors
  };
}
