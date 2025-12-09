import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCartManagement } from '../useCartManagement';
import * as cartHelpers from '../../utils/cart/cartHelpers';

// Mock cart helpers
vi.mock('../../utils/cart/cartHelpers', () => ({
  addServiceToCart: vi.fn(),
  addProductToCart: vi.fn(),
  removeFromCart: vi.fn()
}));

describe('useCartManagement', () => {
  // Mock window.alert
  beforeEach(() => {
    global.alert = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ✅ Estado inicial
  describe('initial state', () => {
    it('should initialize with empty cart', () => {
      const { result } = renderHook(() => useCartManagement());

      expect(result.current.cart).toEqual([]);
    });

    it('should provide cart state', () => {
      const { result } = renderHook(() => useCartManagement());

      expect(result.current.cart).toBeDefined();
    });

    it('should provide setCart function', () => {
      const { result } = renderHook(() => useCartManagement());

      expect(typeof result.current.setCart).toBe('function');
    });

    it('should provide handleAddToCart function', () => {
      const { result } = renderHook(() => useCartManagement());

      expect(typeof result.current.handleAddToCart).toBe('function');
    });

    it('should provide handleRemoveFromCart function', () => {
      const { result } = renderHook(() => useCartManagement());

      expect(typeof result.current.handleRemoveFromCart).toBe('function');
    });
  });

  // ✅ Caso básico - load initial data (edit mode)
  describe('when initialData is provided', () => {
    it('should load services from initialData', () => {
      const initialData = {
        services: [
          { id: '1', serviceName: 'Lavado', price: 100 },
          { id: '2', serviceName: 'Planchado', price: 50 }
        ]
      };

      const { result } = renderHook(() => useCartManagement(initialData));

      expect(result.current.cart).toEqual(initialData.services);
    });

    it('should handle initialData without services', () => {
      const initialData = { client: 'John Doe' };

      const { result } = renderHook(() => useCartManagement(initialData));

      expect(result.current.cart).toEqual([]);
    });

    it('should handle initialData with empty services', () => {
      const initialData = { services: [] };

      const { result } = renderHook(() => useCartManagement(initialData));

      expect(result.current.cart).toEqual([]);
    });
  });

  // ✅ Efectos secundarios - dependencies
  describe('useEffect dependencies', () => {
    it('should update cart when initialData changes', () => {
      const initialData1 = {
        services: [{ id: '1', serviceName: 'Lavado' }]
      };

      const { result, rerender } = renderHook(
        ({ data }) => useCartManagement(data),
        { initialProps: { data: initialData1 } }
      );

      expect(result.current.cart).toHaveLength(1);

      const initialData2 = {
        services: [
          { id: '1', serviceName: 'Lavado' },
          { id: '2', serviceName: 'Planchado' }
        ]
      };

      act(() => {
        rerender({ data: initialData2 });
      });

      expect(result.current.cart).toHaveLength(2);
    });
  });

  // ✅ Actualización de estado - handleAddToCart (service)
  describe('handleAddToCart for services', () => {
    it('should call addServiceToCart helper', () => {
      const mockNewCart = [{ id: '1', serviceName: 'Lavado' }];
      cartHelpers.addServiceToCart.mockReturnValue(mockNewCart);

      const { result } = renderHook(() => useCartManagement());

      const service = { serviceName: 'Lavado', price: 100 };

      act(() => {
        result.current.handleAddToCart(service, 'service');
      });

      expect(cartHelpers.addServiceToCart).toHaveBeenCalledWith([], service);
    });

    it('should update cart state with result from helper', () => {
      const mockNewCart = [{ id: '1', serviceName: 'Lavado', price: 100 }];
      cartHelpers.addServiceToCart.mockReturnValue(mockNewCart);

      const { result } = renderHook(() => useCartManagement());

      const service = { serviceName: 'Lavado', price: 100 };

      act(() => {
        result.current.handleAddToCart(service, 'service');
      });

      expect(result.current.cart).toEqual(mockNewCart);
    });

    it('should add service using default type when type not specified', () => {
      const mockNewCart = [{ id: '1', serviceName: 'Lavado' }];
      cartHelpers.addServiceToCart.mockReturnValue(mockNewCart);

      const { result } = renderHook(() => useCartManagement());

      const service = { serviceName: 'Lavado', price: 100 };

      act(() => {
        result.current.handleAddToCart(service);
      });

      expect(cartHelpers.addServiceToCart).toHaveBeenCalledWith([], service);
    });
  });

  // ✅ Actualización de estado - handleAddToCart (product)
  describe('handleAddToCart for products', () => {
    it('should call addProductToCart helper', () => {
      cartHelpers.addProductToCart.mockReturnValue({
        cart: [{ id: '1', productName: 'Shampoo' }],
        error: null
      });

      const { result } = renderHook(() => useCartManagement());

      const product = { productName: 'Shampoo', price: 50 };

      act(() => {
        result.current.handleAddToCart(product, 'product');
      });

      expect(cartHelpers.addProductToCart).toHaveBeenCalledWith([], product);
    });

    it('should update cart state when product added successfully', () => {
      const mockNewCart = [{ id: '1', productName: 'Shampoo', price: 50 }];
      cartHelpers.addProductToCart.mockReturnValue({
        cart: mockNewCart,
        error: null
      });

      const { result } = renderHook(() => useCartManagement());

      const product = { productName: 'Shampoo', price: 50 };

      act(() => {
        result.current.handleAddToCart(product, 'product');
      });

      expect(result.current.cart).toEqual(mockNewCart);
    });

    it('should show alert when product has error', () => {
      cartHelpers.addProductToCart.mockReturnValue({
        cart: [],
        error: 'Product out of stock'
      });

      const { result } = renderHook(() => useCartManagement());

      const product = { productName: 'Shampoo', price: 50 };

      act(() => {
        result.current.handleAddToCart(product, 'product');
      });

      expect(global.alert).toHaveBeenCalledWith('Product out of stock');
    });

    it('should not update cart when product has error', () => {
      cartHelpers.addProductToCart.mockReturnValue({
        cart: [{ id: '1', productName: 'Shampoo' }],
        error: 'Product out of stock'
      });

      const { result } = renderHook(() => useCartManagement());

      const product = { productName: 'Shampoo', price: 50 };

      act(() => {
        result.current.handleAddToCart(product, 'product');
      });

      expect(result.current.cart).toEqual([]);
    });
  });

  // ✅ Actualización de estado - handleRemoveFromCart
  describe('handleRemoveFromCart', () => {
    it('should call removeFromCart helper', () => {
      cartHelpers.removeFromCart.mockReturnValue([]);

      const { result } = renderHook(() => useCartManagement());

      // Set initial cart
      act(() => {
        result.current.setCart([{ id: '1', serviceName: 'Lavado' }]);
      });

      act(() => {
        result.current.handleRemoveFromCart('1');
      });

      expect(cartHelpers.removeFromCart).toHaveBeenCalledWith(
        [{ id: '1', serviceName: 'Lavado' }],
        '1'
      );
    });

    it('should update cart state with result from helper', () => {
      const mockNewCart = [{ id: '2', serviceName: 'Planchado' }];
      cartHelpers.removeFromCart.mockReturnValue(mockNewCart);

      const { result } = renderHook(() => useCartManagement());

      // Set initial cart
      act(() => {
        result.current.setCart([
          { id: '1', serviceName: 'Lavado' },
          { id: '2', serviceName: 'Planchado' }
        ]);
      });

      act(() => {
        result.current.handleRemoveFromCart('1');
      });

      expect(result.current.cart).toEqual(mockNewCart);
    });

    it('should handle removing from empty cart', () => {
      cartHelpers.removeFromCart.mockReturnValue([]);

      const { result } = renderHook(() => useCartManagement());

      act(() => {
        result.current.handleRemoveFromCart('1');
      });

      expect(result.current.cart).toEqual([]);
    });
  });

  // ✅ Caso de negocio - direct cart manipulation
  describe('setCart function', () => {
    it('should allow direct cart state manipulation', () => {
      const { result } = renderHook(() => useCartManagement());

      const newCart = [
        { id: '1', serviceName: 'Lavado', price: 100 },
        { id: '2', serviceName: 'Planchado', price: 50 }
      ];

      act(() => {
        result.current.setCart(newCart);
      });

      expect(result.current.cart).toEqual(newCart);
    });

    it('should allow clearing cart', () => {
      const { result } = renderHook(() => useCartManagement());

      act(() => {
        result.current.setCart([{ id: '1', serviceName: 'Lavado' }]);
      });

      expect(result.current.cart).toHaveLength(1);

      act(() => {
        result.current.setCart([]);
      });

      expect(result.current.cart).toEqual([]);
    });
  });

  // ✅ Caso de integración - full workflow
  describe('full workflow integration', () => {
    it('should handle complete add and remove workflow', () => {
      cartHelpers.addServiceToCart.mockImplementation((cart, item) => [
        ...cart,
        { ...item, id: String(cart.length + 1) }
      ]);
      cartHelpers.removeFromCart.mockImplementation((cart, id) =>
        cart.filter(item => item.id !== id)
      );

      const { result } = renderHook(() => useCartManagement());

      // Add first service
      act(() => {
        result.current.handleAddToCart({ serviceName: 'Lavado', price: 100 });
      });

      expect(result.current.cart).toHaveLength(1);

      // Add second service
      act(() => {
        result.current.handleAddToCart({ serviceName: 'Planchado', price: 50 });
      });

      expect(result.current.cart).toHaveLength(2);

      // Remove first service
      act(() => {
        result.current.handleRemoveFromCart('1');
      });

      expect(result.current.cart).toHaveLength(1);
      expect(result.current.cart[0].serviceName).toBe('Planchado');
    });
  });
});
