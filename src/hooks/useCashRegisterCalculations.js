import { useMemo } from 'react';
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
} from '../utils/cash/cashCalculations';
import {
  calcularEfectivoContado
} from '../utils/cash/denominationHelpers';
import {
  getLastClosureToday,
  getTotalRetirosAcumulados,
  getTotalGastosAcumulados
} from '../utils/cash/closureHelpers';
import {
  calculateTotalExpenses,
  calculateTotalWithdrawals
} from '../utils/expenses/expenseHelpers';

/**
 * Hook que calcula todos los valores derivados para el cash register
 * Usa useMemo para optimizar rendimiento
 *
 * @param {Object} params - Parámetros necesarios para los cálculos
 * @param {Array} params.orders - Array de órdenes
 * @param {Array} params.closures - Array de cierres de caja
 * @param {Object} params.billetes - Conteo de billetes
 * @param {Object} params.monedas - Conteo de monedas
 * @param {Array} params.cobrosTarjeta - Array de cobros con tarjeta
 * @param {Array} params.transferencias - Array de transferencias
 * @param {string} params.dineroInicial - Dinero inicial en caja
 * @param {Array} params.expenses - Array de gastos
 * @param {Array} params.withdrawals - Array de retiros
 * @returns {Object} Objeto con todos los cálculos
 */
export function useCashRegisterCalculations({
  orders,
  closures,
  billetes,
  monedas,
  cobrosTarjeta,
  transferencias,
  dineroInicial,
  expenses,
  withdrawals
}) {
  // ===== CÁLCULOS DE ÓRDENES =====
  const summary = useMemo(() => calculateOrdersSummary(orders), [orders]);

  // ===== CÁLCULOS DE CONTEO =====
  const efectivoContado = useMemo(
    () => calcularEfectivoContado(billetes, monedas),
    [billetes, monedas]
  );

  const tarjetaContada = useMemo(
    () => calcularTotalTarjeta(cobrosTarjeta),
    [cobrosTarjeta]
  );

  const transferenciaContada = useMemo(
    () => calcularTotalTransferencias(transferencias),
    [transferencias]
  );

  const totalConteoIngresos = useMemo(
    () => efectivoContado + tarjetaContada + transferenciaContada,
    [efectivoContado, tarjetaContada, transferenciaContada]
  );

  // ===== TOTALES DE GASTOS Y RETIROS =====
  const totalExpenses = useMemo(
    () => calculateTotalExpenses(expenses),
    [expenses]
  );

  const totalWithdrawals = useMemo(
    () => calculateTotalWithdrawals(withdrawals),
    [withdrawals]
  );

  // ===== ÚLTIMO CORTE DEL DÍA =====
  const lastClosureToday = useMemo(
    () => getLastClosureToday(closures),
    [closures]
  );

  // ===== ACUMULADOS DEL DÍA =====
  const retirosAcumuladosDia = useMemo(
    () => getTotalRetirosAcumulados(closures, totalWithdrawals),
    [closures, totalWithdrawals]
  );

  const gastosAcumuladosDia = useMemo(
    () => getTotalGastosAcumulados(closures, totalExpenses),
    [closures, totalExpenses]
  );

  // ===== DINERO EN SISTEMA =====
  const dineroEnSistema = useMemo(
    () => calcularDineroEnSistema(summary, dineroInicial),
    [summary, dineroInicial]
  );

  // ===== DIFERENCIAS =====
  const diferencias = useMemo(() => {
    const conteo = {
      efectivo: efectivoContado,
      tarjeta: tarjetaContada,
      transferencia: transferenciaContada
    };
    const sistema = {
      efectivo: dineroEnSistema.efectivo,
      tarjeta: dineroEnSistema.tarjeta,
      transferencia: dineroEnSistema.transferencia
    };
    return calcularDiferencias(conteo, sistema);
  }, [efectivoContado, tarjetaContada, transferenciaContada, dineroEnSistema]);

  // ===== INGRESOS NUEVOS DE ESTE CORTE =====
  const ingresosNuevosEfectivo = efectivoContado;
  const ingresosNuevosTotales = useMemo(
    () => ingresosNuevosEfectivo + tarjetaContada + transferenciaContada,
    [ingresosNuevosEfectivo, tarjetaContada, transferenciaContada]
  );

  // ===== INGRESOS ACUMULADOS =====
  const ingresosAcumuladosDia = useMemo(
    () => calcularIngresosAcumulados(lastClosureToday, ingresosNuevosTotales),
    [lastClosureToday, ingresosNuevosTotales]
  );

  // ===== EFECTIVO DISPONIBLE =====
  const efectivoDisponible = useMemo(
    () => calcularEfectivoDisponible(lastClosureToday, efectivoContado, totalExpenses, totalWithdrawals),
    [lastClosureToday, efectivoContado, totalExpenses, totalWithdrawals]
  );

  // ===== GANANCIA DEL DÍA =====
  const gananciaDia = useMemo(
    () => calcularGananciaDia(ingresosAcumuladosDia, totalExpenses),
    [ingresosAcumuladosDia, totalExpenses]
  );

  // ===== EFECTIVO FINAL (para continuidad) =====
  const efectivoFinal = useMemo(
    () => calcularEfectivoFinal(lastClosureToday, efectivoContado, totalExpenses, totalWithdrawals),
    [lastClosureToday, efectivoContado, totalExpenses, totalWithdrawals]
  );

  return {
    // Resumen de órdenes
    summary,

    // Conteo
    efectivoContado,
    tarjetaContada,
    transferenciaContada,
    totalConteoIngresos,

    // Totales
    totalExpenses,
    totalWithdrawals,

    // Último corte y acumulados
    lastClosureToday,
    retirosAcumuladosDia,
    gastosAcumuladosDia,

    // Dinero en sistema
    dineroEnSistema,

    // Diferencias
    diferencias,

    // Ingresos
    ingresosNuevosTotales,
    ingresosAcumuladosDia,

    // Resultados finales
    efectivoDisponible,
    gananciaDia,
    efectivoFinal
  };
}
