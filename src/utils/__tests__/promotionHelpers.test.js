import { describe, it, expect } from 'vitest';
import {
  isPromotionRelevantForCart,
  getPromotionPriority,
  getItemsWithPromoBadge
} from '../promotions/promotionHelpers.js';

describe('promotionHelpers', () => {
  // ========================================
  // isPromotionRelevantForCart
  // ========================================
  describe('isPromotionRelevantForCart', () => {
    // ✅ Casos edge - empty, null
    it('should return false for empty cart', () => {
      const promotion = { type: 'percentage', appliesTo: 'all' };
      const result = isPromotionRelevantForCart(promotion, []);
      expect(result).toBe(false);
    });

    // ✅ Casos de negocio - type: percentage
    describe('type: percentage', () => {
      it('should return true when appliesTo is "all" and cart has items', () => {
        const promotion = { type: 'percentage', appliesTo: 'all' };
        const cart = [{ type: 'service', serviceName: 'Lavado' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(true);
      });

      it('should return true when appliesTo is "services" and cart has services', () => {
        const promotion = { type: 'percentage', appliesTo: 'services' };
        const cart = [{ type: 'service', serviceName: 'Lavado' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(true);
      });

      it('should return false when appliesTo is "services" but cart only has products', () => {
        const promotion = { type: 'percentage', appliesTo: 'services' };
        const cart = [{ type: 'product', productName: 'Shampoo' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(false);
      });

      it('should return true when appliesTo is "products" and cart has products', () => {
        const promotion = { type: 'percentage', appliesTo: 'products' };
        const cart = [{ type: 'product', productName: 'Shampoo' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(true);
      });

      it('should return false when appliesTo is "products" but cart only has services', () => {
        const promotion = { type: 'percentage', appliesTo: 'products' };
        const cart = [{ type: 'service', serviceName: 'Lavado' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(false);
      });

      it('should return true when appliesTo is "specific" and cart has matching service', () => {
        const promotion = {
          type: 'percentage',
          appliesTo: 'specific',
          specificItems: ['service123']
        };
        const cart = [{ type: 'service', serviceId: 'service123' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(true);
      });

      it('should return true when appliesTo is "specific" and cart has matching product', () => {
        const promotion = {
          type: 'percentage',
          appliesTo: 'specific',
          specificItems: ['product456']
        };
        const cart = [{ type: 'product', productId: 'product456' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(true);
      });

      it('should return false when appliesTo is "specific" but cart has no matching items', () => {
        const promotion = {
          type: 'percentage',
          appliesTo: 'specific',
          specificItems: ['service123']
        };
        const cart = [{ type: 'service', serviceId: 'service999' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(false);
      });

      it('should return false when appliesTo is "specific" but no specificItems defined', () => {
        const promotion = {
          type: 'percentage',
          appliesTo: 'specific'
        };
        const cart = [{ type: 'service', serviceId: 'service123' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(false);
      });

      it('should return false when appliesTo is unknown value', () => {
        const promotion = {
          type: 'percentage',
          appliesTo: 'unknown'
        };
        const cart = [{ type: 'service', serviceName: 'Lavado' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(false);
      });
    });

    // ✅ Casos de negocio - type: fixed
    describe('type: fixed', () => {
      it('should return true when no applicableItems defined', () => {
        const promotion = { type: 'fixed' };
        const cart = [{ type: 'service', serviceName: 'Lavado' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(true);
      });

      it('should return true when applicableItems is empty array', () => {
        const promotion = { type: 'fixed', applicableItems: [] };
        const cart = [{ type: 'service', serviceName: 'Lavado' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(true);
      });

      it('should return true when cart has matching service in applicableItems', () => {
        const promotion = {
          type: 'fixed',
          applicableItems: ['service123']
        };
        const cart = [{ type: 'service', serviceId: 'service123' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(true);
      });

      it('should return true when cart has matching product in applicableItems', () => {
        const promotion = {
          type: 'fixed',
          applicableItems: ['product456']
        };
        const cart = [{ type: 'product', productId: 'product456' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(true);
      });

      it('should return false when cart has no matching items in applicableItems', () => {
        const promotion = {
          type: 'fixed',
          applicableItems: ['service123']
        };
        const cart = [{ type: 'service', serviceId: 'service999' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(false);
      });
    });

    // ✅ Casos de negocio - type: buyXgetY
    describe('type: buyXgetY', () => {
      it('should return true when no applicableItems defined', () => {
        const promotion = { type: 'buyXgetY' };
        const cart = [{ type: 'service', serviceName: 'Lavado' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(true);
      });

      it('should return true when cart has matching items', () => {
        const promotion = {
          type: 'buyXgetY',
          applicableItems: ['service123']
        };
        const cart = [{ type: 'service', serviceId: 'service123' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(true);
      });

      it('should return false when cart has no matching items', () => {
        const promotion = {
          type: 'buyXgetY',
          applicableItems: ['service123']
        };
        const cart = [{ type: 'service', serviceId: 'service999' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(false);
      });
    });

    // ✅ Casos de negocio - type: buyXgetYdiscount
    describe('type: buyXgetYdiscount', () => {
      it('should return true when no applicableItems defined', () => {
        const promotion = { type: 'buyXgetYdiscount' };
        const cart = [{ type: 'service', serviceName: 'Lavado' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(true);
      });

      it('should return true when cart has matching items', () => {
        const promotion = {
          type: 'buyXgetYdiscount',
          applicableItems: ['product456']
        };
        const cart = [{ type: 'product', productId: 'product456' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(true);
      });

      it('should return false when cart has no matching items', () => {
        const promotion = {
          type: 'buyXgetYdiscount',
          applicableItems: ['product456']
        };
        const cart = [{ type: 'product', productId: 'product999' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(false);
      });
    });

    // ✅ Casos de negocio - type: combo
    describe('type: combo', () => {
      it('should return false when no comboItems defined', () => {
        const promotion = { type: 'combo' };
        const cart = [{ type: 'service', serviceId: 'service123' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(false);
      });

      it('should return false when comboItems is empty array', () => {
        const promotion = { type: 'combo', comboItems: [] };
        const cart = [{ type: 'service', serviceId: 'service123' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(false);
      });

      it('should return true when cart has at least one combo service item', () => {
        const promotion = {
          type: 'combo',
          comboItems: [{ id: 'service123' }, { id: 'service456' }]
        };
        const cart = [{ type: 'service', serviceId: 'service123' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(true);
      });

      it('should return true when cart has at least one combo product item', () => {
        const promotion = {
          type: 'combo',
          comboItems: [{ id: 'product456' }]
        };
        const cart = [{ type: 'product', productId: 'product456' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(true);
      });

      it('should return false when cart has no combo items', () => {
        const promotion = {
          type: 'combo',
          comboItems: [{ id: 'service123' }]
        };
        const cart = [{ type: 'service', serviceId: 'service999' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(false);
      });
    });

    // ✅ Casos de negocio - type: specificPrice
    describe('type: specificPrice', () => {
      it('should return false when no applicableItems defined', () => {
        const promotion = { type: 'specificPrice' };
        const cart = [{ type: 'service', serviceId: 'service123' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(false);
      });

      it('should return false when applicableItems is empty array', () => {
        const promotion = { type: 'specificPrice', applicableItems: [] };
        const cart = [{ type: 'service', serviceId: 'service123' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(false);
      });

      it('should return true when cart has matching service', () => {
        const promotion = {
          type: 'specificPrice',
          applicableItems: ['service123']
        };
        const cart = [{ type: 'service', serviceId: 'service123' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(true);
      });

      it('should return true when cart has matching product', () => {
        const promotion = {
          type: 'specificPrice',
          applicableItems: ['product456']
        };
        const cart = [{ type: 'product', productId: 'product456' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(true);
      });

      it('should return false when cart has no matching items', () => {
        const promotion = {
          type: 'specificPrice',
          applicableItems: ['service123']
        };
        const cart = [{ type: 'service', serviceId: 'service999' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(false);
      });
    });

    // ✅ Casos de negocio - type: dayOfWeek
    describe('type: dayOfWeek', () => {
      it('should return true for any cart with items', () => {
        const promotion = { type: 'dayOfWeek' };
        const cart = [{ type: 'service', serviceName: 'Lavado' }];
        const result = isPromotionRelevantForCart(promotion, cart);
        expect(result).toBe(true);
      });
    });

    // ✅ Casos de error - unknown type
    it('should return false for unknown promotion type', () => {
      const promotion = { type: 'unknownType' };
      const cart = [{ type: 'service', serviceName: 'Lavado' }];
      const result = isPromotionRelevantForCart(promotion, cart);
      expect(result).toBe(false);
    });
  });

  // ========================================
  // getPromotionPriority
  // ========================================
  describe('getPromotionPriority', () => {
    // ✅ Casos de negocio - Prioridad 1 (ALTA - específicas)
    describe('Priority 1 - Specific promotions', () => {
      it('should return 1 for percentage with specific appliesTo', () => {
        const promo = { type: 'percentage', appliesTo: 'specific' };
        expect(getPromotionPriority(promo)).toBe(1);
      });

      it('should return 1 for fixed with applicableItems', () => {
        const promo = { type: 'fixed', applicableItems: ['item1'] };
        expect(getPromotionPriority(promo)).toBe(1);
      });

      it('should return 1 for buyXgetY with applicableItems', () => {
        const promo = { type: 'buyXgetY', applicableItems: ['item1'] };
        expect(getPromotionPriority(promo)).toBe(1);
      });

      it('should return 1 for buyXgetYdiscount with applicableItems', () => {
        const promo = { type: 'buyXgetYdiscount', applicableItems: ['item1'] };
        expect(getPromotionPriority(promo)).toBe(1);
      });

      it('should return 1 for combo type', () => {
        const promo = { type: 'combo' };
        expect(getPromotionPriority(promo)).toBe(1);
      });

      it('should return 1 for specificPrice with applicableItems', () => {
        const promo = { type: 'specificPrice', applicableItems: ['item1'] };
        expect(getPromotionPriority(promo)).toBe(1);
      });
    });

    // ✅ Casos de negocio - Prioridad 2 (MEDIA - por tipo)
    describe('Priority 2 - Type-based promotions', () => {
      it('should return 2 for percentage applying to services', () => {
        const promo = { type: 'percentage', appliesTo: 'services' };
        expect(getPromotionPriority(promo)).toBe(2);
      });

      it('should return 2 for percentage applying to products', () => {
        const promo = { type: 'percentage', appliesTo: 'products' };
        expect(getPromotionPriority(promo)).toBe(2);
      });
    });

    // ✅ Casos de negocio - Prioridad 3 (BAJA - generales)
    describe('Priority 3 - General promotions', () => {
      it('should return 3 for percentage applying to all', () => {
        const promo = { type: 'percentage', appliesTo: 'all' };
        expect(getPromotionPriority(promo)).toBe(3);
      });

      it('should return 3 for fixed without applicableItems', () => {
        const promo = { type: 'fixed' };
        expect(getPromotionPriority(promo)).toBe(3);
      });

      it('should return 3 for dayOfWeek', () => {
        const promo = { type: 'dayOfWeek' };
        expect(getPromotionPriority(promo)).toBe(3);
      });

      it('should return 3 for unknown promotion type', () => {
        const promo = { type: 'unknownType' };
        expect(getPromotionPriority(promo)).toBe(3);
      });
    });

    // ✅ Casos edge - empty applicableItems array
    it('should return 3 for fixed with empty applicableItems array', () => {
      const promo = { type: 'fixed', applicableItems: [] };
      expect(getPromotionPriority(promo)).toBe(3);
    });
  });

  // ========================================
  // getItemsWithPromoBadge
  // ========================================
  describe('getItemsWithPromoBadge', () => {
    // ✅ Casos edge - empty cart
    it('should return empty array for empty cart', () => {
      const promotion = { type: 'buyXgetY', buyQuantity: 2, getQuantity: 1 };
      const result = getItemsWithPromoBadge(promotion, []);
      expect(result).toEqual([]);
    });

    // ✅ Casos de negocio - type: buyXgetY
    describe('type: buyXgetY', () => {
      it('should return empty array when not enough items to trigger promotion', () => {
        const promotion = { type: 'buyXgetY', buyQuantity: 3, getQuantity: 1 };
        const cart = [
          { id: '1', type: 'service', serviceId: 's1', price: 100, quantity: 2 }
        ];
        const result = getItemsWithPromoBadge(promotion, cart);
        expect(result).toEqual([]);
      });

      it('should return IDs of cheapest items when promotion is triggered', () => {
        const promotion = { type: 'buyXgetY', buyQuantity: 2, getQuantity: 1 };
        const cart = [
          { id: '1', type: 'service', serviceId: 's1', price: 100, quantity: 1 },
          { id: '2', type: 'service', serviceId: 's2', price: 200, quantity: 1 },
          { id: '3', type: 'service', serviceId: 's3', price: 50, quantity: 1 }
        ];
        const result = getItemsWithPromoBadge(promotion, cart);
        expect(result).toEqual(['3']); // Item más barato
      });

      it('should handle multiple free items when buyQuantity allows', () => {
        const promotion = { type: 'buyXgetY', buyQuantity: 2, getQuantity: 1 };
        const cart = [
          { id: '1', type: 'service', serviceId: 's1', price: 100, quantity: 1 },
          { id: '2', type: 'service', serviceId: 's2', price: 200, quantity: 1 },
          { id: '3', type: 'service', serviceId: 's3', price: 50, quantity: 1 },
          { id: '4', type: 'service', serviceId: 's4', price: 150, quantity: 1 }
        ];
        const result = getItemsWithPromoBadge(promotion, cart);
        // Compra 4, obtén 2 gratis (los 2 más baratos: 50 y 100)
        expect(result).toEqual(['3', '1']);
      });

      it('should filter by applicableItems when defined', () => {
        const promotion = {
          type: 'buyXgetY',
          buyQuantity: 2,
          getQuantity: 1,
          applicableItems: ['s1', 's2']
        };
        const cart = [
          { id: '1', type: 'service', serviceId: 's1', price: 100, quantity: 1 },
          { id: '2', type: 'service', serviceId: 's2', price: 200, quantity: 1 },
          { id: '3', type: 'service', serviceId: 's3', price: 50, quantity: 1 }
        ];
        const result = getItemsWithPromoBadge(promotion, cart);
        expect(result).toEqual(['1']); // Solo items aplicables, más barato de ellos
      });

      it('should exclude items already assigned to different promotion', () => {
        const promotion = {
          type: 'buyXgetY',
          id: 'promo1',
          buyQuantity: 2,
          getQuantity: 1
        };
        const cart = [
          { id: '1', type: 'service', serviceId: 's1', price: 100, quantity: 1 },
          { id: '2', type: 'service', serviceId: 's2', price: 200, quantity: 1 },
          { id: '3', type: 'service', serviceId: 's3', price: 50, quantity: 1 }
        ];
        const itemPromotionMap = new Map([['3', { id: 'promo2' }]]);
        const result = getItemsWithPromoBadge(promotion, cart, itemPromotionMap);
        expect(result).toEqual(['1']); // Item 3 está excluido, próximo más barato es 1
      });

      it('should include items assigned to the same promotion', () => {
        const promotion = {
          type: 'buyXgetY',
          id: 'promo1',
          buyQuantity: 2,
          getQuantity: 1
        };
        const cart = [
          { id: '1', type: 'service', serviceId: 's1', price: 100, quantity: 1 },
          { id: '2', type: 'service', serviceId: 's2', price: 200, quantity: 1 },
          { id: '3', type: 'service', serviceId: 's3', price: 50, quantity: 1 }
        ];
        const itemPromotionMap = new Map([['3', { id: 'promo1' }]]);
        const result = getItemsWithPromoBadge(promotion, cart, itemPromotionMap);
        expect(result).toEqual(['3']); // Item 3 es del mismo promo, se incluye
      });
    });

    // ✅ Casos de negocio - type: buyXgetYdiscount
    describe('type: buyXgetYdiscount', () => {
      it('should return empty array when not enough items', () => {
        const promotion = { type: 'buyXgetYdiscount', buyQuantity: 3 };
        const cart = [
          { id: '1', type: 'service', serviceId: 's1', price: 100, quantity: 2 }
        ];
        const result = getItemsWithPromoBadge(promotion, cart);
        expect(result).toEqual([]);
      });

      it('should return IDs of cheapest items receiving discount', () => {
        const promotion = { type: 'buyXgetYdiscount', buyQuantity: 3 };
        const cart = [
          { id: '1', type: 'service', serviceId: 's1', price: 100, quantity: 1 },
          { id: '2', type: 'service', serviceId: 's2', price: 200, quantity: 1 },
          { id: '3', type: 'service', serviceId: 's3', price: 50, quantity: 1 }
        ];
        const result = getItemsWithPromoBadge(promotion, cart);
        expect(result).toEqual(['3']); // 1 set, item más barato recibe descuento
      });

      it('should handle multiple discount items', () => {
        const promotion = { type: 'buyXgetYdiscount', buyQuantity: 2 };
        const cart = [
          { id: '1', type: 'service', serviceId: 's1', price: 100, quantity: 1 },
          { id: '2', type: 'service', serviceId: 's2', price: 200, quantity: 1 },
          { id: '3', type: 'service', serviceId: 's3', price: 50, quantity: 1 },
          { id: '4', type: 'service', serviceId: 's4', price: 150, quantity: 1 }
        ];
        const result = getItemsWithPromoBadge(promotion, cart);
        // 4 items / 2 = 2 sets, 2 items más baratos reciben descuento
        expect(result).toEqual(['3', '1']);
      });

      it('should filter by applicableItems when defined', () => {
        const promotion = {
          type: 'buyXgetYdiscount',
          buyQuantity: 2,
          applicableItems: ['s1', 's2']
        };
        const cart = [
          { id: '1', type: 'service', serviceId: 's1', price: 100, quantity: 1 },
          { id: '2', type: 'service', serviceId: 's2', price: 200, quantity: 1 },
          { id: '3', type: 'service', serviceId: 's3', price: 50, quantity: 1 }
        ];
        const result = getItemsWithPromoBadge(promotion, cart);
        expect(result).toEqual(['1']); // Solo items aplicables, más barato de ellos
      });
    });

    // ✅ Casos de error - unknown type
    it('should return empty array for unknown promotion type', () => {
      const promotion = { type: 'unknownType' };
      const cart = [
        { id: '1', type: 'service', serviceId: 's1', price: 100, quantity: 1 }
      ];
      const result = getItemsWithPromoBadge(promotion, cart);
      expect(result).toEqual([]);
    });

    // ✅ Casos edge - default itemPromotionMap
    it('should work without itemPromotionMap parameter', () => {
      const promotion = { type: 'buyXgetY', buyQuantity: 2, getQuantity: 1 };
      const cart = [
        { id: '1', type: 'service', serviceId: 's1', price: 100, quantity: 1 },
        { id: '2', type: 'service', serviceId: 's2', price: 200, quantity: 1 },
        { id: '3', type: 'service', serviceId: 's3', price: 50, quantity: 1 }
      ];
      const result = getItemsWithPromoBadge(promotion, cart);
      expect(result).toEqual(['3']);
    });
  });
});
