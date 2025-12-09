import { describe, it, expect } from 'vitest';
import {
  getEmployeeOrderCount,
  getEmployeesWithOrderCount,
  autoSelectEmployeeWithLeastOrders
} from '../employees/employeeHelpers';

describe('employeeHelpers', () => {
  describe('getEmployeeOrderCount', () => {
    it('should return 0 when employee has no orders', () => {
      const allOrders = {
        recibidos: [],
        proceso: []
      };

      const count = getEmployeeOrderCount('emp1', allOrders);
      expect(count).toBe(0);
    });

    it('should count recibidos orders for employee', () => {
      const allOrders = {
        recibidos: [
          { authorId: 'emp1' },
          { authorId: 'emp1' },
          { authorId: 'emp2' }
        ],
        proceso: []
      };

      const count = getEmployeeOrderCount('emp1', allOrders);
      expect(count).toBe(2);
    });

    it('should count proceso orders for employee', () => {
      const allOrders = {
        recibidos: [],
        proceso: [
          { authorId: 'emp1' },
          { authorId: 'emp2' },
          { authorId: 'emp1' }
        ]
      };

      const count = getEmployeeOrderCount('emp1', allOrders);
      expect(count).toBe(2);
    });

    it('should count both recibidos and proceso orders', () => {
      const allOrders = {
        recibidos: [
          { authorId: 'emp1' },
          { authorId: 'emp2' }
        ],
        proceso: [
          { authorId: 'emp1' },
          { authorId: 'emp1' },
          { authorId: 'emp3' }
        ]
      };

      const count = getEmployeeOrderCount('emp1', allOrders);
      expect(count).toBe(3); // 1 from recibidos + 2 from proceso
    });

    it('should handle missing recibidos array', () => {
      const allOrders = {
        proceso: [
          { authorId: 'emp1' }
        ]
      };

      const count = getEmployeeOrderCount('emp1', allOrders);
      expect(count).toBe(1);
    });

    it('should handle missing proceso array', () => {
      const allOrders = {
        recibidos: [
          { authorId: 'emp1' }
        ]
      };

      const count = getEmployeeOrderCount('emp1', allOrders);
      expect(count).toBe(1);
    });

    it('should return 0 for empty orders object', () => {
      const allOrders = {};
      const count = getEmployeeOrderCount('emp1', allOrders);
      expect(count).toBe(0);
    });
  });

  describe('getEmployeesWithOrderCount', () => {
    it('should add orderCount to each employee and sort by ascending order', () => {
      const employees = [
        { id: 'emp1', name: 'Juan' },
        { id: 'emp2', name: 'Maria' }
      ];
      const allOrders = {
        recibidos: [
          { authorId: 'emp1' },
          { authorId: 'emp1' }
        ],
        proceso: [
          { authorId: 'emp2' }
        ]
      };

      const result = getEmployeesWithOrderCount(employees, allOrders);

      expect(result).toHaveLength(2);
      // Sorted by orderCount ascending (Maria with 1, Juan with 2)
      expect(result[0]).toMatchObject({
        id: 'emp2',
        name: 'Maria',
        orderCount: 1
      });
      expect(result[1]).toMatchObject({
        id: 'emp1',
        name: 'Juan',
        orderCount: 2
      });
    });

    it('should sort employees by orderCount ascending', () => {
      const employees = [
        { id: 'emp1', name: 'Juan' },
        { id: 'emp2', name: 'Maria' },
        { id: 'emp3', name: 'Pedro' }
      ];
      const allOrders = {
        recibidos: [
          { authorId: 'emp1' },
          { authorId: 'emp1' },
          { authorId: 'emp1' },
          { authorId: 'emp2' }
        ],
        proceso: []
      };

      const result = getEmployeesWithOrderCount(employees, allOrders);

      expect(result[0].id).toBe('emp3'); // 0 orders
      expect(result[0].orderCount).toBe(0);
      expect(result[1].id).toBe('emp2'); // 1 order
      expect(result[1].orderCount).toBe(1);
      expect(result[2].id).toBe('emp1'); // 3 orders
      expect(result[2].orderCount).toBe(3);
    });

    it('should handle empty employees array', () => {
      const employees = [];
      const allOrders = {
        recibidos: [{ authorId: 'emp1' }],
        proceso: []
      };

      const result = getEmployeesWithOrderCount(employees, allOrders);
      expect(result).toEqual([]);
    });

    it('should handle employees with same order count', () => {
      const employees = [
        { id: 'emp1', name: 'Juan' },
        { id: 'emp2', name: 'Maria' }
      ];
      const allOrders = {
        recibidos: [
          { authorId: 'emp1' },
          { authorId: 'emp2' }
        ],
        proceso: []
      };

      const result = getEmployeesWithOrderCount(employees, allOrders);

      expect(result[0].orderCount).toBe(1);
      expect(result[1].orderCount).toBe(1);
    });
  });

  describe('autoSelectEmployeeWithLeastOrders', () => {
    it('should select employee with least orders', () => {
      const employees = [
        { id: 'emp1', name: 'Juan' },
        { id: 'emp2', name: 'Maria' },
        { id: 'emp3', name: 'Pedro' }
      ];
      const allOrders = {
        recibidos: [
          { authorId: 'emp1' },
          { authorId: 'emp1' },
          { authorId: 'emp2' }
        ],
        proceso: []
      };

      const result = autoSelectEmployeeWithLeastOrders(employees, allOrders);

      expect(result).toBeDefined();
      expect(result.id).toBe('emp3'); // Pedro has 0 orders
      expect(result.orderCount).toBe(0);
    });

    it('should select first employee when all have zero orders', () => {
      const employees = [
        { id: 'emp1', name: 'Juan' },
        { id: 'emp2', name: 'Maria' }
      ];
      const allOrders = {
        recibidos: [],
        proceso: []
      };

      const result = autoSelectEmployeeWithLeastOrders(employees, allOrders);

      expect(result).toBeDefined();
      expect(result.orderCount).toBe(0);
      // Could be any employee since all have 0 orders
    });

    it('should return null for empty employees array', () => {
      const employees = [];
      const allOrders = {
        recibidos: [{ authorId: 'emp1' }],
        proceso: []
      };

      const result = autoSelectEmployeeWithLeastOrders(employees, allOrders);
      expect(result).toBeNull();
    });

    it('should return null for null employees', () => {
      const employees = null;
      const allOrders = {
        recibidos: [],
        proceso: []
      };

      const result = autoSelectEmployeeWithLeastOrders(employees, allOrders);
      expect(result).toBeNull();
    });

    it('should handle single employee', () => {
      const employees = [
        { id: 'emp1', name: 'Juan' }
      ];
      const allOrders = {
        recibidos: [
          { authorId: 'emp1' },
          { authorId: 'emp1' }
        ],
        proceso: []
      };

      const result = autoSelectEmployeeWithLeastOrders(employees, allOrders);

      expect(result).toBeDefined();
      expect(result.id).toBe('emp1');
      expect(result.orderCount).toBe(2);
    });

    it('should select employee with least combined orders', () => {
      const employees = [
        { id: 'emp1', name: 'Juan' },
        { id: 'emp2', name: 'Maria' }
      ];
      const allOrders = {
        recibidos: [
          { authorId: 'emp1' }
        ],
        proceso: [
          { authorId: 'emp1' },
          { authorId: 'emp2' }
        ]
      };

      const result = autoSelectEmployeeWithLeastOrders(employees, allOrders);

      expect(result.id).toBe('emp2'); // Maria has 1 order, Juan has 2
      expect(result.orderCount).toBe(1);
    });
  });
});
