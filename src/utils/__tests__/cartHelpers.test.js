import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateCartItemId,
  addServiceToCart,
  addProductToCart,
  removeFromCart,
  expandServicesForOrder,
  transformProductsForOrder,
  hasExpressService
} from '../cart/cartHelpers';

describe('cartHelpers', () => {
  describe('generateCartItemId', () => {
    it('should generate a unique ID', () => {
      const id1 = generateCartItemId();
      const id2 = generateCartItemId();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
    });

    it('should generate string IDs', () => {
      const id = generateCartItemId();
      expect(typeof id).toBe('string');
    });
  });

  describe('addServiceToCart', () => {
    it('should add new service to empty cart', () => {
      const cart = [];
      const service = {
        id: 'service1',
        name: 'Lavado Básico',
        price: 100,
        emoji: '🧼',
        daysToAdd: 2
      };

      const result = addServiceToCart(cart, service);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        serviceId: 'service1',
        type: 'service',
        serviceName: 'Lavado Básico',
        price: 100,
        icon: '🧼',
        quantity: 1,
        daysToAdd: 2
      });
      expect(result[0].id).toBeDefined();
    });

    it('should increment quantity when service already exists', () => {
      const cart = [{
        id: 'item1',
        serviceId: 'service1',
        type: 'service',
        serviceName: 'Lavado Básico',
        price: 100,
        quantity: 1
      }];
      const service = {
        id: 'service1',
        name: 'Lavado Básico',
        price: 100
      };

      const result = addServiceToCart(cart, service);

      expect(result).toHaveLength(1);
      expect(result[0].quantity).toBe(2);
      expect(result[0].id).toBe('item1'); // Same ID
    });

    it('should add different service to cart with existing services', () => {
      const cart = [{
        id: 'item1',
        serviceId: 'service1',
        type: 'service',
        serviceName: 'Lavado Básico',
        price: 100,
        quantity: 1
      }];
      const newService = {
        id: 'service2',
        name: 'Lavado Premium',
        price: 150
      };

      const result = addServiceToCart(cart, newService);

      expect(result).toHaveLength(2);
      expect(result[1].serviceName).toBe('Lavado Premium');
      expect(result[1].quantity).toBe(1);
    });

    it('should use default emoji if not provided', () => {
      const cart = [];
      const service = {
        id: 'service1',
        name: 'Test Service',
        price: 100
      };

      const result = addServiceToCart(cart, service);

      expect(result[0].icon).toBe('🛠️');
    });
  });

  describe('addProductToCart', () => {
    it('should add new product to empty cart', () => {
      const cart = [];
      const product = {
        id: 'prod1',
        name: 'Protector de Calzado',
        salePrice: 50,
        purchasePrice: 25,
        sku: 'SKU001',
        barcode: '1234567890',
        category: 'Accesorios',
        emoji: '🛡️',
        stock: 10
      };

      const result = addProductToCart(cart, product);

      expect(result.error).toBeNull();
      expect(result.cart).toHaveLength(1);
      expect(result.cart[0]).toMatchObject({
        type: 'product',
        productId: 'prod1',
        name: 'Protector de Calzado',
        price: 50,
        purchasePrice: 25,
        quantity: 1,
        maxStock: 10
      });
    });

    it('should increment quantity when product exists and stock available', () => {
      const cart = [{
        id: 'item1',
        type: 'product',
        productId: 'prod1',
        name: 'Protector',
        price: 50,
        quantity: 2
      }];
      const product = {
        id: 'prod1',
        name: 'Protector',
        salePrice: 50,
        stock: 10
      };

      const result = addProductToCart(cart, product);

      expect(result.error).toBeNull();
      expect(result.cart).toHaveLength(1);
      expect(result.cart[0].quantity).toBe(3);
    });

    it('should return error when adding exceeds stock', () => {
      const cart = [{
        id: 'item1',
        type: 'product',
        productId: 'prod1',
        name: 'Protector',
        price: 50,
        quantity: 10 // Already at stock limit
      }];
      const product = {
        id: 'prod1',
        name: 'Protector',
        salePrice: 50,
        stock: 10
      };

      const result = addProductToCart(cart, product);

      expect(result.error).toContain('Stock insuficiente');
      expect(result.cart).toBe(cart); // Cart unchanged
    });

    it('should use default emoji if not provided', () => {
      const cart = [];
      const product = {
        id: 'prod1',
        name: 'Test Product',
        salePrice: 50,
        stock: 5
      };

      const result = addProductToCart(cart, product);

      expect(result.cart[0].icon).toBe('📦');
    });

    it('should add different product to cart with existing products', () => {
      const cart = [{
        id: 'item1',
        type: 'product',
        productId: 'prod1',
        name: 'Producto A',
        quantity: 1
      }];
      const product = {
        id: 'prod2',
        name: 'Producto B',
        salePrice: 75,
        stock: 5
      };

      const result = addProductToCart(cart, product);

      expect(result.error).toBeNull();
      expect(result.cart).toHaveLength(2);
      expect(result.cart[1].productId).toBe('prod2');
    });
  });

  describe('removeFromCart', () => {
    it('should remove item completely when quantity is 1', () => {
      const cart = [{
        id: 'item1',
        name: 'Item 1',
        quantity: 1
      }];

      const result = removeFromCart(cart, 'item1');

      expect(result).toHaveLength(0);
    });

    it('should decrement quantity when quantity > 1', () => {
      const cart = [{
        id: 'item1',
        name: 'Item 1',
        quantity: 3
      }];

      const result = removeFromCart(cart, 'item1');

      expect(result).toHaveLength(1);
      expect(result[0].quantity).toBe(2);
    });

    it('should not modify cart when removing non-existent item', () => {
      const cart = [{
        id: 'item1',
        name: 'Item 1',
        quantity: 1
      }];

      const result = removeFromCart(cart, 'nonexistent');

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('item1');
    });

    it('should only remove specified item from cart with multiple items', () => {
      const cart = [
        { id: 'item1', name: 'Item 1', quantity: 2 },
        { id: 'item2', name: 'Item 2', quantity: 1 },
        { id: 'item3', name: 'Item 3', quantity: 3 }
      ];

      const result = removeFromCart(cart, 'item2');

      expect(result).toHaveLength(2);
      expect(result.find(i => i.id === 'item2')).toBeUndefined();
      expect(result.find(i => i.id === 'item1')).toBeDefined();
      expect(result.find(i => i.id === 'item3')).toBeDefined();
    });
  });

  describe('expandServicesForOrder', () => {
    it('should expand service with quantity 1', () => {
      const cart = [{
        id: 'cart1',
        type: 'service',
        serviceId: 'service1',
        serviceName: 'Lavado',
        price: 100,
        icon: '🧼',
        quantity: 1
      }];

      const result = expandServicesForOrder(cart);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        serviceId: 'service1',
        serviceName: 'Lavado',
        price: 100,
        icon: '🧼',
        images: [],
        notes: '',
        status: 'pending'
      });
    });

    it('should expand service with quantity > 1 into multiple services', () => {
      const cart = [{
        id: 'cart1',
        type: 'service',
        serviceId: 'service1',
        serviceName: 'Lavado',
        price: 100,
        icon: '🧼',
        quantity: 3
      }];

      const result = expandServicesForOrder(cart);

      expect(result).toHaveLength(3);
      result.forEach(service => {
        expect(service).toMatchObject({
          serviceId: 'service1',
          serviceName: 'Lavado',
          price: 100,
          status: 'pending'
        });
        expect(service.id).toBeDefined();
      });
    });

    it('should filter out non-service items', () => {
      const cart = [
        { id: 'cart1', type: 'service', serviceId: 'service1', serviceName: 'Lavado', price: 100, quantity: 1 },
        { id: 'cart2', type: 'product', productId: 'prod1', name: 'Producto', quantity: 2 }
      ];

      const result = expandServicesForOrder(cart);

      expect(result).toHaveLength(1);
      expect(result[0].serviceId).toBe('service1');
    });

    it('should return empty array for empty cart', () => {
      const cart = [];
      const result = expandServicesForOrder(cart);
      expect(result).toEqual([]);
    });

    it('should handle mixed services with different quantities', () => {
      const cart = [
        { id: 'cart1', type: 'service', serviceId: 'service1', serviceName: 'Lavado', price: 100, quantity: 2 },
        { id: 'cart2', type: 'service', serviceId: 'service2', serviceName: 'Planchado', price: 50, quantity: 1 }
      ];

      const result = expandServicesForOrder(cart);

      expect(result).toHaveLength(3);
      expect(result.filter(s => s.serviceName === 'Lavado')).toHaveLength(2);
      expect(result.filter(s => s.serviceName === 'Planchado')).toHaveLength(1);
    });
  });

  describe('transformProductsForOrder', () => {
    it('should transform single product correctly', () => {
      const cart = [{
        id: 'cart1',
        type: 'product',
        productId: 'prod1',
        name: 'Protector',
        price: 50,
        purchasePrice: 25,
        sku: 'SKU001',
        barcode: '123',
        category: 'Accesorios',
        emoji: '🛡️',
        quantity: 2
      }];

      const result = transformProductsForOrder(cart);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        productId: 'prod1',
        name: 'Protector',
        salePrice: 50,
        purchasePrice: 25,
        sku: 'SKU001',
        barcode: '123',
        category: 'Accesorios',
        emoji: '🛡️',
        quantity: 2
      });
    });

    it('should filter out non-product items', () => {
      const cart = [
        { id: 'cart1', type: 'service', serviceId: 'service1', quantity: 1 },
        { id: 'cart2', type: 'product', productId: 'prod1', name: 'Producto', price: 50, quantity: 2 }
      ];

      const result = transformProductsForOrder(cart);

      expect(result).toHaveLength(1);
      expect(result[0].productId).toBe('prod1');
    });

    it('should return empty array for empty cart', () => {
      const cart = [];
      const result = transformProductsForOrder(cart);
      expect(result).toEqual([]);
    });

    it('should transform multiple products', () => {
      const cart = [
        { id: 'cart1', type: 'product', productId: 'prod1', name: 'Producto A', price: 50, quantity: 1 },
        { id: 'cart2', type: 'product', productId: 'prod2', name: 'Producto B', price: 75, quantity: 3 }
      ];

      const result = transformProductsForOrder(cart);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Producto A');
      expect(result[1].name).toBe('Producto B');
    });
  });

  describe('hasExpressService', () => {
    it('should return true when express service exists', () => {
      const cart = [{
        id: 'cart1',
        type: 'service',
        serviceName: 'Servicio Express',
        quantity: 1
      }];

      expect(hasExpressService(cart)).toBe(true);
    });

    it('should return true when express service exists (case insensitive)', () => {
      const cart = [{
        id: 'cart1',
        type: 'service',
        serviceName: 'SERVICIO EXPRESS',
        quantity: 1
      }];

      expect(hasExpressService(cart)).toBe(true);
    });

    it('should return false when no express service exists', () => {
      const cart = [{
        id: 'cart1',
        type: 'service',
        serviceName: 'Lavado Básico',
        quantity: 1
      }];

      expect(hasExpressService(cart)).toBe(false);
    });

    it('should return false for empty cart', () => {
      const cart = [];
      expect(hasExpressService(cart)).toBe(false);
    });

    it('should return false when only products in cart', () => {
      const cart = [{
        id: 'cart1',
        type: 'product',
        name: 'Producto',
        quantity: 1
      }];

      expect(hasExpressService(cart)).toBe(false);
    });

    it('should return true when express service is among other services', () => {
      const cart = [
        { id: 'cart1', type: 'service', serviceName: 'Lavado Básico', quantity: 1 },
        { id: 'cart2', type: 'service', serviceName: 'Servicio Express', quantity: 1 },
        { id: 'cart3', type: 'service', serviceName: 'Planchado', quantity: 1 }
      ];

      expect(hasExpressService(cart)).toBe(true);
    });
  });
});
