import { describe, it, expect } from 'vitest';
import {
  applyOrderFilters,
  hasActiveFilter,
  getActiveFiltersCount,
  clearColumnFilter
} from '../history/filterHelpers.js';

describe('filterHelpers', () => {
  // ========================================
  // applyOrderFilters
  // ========================================
  describe('applyOrderFilters', () => {
    // ✅ Casos edge - empty orders
    it('should return empty array for empty orders', () => {
      const filters = { orderNumber: '', photo: 'all', client: '', statusOrder: [], services: [], paymentStatus: [], paymentMethod: [], author: [] };
      const result = applyOrderFilters([], filters, []);
      expect(result).toEqual([]);
    });

    // ✅ Caso básico - no filters
    it('should return all orders when no filters applied', () => {
      const orders = [
        { id: 1, client: 'John' },
        { id: 2, client: 'Jane' }
      ];
      const filters = { orderNumber: '', photo: 'all', client: '', statusOrder: [], services: [], paymentStatus: [], paymentMethod: [], author: [] };
      const result = applyOrderFilters(orders, filters, []);
      expect(result).toEqual(orders);
    });

    // ✅ Filtro 1: orderNumber
    describe('filter: orderNumber', () => {
      it('should filter by order number', () => {
        const orders = [
          { orderNumber: 12345, client: 'John' },
          { orderNumber: 67890, client: 'Jane' },
          { orderNumber: 12389, client: 'Bob' }
        ];
        const filters = { orderNumber: '123', photo: 'all', client: '', statusOrder: [], services: [], paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(2);
        expect(result).toContainEqual(orders[0]);
        expect(result).toContainEqual(orders[2]);
      });

      it('should handle missing orderNumber in order', () => {
        const orders = [
          { orderNumber: 12345 },
          { client: 'Jane' }
        ];
        const filters = { orderNumber: '123', photo: 'all', client: '', statusOrder: [], services: [], paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(1);
      });
    });

    // ✅ Filtro 2: photo
    describe('filter: photo', () => {
      it('should filter orders with photos', () => {
        const orders = [
          { id: 1, orderImages: ['img1.jpg', 'img2.jpg'] },
          { id: 2, orderImages: [] },
          { id: 3, orderImages: ['img3.jpg'] }
        ];
        const filters = { orderNumber: '', photo: 'with', client: '', statusOrder: [], services: [], paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(2);
        expect(result).toContainEqual(orders[0]);
        expect(result).toContainEqual(orders[2]);
      });

      it('should filter orders without photos', () => {
        const orders = [
          { id: 1, orderImages: ['img1.jpg'] },
          { id: 2, orderImages: [] },
          { id: 3 }
        ];
        const filters = { orderNumber: '', photo: 'without', client: '', statusOrder: [], services: [], paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(2);
        expect(result).toContainEqual(orders[1]);
        expect(result).toContainEqual(orders[2]);
      });

      it('should include all when photo filter is "all"', () => {
        const orders = [
          { id: 1, orderImages: ['img1.jpg'] },
          { id: 2, orderImages: [] }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', statusOrder: [], services: [], paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(2);
      });
    });

    // ✅ Filtro 3: client
    describe('filter: client', () => {
      it('should filter by client name (case insensitive)', () => {
        const orders = [
          { client: 'John Doe' },
          { client: 'Jane Smith' },
          { client: 'JOHN Williams' }
        ];
        const filters = { orderNumber: '', photo: 'all', client: 'john', statusOrder: [], services: [], paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(2);
      });

      it('should handle missing client', () => {
        const orders = [
          { client: 'John Doe' },
          { id: 2 }
        ];
        const filters = { orderNumber: '', photo: 'all', client: 'john', statusOrder: [], services: [], paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(1);
      });
    });

    // ✅ Filtro 4 y 5: createdDate (desde/hasta)
    describe('filter: createdDate', () => {
      it('should filter by createdDateFrom', () => {
        const orders = [
          { createdAt: '2024-01-15T10:00:00' },
          { createdAt: '2024-01-10T10:00:00' },
          { createdAt: '2024-01-20T10:00:00' }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', createdDateFrom: '2024-01-12', statusOrder: [], services: [], paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(2);
      });

      it('should filter by createdDateTo', () => {
        const orders = [
          { createdAt: '2024-01-15T10:00:00' },
          { createdAt: '2024-01-10T10:00:00' },
          { createdAt: '2024-01-20T10:00:00' }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', createdDateTo: '2024-01-16', statusOrder: [], services: [], paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(2);
      });

      it('should filter by date range (from and to)', () => {
        const orders = [
          { createdAt: '2024-01-15T10:00:00' },
          { createdAt: '2024-01-10T10:00:00' },
          { createdAt: '2024-01-20T10:00:00' }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', createdDateFrom: '2024-01-12', createdDateTo: '2024-01-18', statusOrder: [], services: [], paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(1);
        expect(result[0].createdAt).toBe('2024-01-15T10:00:00');
      });

      it('should exclude orders without createdAt', () => {
        const orders = [
          { createdAt: '2024-01-15T10:00:00' },
          { id: 2 }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', createdDateFrom: '2024-01-10', statusOrder: [], services: [], paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(1);
      });
    });

    // ✅ Filtro 6 y 7: deliveryDate (desde/hasta)
    describe('filter: deliveryDate', () => {
      it('should filter by deliveryDateFrom (string format)', () => {
        const orders = [
          { deliveryDate: '2024-01-15' },
          { deliveryDate: '2024-01-10' },
          { deliveryDate: '2024-01-20' }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', deliveryDateFrom: '2024-01-12', statusOrder: [], services: [], paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(2);
      });

      it('should filter by deliveryDateTo (string format)', () => {
        const orders = [
          { deliveryDate: '2024-01-15' },
          { deliveryDate: '2024-01-10' },
          { deliveryDate: '2024-01-20' }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', deliveryDateTo: '2024-01-16', statusOrder: [], services: [], paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(2);
      });

      it('should filter by deliveryDateFrom (Date object)', () => {
        const orders = [
          { deliveryDate: new Date('2024-01-15T10:00:00') },
          { deliveryDate: new Date('2024-01-10T10:00:00') },
          { deliveryDate: new Date('2024-01-20T10:00:00') }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', deliveryDateFrom: '2024-01-12', statusOrder: [], services: [], paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(2);
      });

      it('should exclude orders without deliveryDate', () => {
        const orders = [
          { deliveryDate: '2024-01-15' },
          { id: 2 }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', deliveryDateFrom: '2024-01-10', statusOrder: [], services: [], paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(1);
      });
    });

    // ✅ Filtro 8: statusOrder
    describe('filter: statusOrder', () => {
      it('should filter by status categories', () => {
        const orders = [
          { statusCategory: 'pending' },
          { statusCategory: 'in-progress' },
          { statusCategory: 'completed' }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', statusOrder: ['pending', 'completed'], services: [], paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(2);
      });

      it('should include all when statusOrder is empty', () => {
        const orders = [
          { statusCategory: 'pending' },
          { statusCategory: 'completed' }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', statusOrder: [], services: [], paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(2);
      });
    });

    // ✅ Filtro 9: services
    describe('filter: services', () => {
      it('should filter by service names', () => {
        const orders = [
          { services: [{ serviceName: 'Lavado', status: 'active' }] },
          { services: [{ serviceName: 'Planchado', status: 'active' }] },
          { services: [{ serviceName: 'Lavado', status: 'active' }, { serviceName: 'Teñido', status: 'active' }] }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', statusOrder: [], services: ['Lavado'], paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(2);
      });

      it('should exclude cancelled services from matching', () => {
        const orders = [
          { services: [{ serviceName: 'Lavado', status: 'cancelled' }] },
          { services: [{ serviceName: 'Lavado', status: 'active' }] }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', statusOrder: [], services: ['Lavado'], paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(1);
      });

      it('should exclude orders without services', () => {
        const orders = [
          { services: [{ serviceName: 'Lavado', status: 'active' }] },
          { services: [] },
          { id: 3 }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', statusOrder: [], services: ['Lavado'], paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(1);
      });
    });

    // ✅ Filtro 10: total (min/max)
    describe('filter: total price range', () => {
      it('should filter by minimum price', () => {
        const orders = [
          { totalPrice: '1000' },
          { totalPrice: '500' },
          { totalPrice: '1500' }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', statusOrder: [], services: [], totalMin: '800', paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(2);
      });

      it('should filter by maximum price', () => {
        const orders = [
          { totalPrice: '1000' },
          { totalPrice: '500' },
          { totalPrice: '1500' }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', statusOrder: [], services: [], totalMax: '1200', paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(2);
      });

      it('should filter by price range (min and max)', () => {
        const orders = [
          { totalPrice: '1000' },
          { totalPrice: '500' },
          { totalPrice: '1500' }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', statusOrder: [], services: [], totalMin: '600', totalMax: '1200', paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(1);
        expect(result[0].totalPrice).toBe('1000');
      });

      it('should handle missing totalPrice', () => {
        const orders = [
          { totalPrice: '1000' },
          { id: 2 }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', statusOrder: [], services: [], totalMin: '500', paymentStatus: [], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(1);
      });
    });

    // ✅ Filtro 11: paymentStatus
    describe('filter: paymentStatus', () => {
      it('should filter by payment status', () => {
        const orders = [
          { paymentStatus: 'paid' },
          { paymentStatus: 'pending' },
          { paymentStatus: 'partial' }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', statusOrder: [], services: [], paymentStatus: ['paid', 'partial'], paymentMethod: [], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(2);
      });
    });

    // ✅ Filtro 12: paymentMethod
    describe('filter: paymentMethod', () => {
      it('should filter by payment method', () => {
        const orders = [
          { paymentMethod: 'cash' },
          { paymentMethod: 'card' },
          { paymentMethod: 'transfer' }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', statusOrder: [], services: [], paymentStatus: [], paymentMethod: ['cash', 'transfer'], author: [] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(2);
      });
    });

    // ✅ Filtro 13: author
    describe('filter: author', () => {
      it('should filter by author ID', () => {
        const orders = [
          { authorId: 'emp1', author: 'John' },
          { authorId: 'emp2', author: 'Jane' },
          { authorId: 'emp3', author: 'Bob' }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', statusOrder: [], services: [], paymentStatus: [], paymentMethod: [], author: ['emp1', 'emp3'] };
        const result = applyOrderFilters(orders, filters, [], []);
        expect(result).toHaveLength(2);
      });

      it('should include orders with no author when "no-author" selected', () => {
        const orders = [
          { authorId: 'emp1', author: 'John' },
          { id: 2 }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', statusOrder: [], services: [], paymentStatus: [], paymentMethod: [], author: ['no-author'] };
        const result = applyOrderFilters(orders, filters, []);
        expect(result).toHaveLength(1);
      });

      it('should match by author name from employees list', () => {
        const orders = [
          { author: 'John Doe' },
          { author: 'Jane Smith' }
        ];
        const employees = [
          { id: 'emp1', name: 'John Doe' },
          { id: 'emp2', name: 'Jane Smith' }
        ];
        const filters = { orderNumber: '', photo: 'all', client: '', statusOrder: [], services: [], paymentStatus: [], paymentMethod: [], author: ['emp1'] };
        const result = applyOrderFilters(orders, filters, employees);
        expect(result).toHaveLength(1);
        expect(result[0].author).toBe('John Doe');
      });
    });

    // ✅ Caso de negocio - multiple filters
    it('should apply multiple filters together', () => {
      const orders = [
        { orderNumber: 123, client: 'John', paymentStatus: 'paid', totalPrice: '1000' },
        { orderNumber: 456, client: 'Jane', paymentStatus: 'pending', totalPrice: '500' },
        { orderNumber: 789, client: 'John Doe', paymentStatus: 'paid', totalPrice: '2000' }
      ];
      const filters = {
        orderNumber: '',
        photo: 'all',
        client: 'john',
        statusOrder: [],
        services: [],
        totalMin: '800',
        paymentStatus: ['paid'],
        paymentMethod: [],
        author: []
      };
      const result = applyOrderFilters(orders, filters, []);
      expect(result).toHaveLength(2); // Both John and John Doe with paid status and price >= 800
    });
  });

  // ========================================
  // hasActiveFilter
  // ========================================
  describe('hasActiveFilter', () => {
    // ✅ Caso básico - each filter type
    it('should return true for active orderNumber filter', () => {
      const filters = { orderNumber: '123', photo: 'all' };
      expect(hasActiveFilter('orderNumber', filters)).toBe(true);
    });

    it('should return false for inactive orderNumber filter', () => {
      const filters = { orderNumber: '', photo: 'all' };
      expect(hasActiveFilter('orderNumber', filters)).toBe(false);
    });

    it('should return true for active photo filter', () => {
      const filters = { orderNumber: '', photo: 'with' };
      expect(hasActiveFilter('photo', filters)).toBe(true);
    });

    it('should return false for inactive photo filter', () => {
      const filters = { orderNumber: '', photo: 'all' };
      expect(hasActiveFilter('photo', filters)).toBe(false);
    });

    it('should return true for active client filter', () => {
      const filters = { client: 'john' };
      expect(hasActiveFilter('client', filters)).toBe(true);
    });

    it('should return true for active createdDate filter (from only)', () => {
      const filters = { createdDateFrom: '2024-01-01', createdDateTo: '' };
      expect(hasActiveFilter('createdDate', filters)).toBe(true);
    });

    it('should return true for active createdDate filter (to only)', () => {
      const filters = { createdDateFrom: '', createdDateTo: '2024-01-31' };
      expect(hasActiveFilter('createdDate', filters)).toBe(true);
    });

    it('should return false for inactive createdDate filter', () => {
      const filters = { createdDateFrom: '', createdDateTo: '' };
      expect(hasActiveFilter('createdDate', filters)).toBe(false);
    });

    it('should return true for active deliveryDate filter', () => {
      const filters = { deliveryDateFrom: '2024-01-01' };
      expect(hasActiveFilter('deliveryDate', filters)).toBe(true);
    });

    it('should return true for active statusOrder filter', () => {
      const filters = { statusOrder: ['pending'] };
      expect(hasActiveFilter('statusOrder', filters)).toBe(true);
    });

    it('should return false for inactive statusOrder filter', () => {
      const filters = { statusOrder: [] };
      expect(hasActiveFilter('statusOrder', filters)).toBe(false);
    });

    it('should return true for active services filter', () => {
      const filters = { services: ['Lavado'] };
      expect(hasActiveFilter('services', filters)).toBe(true);
    });

    it('should return true for active total filter (min only)', () => {
      const filters = { totalMin: '100', totalMax: '' };
      expect(hasActiveFilter('total', filters)).toBe(true);
    });

    it('should return true for active total filter (max only)', () => {
      const filters = { totalMin: '', totalMax: '500' };
      expect(hasActiveFilter('total', filters)).toBe(true);
    });

    it('should return true for active paymentStatus filter', () => {
      const filters = { paymentStatus: ['paid'] };
      expect(hasActiveFilter('paymentStatus', filters)).toBe(true);
    });

    it('should return true for active paymentMethod filter', () => {
      const filters = { paymentMethod: ['cash'] };
      expect(hasActiveFilter('paymentMethod', filters)).toBe(true);
    });

    it('should return true for active author filter', () => {
      const filters = { author: ['emp1'] };
      expect(hasActiveFilter('author', filters)).toBe(true);
    });

    // ✅ Casos edge - unknown column
    it('should return false for unknown column name', () => {
      const filters = { orderNumber: '123' };
      expect(hasActiveFilter('unknownColumn', filters)).toBe(false);
    });
  });

  // ========================================
  // getActiveFiltersCount
  // ========================================
  describe('getActiveFiltersCount', () => {
    // ✅ Casos edge - no filters
    it('should return 0 when no filters are active', () => {
      const filters = {
        orderNumber: '',
        photo: 'all',
        client: '',
        createdDateFrom: '',
        createdDateTo: '',
        deliveryDateFrom: '',
        deliveryDateTo: '',
        statusOrder: [],
        services: [],
        totalMin: '',
        totalMax: '',
        paymentStatus: [],
        paymentMethod: [],
        author: []
      };
      expect(getActiveFiltersCount(filters)).toBe(0);
    });

    // ✅ Caso básico - single filter
    it('should count single active filter', () => {
      const filters = {
        orderNumber: '123',
        photo: 'all',
        client: '',
        statusOrder: [],
        services: [],
        paymentStatus: [],
        paymentMethod: [],
        author: []
      };
      expect(getActiveFiltersCount(filters)).toBe(1);
    });

    // ✅ Caso básico - multiple filters
    it('should count multiple active filters', () => {
      const filters = {
        orderNumber: '123',
        photo: 'with',
        client: 'john',
        createdDateFrom: '2024-01-01',
        statusOrder: ['pending'],
        services: [],
        paymentStatus: [],
        paymentMethod: [],
        author: []
      };
      expect(getActiveFiltersCount(filters)).toBe(5); // orderNumber, photo, client, createdDate, statusOrder
    });

    // ✅ Casos de negocio - date ranges count as one
    it('should count date range as one filter', () => {
      const filters = {
        orderNumber: '',
        photo: 'all',
        client: '',
        createdDateFrom: '2024-01-01',
        createdDateTo: '2024-01-31',
        statusOrder: [],
        services: [],
        paymentStatus: [],
        paymentMethod: [],
        author: []
      };
      expect(getActiveFiltersCount(filters)).toBe(1); // createdDate range
    });

    // ✅ Casos límite - all filters active
    it('should count all filters when all are active', () => {
      const filters = {
        orderNumber: '123',
        photo: 'with',
        client: 'john',
        createdDateFrom: '2024-01-01',
        deliveryDateFrom: '2024-02-01',
        statusOrder: ['pending'],
        services: ['Lavado'],
        totalMin: '100',
        paymentStatus: ['paid'],
        paymentMethod: ['cash'],
        author: ['emp1']
      };
      expect(getActiveFiltersCount(filters)).toBe(11);
    });
  });

  // ========================================
  // clearColumnFilter
  // ========================================
  describe('clearColumnFilter', () => {
    const mockFilters = {
      orderNumber: '123',
      photo: 'with',
      client: 'john',
      createdDateFrom: '2024-01-01',
      createdDateTo: '2024-01-31',
      deliveryDateFrom: '2024-02-01',
      deliveryDateTo: '2024-02-28',
      statusOrder: ['pending'],
      services: ['Lavado'],
      totalMin: '100',
      totalMax: '500',
      paymentStatus: ['paid'],
      paymentMethod: ['cash'],
      author: ['emp1']
    };

    it('should clear orderNumber filter', () => {
      const result = clearColumnFilter('orderNumber', mockFilters);
      expect(result.orderNumber).toBe('');
      expect(result.client).toBe('john'); // Others unchanged
    });

    it('should clear photo filter', () => {
      const result = clearColumnFilter('photo', mockFilters);
      expect(result.photo).toBe('all');
    });

    it('should clear client filter', () => {
      const result = clearColumnFilter('client', mockFilters);
      expect(result.client).toBe('');
    });

    it('should clear createdDate filters', () => {
      const result = clearColumnFilter('createdDate', mockFilters);
      expect(result.createdDateFrom).toBe('');
      expect(result.createdDateTo).toBe('');
    });

    it('should clear deliveryDate filters', () => {
      const result = clearColumnFilter('deliveryDate', mockFilters);
      expect(result.deliveryDateFrom).toBe('');
      expect(result.deliveryDateTo).toBe('');
    });

    it('should clear statusOrder filter', () => {
      const result = clearColumnFilter('statusOrder', mockFilters);
      expect(result.statusOrder).toEqual([]);
    });

    it('should clear services filter', () => {
      const result = clearColumnFilter('services', mockFilters);
      expect(result.services).toEqual([]);
    });

    it('should clear total filters', () => {
      const result = clearColumnFilter('total', mockFilters);
      expect(result.totalMin).toBe('');
      expect(result.totalMax).toBe('');
    });

    it('should clear paymentStatus filter', () => {
      const result = clearColumnFilter('paymentStatus', mockFilters);
      expect(result.paymentStatus).toEqual([]);
    });

    it('should clear paymentMethod filter', () => {
      const result = clearColumnFilter('paymentMethod', mockFilters);
      expect(result.paymentMethod).toEqual([]);
    });

    it('should clear author filter', () => {
      const result = clearColumnFilter('author', mockFilters);
      expect(result.author).toEqual([]);
    });

    // ✅ Casos edge - unknown column
    it('should return unchanged filters for unknown column', () => {
      const result = clearColumnFilter('unknownColumn', mockFilters);
      expect(result).toEqual(mockFilters);
    });

    // ✅ Caso de negocio - immutability
    it('should not mutate original filters object', () => {
      const original = { ...mockFilters };
      clearColumnFilter('orderNumber', mockFilters);
      expect(mockFilters).toEqual(original);
    });
  });
});
