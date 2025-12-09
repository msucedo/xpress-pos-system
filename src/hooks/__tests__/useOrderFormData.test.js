import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOrderFormData } from '../useOrderFormData';
import * as NotificationContext from '../../contexts/NotificationContext';

// Mock NotificationContext
vi.mock('../../contexts/NotificationContext', () => ({
  useNotification: vi.fn()
}));

describe('useOrderFormData', () => {
  let mockShowValidationErrors;

  beforeEach(() => {
    mockShowValidationErrors = vi.fn();
    NotificationContext.useNotification.mockReturnValue({
      showValidationErrors: mockShowValidationErrors
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ✅ Estado inicial
  describe('initial state', () => {
    it('should initialize with default form data', () => {
      const { result } = renderHook(() => useOrderFormData());

      expect(result.current.formData).toEqual({
        client: '',
        clientId: null,
        phone: '',
        email: '',
        deliveryDate: '',
        paymentMethod: 'pending',
        advancePayment: '',
        generalNotes: ''
      });
    });

    it('should initialize with empty errors', () => {
      const { result } = renderHook(() => useOrderFormData());

      expect(result.current.errors).toEqual({});
    });

    it('should provide all required functions', () => {
      const { result } = renderHook(() => useOrderFormData());

      expect(typeof result.current.handleChange).toBe('function');
      expect(typeof result.current.handleClientInputChange).toBe('function');
      expect(typeof result.current.handleSelectClient).toBe('function');
      expect(typeof result.current.validateBasicForm).toBe('function');
      expect(typeof result.current.validateForm).toBe('function');
      expect(typeof result.current.setFormData).toBe('function');
      expect(typeof result.current.setErrors).toBe('function');
    });
  });

  // ✅ Caso básico - load initial data (edit mode)
  describe('when initialData is provided', () => {
    it('should load initialData into formData', () => {
      const initialData = {
        client: 'John Doe',
        clientId: 'client123',
        phone: '1234567890',
        email: 'john@example.com',
        deliveryDate: '2024-12-25',
        paymentMethod: 'cash',
        advancePayment: '500',
        generalNotes: 'Test notes'
      };

      const { result } = renderHook(() => useOrderFormData(initialData));

      expect(result.current.formData).toEqual(initialData);
    });

    it('should use clientName if client field missing', () => {
      const initialData = {
        clientName: 'Jane Smith',
        phone: '0987654321'
      };

      const { result } = renderHook(() => useOrderFormData(initialData));

      expect(result.current.formData.client).toBe('Jane Smith');
    });

    it('should handle partial initialData', () => {
      const initialData = {
        client: 'John Doe',
        phone: '1234567890'
      };

      const { result } = renderHook(() => useOrderFormData(initialData));

      expect(result.current.formData.client).toBe('John Doe');
      expect(result.current.formData.phone).toBe('1234567890');
      expect(result.current.formData.email).toBe('');
      expect(result.current.formData.paymentMethod).toBe('pending');
    });
  });

  // ✅ Efectos secundarios - dependencies
  describe('useEffect dependencies', () => {
    it('should update formData when initialData changes', () => {
      const initialData1 = { client: 'John Doe' };

      const { result, rerender } = renderHook(
        ({ data }) => useOrderFormData(data),
        { initialProps: { data: initialData1 } }
      );

      expect(result.current.formData.client).toBe('John Doe');

      const initialData2 = { client: 'Jane Smith' };

      act(() => {
        rerender({ data: initialData2 });
      });

      expect(result.current.formData.client).toBe('Jane Smith');
    });
  });

  // ✅ Actualización de estado - handleChange
  describe('handleChange', () => {
    it('should update formData on input change', () => {
      const { result } = renderHook(() => useOrderFormData());

      act(() => {
        result.current.handleChange({
          target: { name: 'client', value: 'John Doe' }
        });
      });

      expect(result.current.formData.client).toBe('John Doe');
    });

    it('should clear error for changed field', () => {
      const { result } = renderHook(() => useOrderFormData());

      // Set error
      act(() => {
        result.current.setErrors({ client: 'Client is required' });
      });

      expect(result.current.errors.client).toBe('Client is required');

      // Change field
      act(() => {
        result.current.handleChange({
          target: { name: 'client', value: 'John Doe' }
        });
      });

      expect(result.current.errors.client).toBe('');
    });

    it('should not clear errors for other fields', () => {
      const { result } = renderHook(() => useOrderFormData());

      // Set multiple errors
      act(() => {
        result.current.setErrors({
          client: 'Client is required',
          phone: 'Phone is required'
        });
      });

      // Change only client field
      act(() => {
        result.current.handleChange({
          target: { name: 'client', value: 'John Doe' }
        });
      });

      expect(result.current.errors.client).toBe('');
      expect(result.current.errors.phone).toBe('Phone is required');
    });

    it('should handle multiple field updates', () => {
      const { result } = renderHook(() => useOrderFormData());

      act(() => {
        result.current.handleChange({
          target: { name: 'client', value: 'John Doe' }
        });
      });

      act(() => {
        result.current.handleChange({
          target: { name: 'phone', value: '1234567890' }
        });
      });

      expect(result.current.formData.client).toBe('John Doe');
      expect(result.current.formData.phone).toBe('1234567890');
    });
  });

  // ✅ Actualización de estado - handleClientInputChange
  describe('handleClientInputChange', () => {
    it('should update client field', () => {
      const { result } = renderHook(() => useOrderFormData());

      act(() => {
        result.current.handleClientInputChange({
          target: { value: 'John Doe' }
        });
      });

      expect(result.current.formData.client).toBe('John Doe');
    });

    it('should NOT clear clientId when client input changes', () => {
      const { result } = renderHook(() => useOrderFormData());

      // Set client with ID
      act(() => {
        result.current.setFormData({
          ...result.current.formData,
          client: 'John Doe',
          clientId: 'client123'
        });
      });

      expect(result.current.formData.clientId).toBe('client123');

      // Change client manually
      act(() => {
        result.current.handleClientInputChange({
          target: { value: 'Jane Smith' }
        });
      });

      expect(result.current.formData.client).toBe('Jane Smith');
      // clientId should remain unchanged
      expect(result.current.formData.clientId).toBe('client123');
    });

    it('should clear client error', () => {
      const { result } = renderHook(() => useOrderFormData());

      act(() => {
        result.current.setErrors({ client: 'Client is required' });
      });

      act(() => {
        result.current.handleClientInputChange({
          target: { value: 'John Doe' }
        });
      });

      expect(result.current.errors.client).toBe('');
    });
  });

  // ✅ Actualización de estado - handleSelectClient
  describe('handleSelectClient', () => {
    it('should update client data when client selected', () => {
      const { result } = renderHook(() => useOrderFormData());

      const selectedClient = {
        id: 'client123',
        name: 'John Doe',
        phone: '1234567890',
        email: 'john@example.com'
      };

      act(() => {
        result.current.handleSelectClient(selectedClient);
      });

      expect(result.current.formData.client).toBe('John Doe');
      expect(result.current.formData.clientId).toBe('client123');
      expect(result.current.formData.phone).toBe('1234567890');
      expect(result.current.formData.email).toBe('john@example.com');
    });

    it('should handle client with missing phone/email', () => {
      const { result } = renderHook(() => useOrderFormData());

      const selectedClient = {
        id: 'client123',
        name: 'John Doe'
        // phone and email are missing
      };

      act(() => {
        result.current.handleSelectClient(selectedClient);
      });

      expect(result.current.formData.client).toBe('John Doe');
      expect(result.current.formData.clientId).toBe('client123');
      expect(result.current.formData.phone).toBeUndefined();
      expect(result.current.formData.email).toBe('');
    });

    it('should clear client error', () => {
      const { result } = renderHook(() => useOrderFormData());

      act(() => {
        result.current.setErrors({ client: 'Client is required' });
      });

      const selectedClient = {
        id: 'client123',
        name: 'John Doe'
      };

      act(() => {
        result.current.handleSelectClient(selectedClient);
      });

      expect(result.current.errors.client).toBe('');
    });
  });

  // ✅ Casos de validación - validateBasicForm
  describe('validateBasicForm', () => {
    it('should return true when all required fields are provided', () => {
      const { result } = renderHook(() => useOrderFormData());

      act(() => {
        result.current.setFormData({
          ...result.current.formData,
          client: 'John Doe',
          phone: '1234567890'
        });
      });

      const cart = [{ id: '1', serviceName: 'Lavado' }];

      let isValid;
      act(() => {
        isValid = result.current.validateBasicForm(cart);
      });

      expect(isValid).toBe(true);
    });

    it('should return false when client is missing', () => {
      const { result } = renderHook(() => useOrderFormData());

      const cart = [{ id: '1', serviceName: 'Lavado' }];

      let isValid;
      act(() => {
        isValid = result.current.validateBasicForm(cart);
      });

      expect(isValid).toBe(false);
    });

    it('should set error when client is missing', () => {
      const { result } = renderHook(() => useOrderFormData());

      const cart = [{ id: '1', serviceName: 'Lavado' }];

      act(() => {
        result.current.validateBasicForm(cart);
      });

      expect(result.current.errors.client).toBe('El nombre del cliente es requerido');
    });

    it('should return false when phone is missing', () => {
      const { result } = renderHook(() => useOrderFormData());

      act(() => {
        result.current.setFormData({
          ...result.current.formData,
          client: 'John Doe'
        });
      });

      const cart = [{ id: '1', serviceName: 'Lavado' }];

      let isValid;
      act(() => {
        isValid = result.current.validateBasicForm(cart);
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.phone).toBe('El teléfono es requerido');
    });

    it('should return false when cart is empty', () => {
      const { result } = renderHook(() => useOrderFormData());

      act(() => {
        result.current.setFormData({
          ...result.current.formData,
          client: 'John Doe',
          phone: '1234567890'
        });
      });

      const cart = [];

      let isValid;
      act(() => {
        isValid = result.current.validateBasicForm(cart);
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.cart).toBe('Debe agregar al menos un servicio al carrito');
    });

    it('should call showValidationErrors with errors object when validation fails', () => {
      const { result } = renderHook(() => useOrderFormData());

      const cart = [];

      act(() => {
        result.current.validateBasicForm(cart);
      });

      expect(mockShowValidationErrors).toHaveBeenCalledWith(
        expect.objectContaining({
          client: 'El nombre del cliente es requerido',
          phone: 'El teléfono es requerido',
          cart: 'Debe agregar al menos un servicio al carrito'
        })
      );
    });

    it('should not call showValidationErrors when validation passes', () => {
      const { result } = renderHook(() => useOrderFormData());

      act(() => {
        result.current.setFormData({
          ...result.current.formData,
          client: 'John Doe',
          phone: '1234567890'
        });
      });

      const cart = [{ id: '1', serviceName: 'Lavado' }];

      act(() => {
        result.current.validateBasicForm(cart);
      });

      expect(mockShowValidationErrors).not.toHaveBeenCalled();
    });
  });

  // ✅ Casos de validación - validateForm
  describe('validateForm', () => {
    it('should return true when deliveryDate is provided', () => {
      const { result } = renderHook(() => useOrderFormData());

      act(() => {
        result.current.setFormData({
          ...result.current.formData,
          deliveryDate: '2024-12-25'
        });
      });

      let isValid;
      act(() => {
        isValid = result.current.validateForm();
      });

      expect(isValid).toBe(true);
    });

    it('should return false when deliveryDate is missing', () => {
      const { result } = renderHook(() => useOrderFormData());

      let isValid;
      act(() => {
        isValid = result.current.validateForm();
      });

      expect(isValid).toBe(false);
    });

    it('should set error when deliveryDate is missing', () => {
      const { result } = renderHook(() => useOrderFormData());

      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors.deliveryDate).toBe('La fecha de entrega es requerida');
    });

    it('should call showValidationErrors with errors object when validation fails', () => {
      const { result } = renderHook(() => useOrderFormData());

      act(() => {
        result.current.validateForm();
      });

      expect(mockShowValidationErrors).toHaveBeenCalledWith({
        deliveryDate: 'La fecha de entrega es requerida'
      });
    });

    it('should not call showValidationErrors when validation passes', () => {
      const { result } = renderHook(() => useOrderFormData());

      act(() => {
        result.current.setFormData({
          ...result.current.formData,
          deliveryDate: '2024-12-25'
        });
      });

      act(() => {
        result.current.validateForm();
      });

      expect(mockShowValidationErrors).not.toHaveBeenCalled();
    });

    it('should clear previous errors before validation', () => {
      const { result } = renderHook(() => useOrderFormData());

      // Set old errors
      act(() => {
        result.current.setErrors({
          deliveryDate: 'Old error',
          client: 'Old client error'
        });
      });

      // Validate with deliveryDate filled
      act(() => {
        result.current.setFormData({
          ...result.current.formData,
          deliveryDate: '2024-12-25'
        });
      });

      act(() => {
        result.current.validateForm();
      });

      expect(result.current.errors).toEqual({});
    });
  });

  // ✅ Caso de negocio - direct state manipulation
  describe('direct state manipulation', () => {
    it('should allow setting formData directly', () => {
      const { result } = renderHook(() => useOrderFormData());

      const newFormData = {
        client: 'Jane Smith',
        clientId: 'client456',
        phone: '0987654321',
        email: 'jane@example.com',
        deliveryDate: '2024-12-26',
        paymentMethod: 'card',
        advancePayment: '1000',
        generalNotes: 'New notes'
      };

      act(() => {
        result.current.setFormData(newFormData);
      });

      expect(result.current.formData).toEqual(newFormData);
    });

    it('should allow setting errors directly', () => {
      const { result } = renderHook(() => useOrderFormData());

      const newErrors = {
        client: 'Custom error',
        phone: 'Invalid phone'
      };

      act(() => {
        result.current.setErrors(newErrors);
      });

      expect(result.current.errors).toEqual(newErrors);
    });
  });
});
