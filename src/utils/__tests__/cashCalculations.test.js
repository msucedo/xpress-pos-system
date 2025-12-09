import { describe, it, expect } from 'vitest';
import {
  calculateOrdersSummary,
  calcularTotalTarjeta,
  calcularTotalTransferencias,
  calcularDiferencias,
  calcularEfectivoDisponible,
  calcularIngresosAcumulados,
  calcularGananciaDia,
  calcularDineroEnSistema,
  calcularEfectivoFinal
} from '../cash/cashCalculations.js';

describe('cashCalculations', () => {
  // ========================================
  // calculateOrdersSummary
  // ========================================
  describe('calculateOrdersSummary', () => {
    // ✅ Casos edge - empty array
    it('should return zeros for empty orders array', () => {
      const result = calculateOrdersSummary([]);
      expect(result).toEqual({
        totalIncome: 0,
        cashIncome: 0,
        cardIncome: 0,
        transferIncome: 0,
        totalOrders: 0,
        totalProductos: 0
      });
    });

    // ✅ Caso básico - single paid order
    it('should calculate summary for single paid order with cash', () => {
      const orders = [
        {
          totalPrice: '1000',
          paymentStatus: 'paid',
          paymentMethod: 'cash',
          products: [{ quantity: 2 }, { quantity: 3 }]
        }
      ];
      const result = calculateOrdersSummary(orders);
      expect(result.totalIncome).toBe(1000);
      expect(result.cashIncome).toBe(1000);
      expect(result.cardIncome).toBe(0);
      expect(result.transferIncome).toBe(0);
      expect(result.totalOrders).toBe(1);
      expect(result.totalProductos).toBe(5);
    });

    // ✅ Casos de negocio - payment status: paid
    it('should count full amount for paid orders', () => {
      const orders = [
        { totalPrice: '1000', paymentStatus: 'paid', paymentMethod: 'cash' }
      ];
      const result = calculateOrdersSummary(orders);
      expect(result.totalIncome).toBe(1000);
      expect(result.cashIncome).toBe(1000);
    });

    // ✅ Casos de negocio - payment status: partial
    it('should count only advance for partial orders', () => {
      const orders = [
        {
          totalPrice: '1000',
          advancePayment: '300',
          paymentStatus: 'partial',
          paymentMethod: 'cash'
        }
      ];
      const result = calculateOrdersSummary(orders);
      expect(result.totalIncome).toBe(300);
      expect(result.cashIncome).toBe(300);
    });

    // ✅ Casos de negocio - payment status: pending
    it('should count zero for pending orders', () => {
      const orders = [
        {
          totalPrice: '1000',
          paymentStatus: 'pending',
          paymentMethod: 'cash'
        }
      ];
      const result = calculateOrdersSummary(orders);
      expect(result.totalIncome).toBe(0);
      expect(result.cashIncome).toBe(0);
      expect(result.totalOrders).toBe(1); // Order is still counted
    });

    // ✅ Casos de negocio - payment methods
    it('should separate income by payment method (cash)', () => {
      const orders = [
        { totalPrice: '1000', paymentStatus: 'paid', paymentMethod: 'cash' }
      ];
      const result = calculateOrdersSummary(orders);
      expect(result.cashIncome).toBe(1000);
      expect(result.cardIncome).toBe(0);
      expect(result.transferIncome).toBe(0);
    });

    it('should separate income by payment method (card)', () => {
      const orders = [
        { totalPrice: '1000', paymentStatus: 'paid', paymentMethod: 'card' }
      ];
      const result = calculateOrdersSummary(orders);
      expect(result.cashIncome).toBe(0);
      expect(result.cardIncome).toBe(1000);
      expect(result.transferIncome).toBe(0);
    });

    it('should separate income by payment method (transfer)', () => {
      const orders = [
        { totalPrice: '1000', paymentStatus: 'paid', paymentMethod: 'transfer' }
      ];
      const result = calculateOrdersSummary(orders);
      expect(result.cashIncome).toBe(0);
      expect(result.cardIncome).toBe(0);
      expect(result.transferIncome).toBe(1000);
    });

    // ✅ Caso básico - multiple orders
    it('should sum multiple orders correctly', () => {
      const orders = [
        { totalPrice: '1000', paymentStatus: 'paid', paymentMethod: 'cash' },
        { totalPrice: '2000', paymentStatus: 'paid', paymentMethod: 'card' },
        { totalPrice: '1500', paymentStatus: 'paid', paymentMethod: 'transfer' }
      ];
      const result = calculateOrdersSummary(orders);
      expect(result.totalIncome).toBe(4500);
      expect(result.cashIncome).toBe(1000);
      expect(result.cardIncome).toBe(2000);
      expect(result.transferIncome).toBe(1500);
      expect(result.totalOrders).toBe(3);
    });

    // ✅ Casos edge - missing products
    it('should handle orders without products', () => {
      const orders = [
        { totalPrice: '1000', paymentStatus: 'paid', paymentMethod: 'cash' }
      ];
      const result = calculateOrdersSummary(orders);
      expect(result.totalProductos).toBe(0);
    });

    // ✅ Casos edge - products with missing quantity
    it('should handle products without quantity', () => {
      const orders = [
        {
          totalPrice: '1000',
          paymentStatus: 'paid',
          paymentMethod: 'cash',
          products: [{ name: 'Product A' }]
        }
      ];
      const result = calculateOrdersSummary(orders);
      expect(result.totalProductos).toBe(0);
    });

    // ✅ Casos edge - null/undefined values
    it('should handle null totalPrice', () => {
      const orders = [
        { totalPrice: null, paymentStatus: 'paid', paymentMethod: 'cash' }
      ];
      const result = calculateOrdersSummary(orders);
      expect(result.totalIncome).toBe(0);
    });

    it('should handle undefined advancePayment', () => {
      const orders = [
        { totalPrice: '1000', paymentStatus: 'partial', paymentMethod: 'cash' }
      ];
      const result = calculateOrdersSummary(orders);
      expect(result.totalIncome).toBe(0);
    });

    // ✅ Casos de negocio - mixed payment statuses
    it('should handle mixed payment statuses correctly', () => {
      const orders = [
        { totalPrice: '1000', paymentStatus: 'paid', paymentMethod: 'cash' },
        { totalPrice: '2000', advancePayment: '500', paymentStatus: 'partial', paymentMethod: 'card' },
        { totalPrice: '3000', paymentStatus: 'pending', paymentMethod: 'cash' }
      ];
      const result = calculateOrdersSummary(orders);
      expect(result.totalIncome).toBe(1500); // 1000 + 500 + 0
      expect(result.cashIncome).toBe(1000);
      expect(result.cardIncome).toBe(500);
      expect(result.totalOrders).toBe(3);
    });
  });

  // ========================================
  // calcularTotalTarjeta
  // ========================================
  describe('calcularTotalTarjeta', () => {
    // ✅ Casos edge - empty array
    it('should return 0 for empty array', () => {
      const result = calcularTotalTarjeta([]);
      expect(result).toBe(0);
    });

    // ✅ Caso básico - single charge
    it('should calculate total for single charge', () => {
      const cobros = [{ monto: '500', tipo: 'debito' }];
      const result = calcularTotalTarjeta(cobros);
      expect(result).toBe(500);
    });

    // ✅ Caso básico - multiple charges
    it('should sum multiple charges', () => {
      const cobros = [
        { monto: '500', tipo: 'debito' },
        { monto: '300', tipo: 'credito' },
        { monto: '200', tipo: 'debito' }
      ];
      const result = calcularTotalTarjeta(cobros);
      expect(result).toBe(1000);
    });

    // ✅ Casos edge - null/undefined monto
    it('should handle null monto', () => {
      const cobros = [{ monto: null, tipo: 'debito' }];
      const result = calcularTotalTarjeta(cobros);
      expect(result).toBe(0);
    });

    it('should handle undefined monto', () => {
      const cobros = [{ tipo: 'debito' }];
      const result = calcularTotalTarjeta(cobros);
      expect(result).toBe(0);
    });

    // ✅ Casos de negocio - mixed valid and invalid
    it('should sum only valid amounts', () => {
      const cobros = [
        { monto: '500', tipo: 'debito' },
        { monto: null, tipo: 'credito' },
        { monto: '300', tipo: 'debito' }
      ];
      const result = calcularTotalTarjeta(cobros);
      expect(result).toBe(800);
    });
  });

  // ========================================
  // calcularTotalTransferencias
  // ========================================
  describe('calcularTotalTransferencias', () => {
    // ✅ Casos edge - empty array
    it('should return 0 for empty array', () => {
      const result = calcularTotalTransferencias([]);
      expect(result).toBe(0);
    });

    // ✅ Caso básico - single transfer
    it('should calculate total for single transfer', () => {
      const transfers = [{ monto: '1000' }];
      const result = calcularTotalTransferencias(transfers);
      expect(result).toBe(1000);
    });

    // ✅ Caso básico - multiple transfers
    it('should sum multiple transfers', () => {
      const transfers = [
        { monto: '1000' },
        { monto: '500' },
        { monto: '250' }
      ];
      const result = calcularTotalTransferencias(transfers);
      expect(result).toBe(1750);
    });

    // ✅ Casos edge - null/undefined monto
    it('should handle null monto', () => {
      const transfers = [{ monto: null }];
      const result = calcularTotalTransferencias(transfers);
      expect(result).toBe(0);
    });

    it('should handle undefined monto', () => {
      const transfers = [{}];
      const result = calcularTotalTransferencias(transfers);
      expect(result).toBe(0);
    });

    // ✅ Casos de negocio - mixed valid and invalid
    it('should sum only valid amounts', () => {
      const transfers = [
        { monto: '1000' },
        { monto: null },
        { monto: '500' }
      ];
      const result = calcularTotalTransferencias(transfers);
      expect(result).toBe(1500);
    });
  });

  // ========================================
  // calcularDiferencias
  // ========================================
  describe('calcularDiferencias', () => {
    // ✅ Caso básico - exact match
    it('should return zeros when counted equals system', () => {
      const conteo = { efectivo: 1000, tarjeta: 500, transferencia: 200 };
      const sistema = { efectivo: 1000, tarjeta: 500, transferencia: 200 };
      const result = calcularDiferencias(conteo, sistema);
      expect(result).toEqual({
        efectivo: 0,
        tarjeta: 0,
        transferencia: 0,
        total: 0
      });
    });

    // ✅ Casos de negocio - positive differences (more counted)
    it('should calculate positive differences when counted is more', () => {
      const conteo = { efectivo: 1200, tarjeta: 600, transferencia: 300 };
      const sistema = { efectivo: 1000, tarjeta: 500, transferencia: 200 };
      const result = calcularDiferencias(conteo, sistema);
      expect(result).toEqual({
        efectivo: 200,
        tarjeta: 100,
        transferencia: 100,
        total: 400
      });
    });

    // ✅ Casos de negocio - negative differences (less counted)
    it('should calculate negative differences when counted is less', () => {
      const conteo = { efectivo: 800, tarjeta: 400, transferencia: 100 };
      const sistema = { efectivo: 1000, tarjeta: 500, transferencia: 200 };
      const result = calcularDiferencias(conteo, sistema);
      expect(result).toEqual({
        efectivo: -200,
        tarjeta: -100,
        transferencia: -100,
        total: -400
      });
    });

    // ✅ Casos de negocio - mixed differences
    it('should handle mixed positive and negative differences', () => {
      const conteo = { efectivo: 1200, tarjeta: 400, transferencia: 200 };
      const sistema = { efectivo: 1000, tarjeta: 500, transferencia: 200 };
      const result = calcularDiferencias(conteo, sistema);
      expect(result).toEqual({
        efectivo: 200,
        tarjeta: -100,
        transferencia: 0,
        total: 100
      });
    });

    // ✅ Casos edge - zeros
    it('should handle zero values', () => {
      const conteo = { efectivo: 0, tarjeta: 0, transferencia: 0 };
      const sistema = { efectivo: 0, tarjeta: 0, transferencia: 0 };
      const result = calcularDiferencias(conteo, sistema);
      expect(result).toEqual({
        efectivo: 0,
        tarjeta: 0,
        transferencia: 0,
        total: 0
      });
    });
  });

  // ========================================
  // calcularEfectivoDisponible
  // ========================================
  describe('calcularEfectivoDisponible', () => {
    // ✅ Caso básico - first closure (no previous)
    it('should calculate correctly for first closure', () => {
      const result = calcularEfectivoDisponible(null, 1000, 200, 100);
      expect(result).toBe(700); // 0 + 1000 - 200 - 100
    });

    // ✅ Caso básico - with previous closure
    it('should include previous closure cash', () => {
      const lastClosure = { efectivoFinal: 500 };
      const result = calcularEfectivoDisponible(lastClosure, 1000, 200, 100);
      expect(result).toBe(1200); // 500 + 1000 - 200 - 100
    });

    // ✅ Casos edge - no expenses or withdrawals
    it('should handle zero expenses and withdrawals', () => {
      const lastClosure = { efectivoFinal: 500 };
      const result = calcularEfectivoDisponible(lastClosure, 1000, 0, 0);
      expect(result).toBe(1500); // 500 + 1000 - 0 - 0
    });

    // ✅ Casos edge - negative result (more spent than available)
    it('should allow negative result when expenses exceed income', () => {
      const lastClosure = { efectivoFinal: 100 };
      const result = calcularEfectivoDisponible(lastClosure, 200, 500, 100);
      expect(result).toBe(-300); // 100 + 200 - 500 - 100
    });
  });

  // ========================================
  // calcularIngresosAcumulados
  // ========================================
  describe('calcularIngresosAcumulados', () => {
    // ✅ Caso básico - first closure (no previous)
    it('should return only new income for first closure', () => {
      const result = calcularIngresosAcumulados(null, 1000);
      expect(result).toBe(1000);
    });

    // ✅ Caso básico - with previous closure
    it('should accumulate with previous income', () => {
      const lastClosure = { resultados: { ingresosTotal: 2000 } };
      const result = calcularIngresosAcumulados(lastClosure, 1000);
      expect(result).toBe(3000); // 2000 + 1000
    });

    // ✅ Casos edge - zero new income
    it('should handle zero new income', () => {
      const lastClosure = { resultados: { ingresosTotal: 2000 } };
      const result = calcularIngresosAcumulados(lastClosure, 0);
      expect(result).toBe(2000);
    });

    // ✅ Casos edge - previous closure without resultados
    it('should handle previous closure without resultados', () => {
      const lastClosure = {};
      const result = calcularIngresosAcumulados(lastClosure, 1000);
      expect(result).toBe(1000);
    });
  });

  // ========================================
  // calcularGananciaDia
  // ========================================
  describe('calcularGananciaDia', () => {
    // ✅ Caso básico - positive profit
    it('should calculate positive profit', () => {
      const result = calcularGananciaDia(5000, 2000);
      expect(result).toBe(3000);
    });

    // ✅ Casos de negocio - loss (negative profit)
    it('should calculate negative profit (loss)', () => {
      const result = calcularGananciaDia(2000, 5000);
      expect(result).toBe(-3000);
    });

    // ✅ Casos edge - zero profit
    it('should return zero when income equals expenses', () => {
      const result = calcularGananciaDia(3000, 3000);
      expect(result).toBe(0);
    });

    // ✅ Casos edge - zero expenses
    it('should handle zero expenses', () => {
      const result = calcularGananciaDia(5000, 0);
      expect(result).toBe(5000);
    });

    // ✅ Casos edge - zero income
    it('should handle zero income', () => {
      const result = calcularGananciaDia(0, 2000);
      expect(result).toBe(-2000);
    });
  });

  // ========================================
  // calcularDineroEnSistema
  // ========================================
  describe('calcularDineroEnSistema', () => {
    // ✅ Caso básico - with initial cash
    it('should calculate system money with initial cash', () => {
      const summary = {
        cashIncome: 1000,
        cardIncome: 500,
        transferIncome: 200
      };
      const result = calcularDineroEnSistema(summary, '300');
      expect(result).toEqual({
        efectivo: 1300, // 1000 + 300
        tarjeta: 500,
        transferencia: 200,
        total: 2000
      });
    });

    // ✅ Casos edge - no initial cash
    it('should handle zero initial cash', () => {
      const summary = {
        cashIncome: 1000,
        cardIncome: 500,
        transferIncome: 200
      };
      const result = calcularDineroEnSistema(summary, '0');
      expect(result).toEqual({
        efectivo: 1000,
        tarjeta: 500,
        transferencia: 200,
        total: 1700
      });
    });

    // ✅ Casos edge - null initial cash
    it('should handle null initial cash', () => {
      const summary = {
        cashIncome: 1000,
        cardIncome: 500,
        transferIncome: 200
      };
      const result = calcularDineroEnSistema(summary, null);
      expect(result).toEqual({
        efectivo: 1000,
        tarjeta: 500,
        transferencia: 200,
        total: 1700
      });
    });

    // ✅ Casos edge - all zeros
    it('should handle all zero values', () => {
      const summary = {
        cashIncome: 0,
        cardIncome: 0,
        transferIncome: 0
      };
      const result = calcularDineroEnSistema(summary, '0');
      expect(result).toEqual({
        efectivo: 0,
        tarjeta: 0,
        transferencia: 0,
        total: 0
      });
    });
  });

  // ========================================
  // calcularEfectivoFinal
  // ========================================
  describe('calcularEfectivoFinal', () => {
    // ✅ Caso básico - first closure (no previous)
    it('should calculate correctly for first closure', () => {
      const result = calcularEfectivoFinal(null, 1000, 200, 100);
      expect(result).toBe(700); // 0 + 1000 - 200 - 100
    });

    // ✅ Caso básico - with previous closure
    it('should include previous final cash', () => {
      const lastClosure = { efectivoFinal: 500 };
      const result = calcularEfectivoFinal(lastClosure, 1000, 200, 100);
      expect(result).toBe(1200); // 500 + 1000 - 200 - 100
    });

    // ✅ Casos edge - no expenses or withdrawals
    it('should handle zero expenses and withdrawals', () => {
      const lastClosure = { efectivoFinal: 500 };
      const result = calcularEfectivoFinal(lastClosure, 1000, 0, 0);
      expect(result).toBe(1500);
    });

    // ✅ Casos edge - negative result
    it('should allow negative result', () => {
      const lastClosure = { efectivoFinal: 100 };
      const result = calcularEfectivoFinal(lastClosure, 200, 500, 100);
      expect(result).toBe(-300);
    });

    // ✅ Casos de negocio - continuity between closures
    it('should maintain continuity between multiple closures', () => {
      // First closure
      const firstResult = calcularEfectivoFinal(null, 1000, 100, 50);
      expect(firstResult).toBe(850);

      // Second closure using first as previous
      const lastClosure1 = { efectivoFinal: firstResult };
      const secondResult = calcularEfectivoFinal(lastClosure1, 2000, 200, 100);
      expect(secondResult).toBe(2550); // 850 + 2000 - 200 - 100

      // Third closure using second as previous
      const lastClosure2 = { efectivoFinal: secondResult };
      const thirdResult = calcularEfectivoFinal(lastClosure2, 1500, 150, 50);
      expect(thirdResult).toBe(3850); // 2550 + 1500 - 150 - 50
    });
  });
});
