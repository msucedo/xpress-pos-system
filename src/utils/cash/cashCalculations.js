/**
 * Funciones puras para cálculos financieros de corte de caja
 */

/**
 * Calcula resumen financiero basado en las órdenes del periodo
 *
 * @param {Array<Object>} orders - Array de órdenes
 * @returns {Object} Resumen con totales por método de pago
 *
 * @example
 * const summary = calculateOrdersSummary(orders);
 * // { totalIncome: 5000, cashIncome: 2000, cardIncome: 2000, ... }
 */
export function calculateOrdersSummary(orders) {
  let totalIncome = 0;
  let cashIncome = 0;
  let cardIncome = 0;
  let transferIncome = 0;
  let totalOrders = 0;
  let totalProductos = 0;

  orders.forEach(order => {
    const total = parseFloat(order.totalPrice) || 0;
    const advance = parseFloat(order.advancePayment) || 0;

    // Determine amount to count based on payment status
    let amountToCount = 0;
    if (order.paymentStatus === 'paid') {
      // If fully paid, count the total amount
      amountToCount = total;
    } else if (order.paymentStatus === 'partial') {
      // If partial, count only the advance
      amountToCount = advance;
    }
    // If pending, amountToCount stays 0

    totalIncome += amountToCount;
    totalOrders++;

    // Count products sold
    totalProductos += order.products?.reduce((sum, p) => sum + (p.quantity || 0), 0) || 0;

    // Count by payment method
    if (order.paymentMethod === 'cash' && amountToCount > 0) {
      cashIncome += amountToCount;
    } else if (order.paymentMethod === 'card' && amountToCount > 0) {
      cardIncome += amountToCount;
    } else if (order.paymentMethod === 'transfer' && amountToCount > 0) {
      transferIncome += amountToCount;
    }
  });

  return {
    totalIncome,
    cashIncome,
    cardIncome,
    transferIncome,
    totalOrders,
    totalProductos
  };
}

/**
 * Calcula total de cobros con tarjeta
 *
 * @param {Array<Object>} cobrosTarjeta - Array de cobros con tarjeta
 * @param {number} cobrosTarjeta[].monto - Monto del cobro
 * @param {string} cobrosTarjeta[].tipo - Tipo (debito/credito)
 * @returns {number} Total de tarjeta
 */
export function calcularTotalTarjeta(cobrosTarjeta) {
  return cobrosTarjeta.reduce((sum, cobro) => {
    return sum + (parseFloat(cobro.monto) || 0);
  }, 0);
}

/**
 * Calcula total de transferencias
 *
 * @param {Array<Object>} transferencias - Array de transferencias
 * @param {number} transferencias[].monto - Monto de la transferencia
 * @returns {number} Total de transferencias
 */
export function calcularTotalTransferencias(transferencias) {
  return transferencias.reduce((sum, trans) => {
    return sum + (parseFloat(trans.monto) || 0);
  }, 0);
}

/**
 * Calcula diferencias entre dinero contado y dinero en sistema
 *
 * @param {Object} conteo - Dinero contado físicamente
 * @param {number} conteo.efectivo - Total efectivo contado
 * @param {number} conteo.tarjeta - Total tarjeta contado
 * @param {number} conteo.transferencia - Total transferencia contado
 * @param {Object} sistema - Dinero registrado en sistema
 * @param {number} sistema.efectivo - Total efectivo en sistema
 * @param {number} sistema.tarjeta - Total tarjeta en sistema
 * @param {number} sistema.transferencia - Total transferencia en sistema
 * @returns {Object} Diferencias por método de pago
 */
export function calcularDiferencias(conteo, sistema) {
  const diferenciaEfectivo = conteo.efectivo - sistema.efectivo;
  const diferenciaTarjeta = conteo.tarjeta - sistema.tarjeta;
  const diferenciaTransferencia = conteo.transferencia - sistema.transferencia;
  const diferenciasTotal = diferenciaEfectivo + diferenciaTarjeta + diferenciaTransferencia;

  return {
    efectivo: diferenciaEfectivo,
    tarjeta: diferenciaTarjeta,
    transferencia: diferenciaTransferencia,
    total: diferenciasTotal
  };
}

/**
 * Calcula efectivo disponible actual
 * Fórmula: Efectivo del corte anterior + Efectivo contado nuevo - Gastos - Retiros
 *
 * @param {Object} lastClosure - Último corte del día (null si es el primero)
 * @param {number} efectivoContado - Efectivo contado en este corte
 * @param {number} totalGastos - Total de gastos
 * @param {number} totalRetiros - Total de retiros
 * @returns {number} Efectivo disponible
 */
export function calcularEfectivoDisponible(lastClosure, efectivoContado, totalGastos, totalRetiros) {
  const efectivoAnterior = lastClosure?.efectivoFinal || 0;
  return efectivoAnterior + efectivoContado - totalGastos - totalRetiros;
}

/**
 * Calcula ingresos acumulados del día (todos los cortes)
 *
 * @param {Object} lastClosure - Último corte del día (null si es el primero)
 * @param {number} ingresosNuevos - Ingresos nuevos de este corte
 * @returns {number} Ingresos acumulados del día
 */
export function calcularIngresosAcumulados(lastClosure, ingresosNuevos) {
  const ingresosAnteriores = lastClosure?.resultados?.ingresosTotal || 0;
  return ingresosAnteriores + ingresosNuevos;
}

/**
 * Calcula ganancia del día
 * Fórmula: Total Ingresos - Gastos
 *
 * @param {number} ingresos - Total de ingresos del día
 * @param {number} gastos - Total de gastos del día
 * @returns {number} Ganancia del día
 */
export function calcularGananciaDia(ingresos, gastos) {
  return ingresos - gastos;
}

/**
 * Calcula dinero en sistema (ventas registradas)
 *
 * @param {Object} summary - Resumen de órdenes (de calculateOrdersSummary)
 * @param {number} dineroInicial - Dinero inicial en caja
 * @returns {Object} Dinero en sistema por método de pago
 */
export function calcularDineroEnSistema(summary, dineroInicial) {
  const dineroInicialNum = parseFloat(dineroInicial) || 0;

  return {
    efectivo: summary.cashIncome + dineroInicialNum,
    tarjeta: summary.cardIncome,
    transferencia: summary.transferIncome,
    total: summary.cashIncome + dineroInicialNum + summary.cardIncome + summary.transferIncome
  };
}

/**
 * Calcula efectivo final para continuidad entre cortes
 * Fórmula: Efectivo del corte anterior + Efectivo nuevo contado - Gastos - Retiros
 *
 * @param {Object} lastClosure - Último corte del día
 * @param {number} efectivoContado - Efectivo contado en este corte
 * @param {number} totalGastos - Total de gastos
 * @param {number} totalRetiros - Total de retiros
 * @returns {number} Efectivo final
 */
export function calcularEfectivoFinal(lastClosure, efectivoContado, totalGastos, totalRetiros) {
  const efectivoAnterior = lastClosure?.efectivoFinal || 0;
  return efectivoAnterior + efectivoContado - totalGastos - totalRetiros;
}
