/**
 * Helpers para manejo de cierres de caja
 */

/**
 * Obtiene el último corte de caja del día actual
 *
 * @param {Array<Object>} closures - Array de todos los cierres
 * @returns {Object|null} Último cierre del día o null si no existe
 */
export function getLastClosureToday(closures) {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const todayClosures = closures.filter(closure => {
    if (!closure.fechaCorte) return false;
    const closureDate = new Date(closure.fechaCorte);
    return closureDate >= startDate && closureDate <= endDate;
  });

  // Sort by fechaCorte descending and return the most recent
  if (todayClosures.length > 0) {
    return todayClosures.sort((a, b) => new Date(b.fechaCorte) - new Date(a.fechaCorte))[0];
  }

  return null;
}

/**
 * Obtiene el rango de fechas para el día actual
 *
 * @returns {Object} Objeto con startDate y endDate en ISO string
 */
export function getDateRange() {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  return {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  };
}

/**
 * Calcula total de retiros acumulados del día (todos los cortes + retiros actuales)
 *
 * @param {Array<Object>} closures - Array de todos los cierres
 * @param {number} currentWithdrawalsTotal - Total de retiros actuales no guardados
 * @returns {number} Total de retiros acumulados del día
 */
export function getTotalRetirosAcumulados(closures, currentWithdrawalsTotal) {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const todayClosures = closures.filter(closure => {
    if (!closure.fechaCorte) return false;
    const closureDate = new Date(closure.fechaCorte);
    return closureDate >= startDate && closureDate <= endDate;
  });

  const retirosGuardados = todayClosures.reduce((sum, closure) => {
    return sum + (parseFloat(closure.resultados?.retirosTotal) || 0);
  }, 0);

  return retirosGuardados + currentWithdrawalsTotal;
}

/**
 * Calcula total de gastos acumulados del día (todos los cortes + gastos actuales)
 *
 * @param {Array<Object>} closures - Array de todos los cierres
 * @param {number} currentExpensesTotal - Total de gastos actuales no guardados
 * @returns {number} Total de gastos acumulados del día
 */
export function getTotalGastosAcumulados(closures, currentExpensesTotal) {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const todayClosures = closures.filter(closure => {
    if (!closure.fechaCorte) return false;
    const closureDate = new Date(closure.fechaCorte);
    return closureDate >= startDate && closureDate <= endDate;
  });

  const gastosGuardados = todayClosures.reduce((sum, closure) => {
    return sum + (parseFloat(closure.resultados?.gastosTotal) || 0);
  }, 0);

  return gastosGuardados + currentExpensesTotal;
}

/**
 * Construye el objeto de datos completo para guardar un cierre de caja
 *
 * @param {Object} params - Parámetros necesarios para construir el cierre
 * @param {Object} params.employee - Empleado que realiza el corte
 * @param {number} params.dineroInicial - Dinero inicial en caja
 * @param {number} params.efectivoFinal - Efectivo final (para continuidad)
 * @param {Object} params.billetes - Conteo de billetes
 * @param {Object} params.monedas - Conteo de monedas
 * @param {number} params.efectivoContado - Total efectivo contado
 * @param {Array} params.cobrosTarjeta - Array de cobros con tarjeta
 * @param {number} params.tarjetaContada - Total tarjeta contado
 * @param {Array} params.transferencias - Array de transferencias
 * @param {number} params.transferenciaContada - Total transferencia contado
 * @param {number} params.totalConteoIngresos - Total general del conteo
 * @param {Object} params.dineroEnSistema - Dinero registrado en sistema
 * @param {Object} params.diferencias - Diferencias conteo vs sistema
 * @param {Array} params.expenses - Array de gastos
 * @param {number} params.totalExpenses - Total de gastos
 * @param {Array} params.withdrawals - Array de retiros
 * @param {number} params.totalWithdrawals - Total de retiros
 * @param {number} params.ingresosAcumuladosDia - Ingresos acumulados del día
 * @param {number} params.gananciaDia - Ganancia del día
 * @param {Array} params.orders - Array de órdenes
 * @param {Object} params.summary - Resumen de órdenes
 * @param {string} params.notes - Notas del corte
 * @returns {Object} Objeto de cierre completo listo para guardar
 */
export function buildClosureData(params) {
  const {
    employee,
    dineroInicial,
    efectivoFinal,
    billetes,
    monedas,
    efectivoContado,
    cobrosTarjeta,
    tarjetaContada,
    transferencias,
    transferenciaContada,
    totalConteoIngresos,
    dineroEnSistema,
    diferencias,
    expenses,
    totalExpenses,
    withdrawals,
    totalWithdrawals,
    ingresosAcumuladosDia,
    gananciaDia,
    orders,
    summary,
    notes
  } = params;

  const { startDate, endDate } = getDateRange();

  return {
    autor: {
      id: employee.id,
      nombre: employee.name
    },
    fechaCorte: new Date().toISOString(),
    periodo: {
      inicio: startDate,
      fin: endDate,
      tipo: 'hoy'
    },
    // Dinero inicial
    dineroInicial: dineroInicial,
    // Efectivo final (para continuidad entre cortes)
    efectivoFinal: efectivoFinal,
    // Conteo de ingresos (lo que el usuario contó físicamente)
    conteoIngresos: {
      efectivo: {
        billetes: { ...billetes },
        monedas: { ...monedas },
        total: efectivoContado
      },
      tarjeta: {
        cobros: cobrosTarjeta.map(c => ({ monto: parseFloat(c.monto) || 0, tipo: c.tipo })),
        total: tarjetaContada
      },
      transferencia: {
        transferencias: transferencias.map(t => parseFloat(t.monto) || 0),
        total: transferenciaContada
      },
      totalGeneral: totalConteoIngresos
    },
    // Dinero en sistema (lo que el sistema tiene registrado)
    dineroEnSistema: {
      efectivo: dineroEnSistema.efectivo,
      tarjeta: dineroEnSistema.tarjeta,
      transferencia: dineroEnSistema.transferencia,
      total: dineroEnSistema.total
    },
    // Diferencias (contado vs sistema)
    diferencias: {
      efectivo: diferencias.efectivo,
      tarjeta: diferencias.tarjeta,
      transferencia: diferencias.transferencia,
      total: diferencias.total
    },
    // Gastos
    gastos: {
      items: expenses.map(e => ({ ...e })),
      total: totalExpenses
    },
    // Retiros
    retiros: {
      items: withdrawals.map(w => ({ ...w })),
      total: totalWithdrawals
    },
    // Resultados finales
    resultados: {
      ingresosTotal: ingresosAcumuladosDia,
      gastosTotal: totalExpenses,
      retirosTotal: totalWithdrawals,
      gananciaDia: gananciaDia
    },
    // Info adicional
    ordenes: orders.map(o => o.id),
    totalOrdenes: summary.totalOrders,
    totalProductos: summary.totalProductos,
    notas: notes
  };
}

/**
 * Valida que un cierre de caja tenga todos los datos necesarios
 *
 * @param {Object} employee - Empleado seleccionado
 * @param {Array} orders - Array de órdenes
 * @param {number} diferenciasTotal - Total de diferencias
 * @param {boolean} habilitarCorteSinValidacion - Flag para permitir corte sin validaciones
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateClosureData(employee, orders, diferenciasTotal, habilitarCorteSinValidacion) {
  // Validar que hay empleado seleccionado
  if (!employee) {
    return {
      isValid: false,
      error: 'Por favor selecciona el empleado que realiza el corte'
    };
  }

  // Si el checkbox de corte sin validación está habilitado, permitir
  if (habilitarCorteSinValidacion) {
    return { isValid: true, error: null };
  }

  // Validar que hay órdenes
  if (orders.length === 0) {
    return {
      isValid: false,
      error: 'No hay órdenes para cerrar el corte. Habilita la opción de corte sin validaciones si deseas continuar.'
    };
  }

  // Validar que no hay diferencias
  if (diferenciasTotal !== 0) {
    return {
      isValid: false,
      error: `Hay diferencias de ${diferenciasTotal >= 0 ? 'sobrante' : 'faltante'} en el dinero contado vs sistema. Habilita la opción de corte sin validaciones si deseas continuar.`
    };
  }

  return { isValid: true, error: null };
}
