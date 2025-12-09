import { describe, it, expect } from 'vitest';
import {
  calculateSubtotal,
  calculateTotalDiscount,
  calculateTotalPrice,
  calculateTotalItems
} from '../promotions/promotionCalculations';

describe('promotionCalculations', () => {
  describe('calculateSubtotal', () => {
    it('should return 0 for empty cart', () => {
      const cart = [];
      expect(calculateSubtotal(cart)).toBe(0);
    });

    it('should calculate subtotal for single item with quantity 1', () => {
      const cart = [
        { price: 100, quantity: 1 }
      ];
      expect(calculateSubtotal(cart)).toBe(100);
    });

    it('should calculate subtotal for single item with multiple quantities', () => {
      const cart = [
        { price: 50, quantity: 3 }
      ];
      expect(calculateSubtotal(cart)).toBe(150);
    });

    it('should calculate subtotal for multiple items', () => {
      const cart = [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 },
        { price: 75, quantity: 3 }
      ];
      // (100*2) + (50*1) + (75*3) = 200 + 50 + 225 = 475
      expect(calculateSubtotal(cart)).toBe(475);
    });

    it('should handle items with missing price (treat as 0)', () => {
      const cart = [
        { quantity: 2 }, // no price
        { price: 100, quantity: 1 }
      ];
      expect(calculateSubtotal(cart)).toBe(100);
    });

    it('should handle items with missing quantity (treat as 1)', () => {
      const cart = [
        { price: 100 }, // no quantity
        { price: 50, quantity: 2 }
      ];
      expect(calculateSubtotal(cart)).toBe(200); // 100*1 + 50*2
    });

    it('should handle decimal prices', () => {
      const cart = [
        { price: 99.99, quantity: 2 }
      ];
      expect(calculateSubtotal(cart)).toBeCloseTo(199.98, 2);
    });

    it('should handle zero price items', () => {
      const cart = [
        { price: 0, quantity: 5 },
        { price: 100, quantity: 1 }
      ];
      expect(calculateSubtotal(cart)).toBe(100);
    });
  });

  describe('calculateTotalDiscount', () => {
    it('should return 0 for empty promotions array', () => {
      const promotions = [];
      expect(calculateTotalDiscount(promotions)).toBe(0);
    });

    it('should calculate total discount for single promotion', () => {
      const promotions = [
        { discountAmount: 50 }
      ];
      expect(calculateTotalDiscount(promotions)).toBe(50);
    });

    it('should calculate total discount for multiple promotions', () => {
      const promotions = [
        { discountAmount: 50 },
        { discountAmount: 25 },
        { discountAmount: 10 }
      ];
      expect(calculateTotalDiscount(promotions)).toBe(85);
    });

    it('should handle promotions with missing discountAmount (treat as 0)', () => {
      const promotions = [
        { discountAmount: 50 },
        {}, // no discountAmount
        { discountAmount: 10 }
      ];
      expect(calculateTotalDiscount(promotions)).toBe(60);
    });

    it('should handle decimal discount amounts', () => {
      const promotions = [
        { discountAmount: 19.99 },
        { discountAmount: 5.50 }
      ];
      expect(calculateTotalDiscount(promotions)).toBeCloseTo(25.49, 2);
    });

    it('should handle zero discount promotions', () => {
      const promotions = [
        { discountAmount: 0 },
        { discountAmount: 25 }
      ];
      expect(calculateTotalDiscount(promotions)).toBe(25);
    });
  });

  describe('calculateTotalPrice', () => {
    it('should return 0 for empty cart and no promotions', () => {
      const cart = [];
      const promotions = [];
      expect(calculateTotalPrice(cart, promotions)).toBe(0);
    });

    it('should return subtotal when no promotions applied', () => {
      const cart = [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 }
      ];
      const promotions = [];
      expect(calculateTotalPrice(cart, promotions)).toBe(250);
    });

    it('should calculate total price with single promotion', () => {
      const cart = [
        { price: 100, quantity: 1 }
      ];
      const promotions = [
        { discountAmount: 20 }
      ];
      expect(calculateTotalPrice(cart, promotions)).toBe(80);
    });

    it('should calculate total price with multiple promotions', () => {
      const cart = [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 1 }
      ];
      const promotions = [
        { discountAmount: 50 },
        { discountAmount: 25 }
      ];
      // Subtotal: 250, Discount: 75, Total: 175
      expect(calculateTotalPrice(cart, promotions)).toBe(175);
    });

    it('should not return negative price (discount > subtotal)', () => {
      const cart = [
        { price: 50, quantity: 1 }
      ];
      const promotions = [
        { discountAmount: 100 } // discount > subtotal
      ];
      expect(calculateTotalPrice(cart, promotions)).toBe(0);
    });

    it('should handle decimal values correctly', () => {
      const cart = [
        { price: 99.99, quantity: 1 }
      ];
      const promotions = [
        { discountAmount: 9.99 }
      ];
      expect(calculateTotalPrice(cart, promotions)).toBeCloseTo(90, 2);
    });

    it('should handle 100% discount', () => {
      const cart = [
        { price: 100, quantity: 1 }
      ];
      const promotions = [
        { discountAmount: 100 }
      ];
      expect(calculateTotalPrice(cart, promotions)).toBe(0);
    });
  });

  describe('calculateTotalItems', () => {
    it('should return 0 for empty cart', () => {
      const cart = [];
      expect(calculateTotalItems(cart)).toBe(0);
    });

    it('should count single item with quantity 1', () => {
      const cart = [
        { quantity: 1 }
      ];
      expect(calculateTotalItems(cart)).toBe(1);
    });

    it('should count single item with multiple quantities', () => {
      const cart = [
        { quantity: 5 }
      ];
      expect(calculateTotalItems(cart)).toBe(5);
    });

    it('should count multiple items with different quantities', () => {
      const cart = [
        { quantity: 2 },
        { quantity: 3 },
        { quantity: 1 }
      ];
      expect(calculateTotalItems(cart)).toBe(6);
    });

    it('should handle items with missing quantity (treat as 1)', () => {
      const cart = [
        {}, // no quantity
        { quantity: 3 }
      ];
      expect(calculateTotalItems(cart)).toBe(4);
    });

    it('should handle items with zero quantity (treated as 1)', () => {
      const cart = [
        { quantity: 0 }, // 0 is falsy, so treated as 1
        { quantity: 5 }
      ];
      expect(calculateTotalItems(cart)).toBe(6); // 1 + 5 = 6
    });

    it('should handle large quantities', () => {
      const cart = [
        { quantity: 100 },
        { quantity: 250 },
        { quantity: 150 }
      ];
      expect(calculateTotalItems(cart)).toBe(500);
    });
  });
});
