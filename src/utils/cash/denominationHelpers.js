/**
 * Helpers y constantes para manejo de denominaciones de billetes y monedas
 */

// Denominaciones disponibles de billetes (en pesos mexicanos)
export const DENOMINACIONES_BILLETES = [1000, 500, 200, 100, 50, 20];

// Denominaciones disponibles de monedas (en pesos mexicanos)
export const DENOMINACIONES_MONEDAS = [10, 5, 2, 1, 0.5];

// Estado inicial para billetes
export const BILLETES_INITIAL_STATE = {
  1000: 0,
  500: 0,
  200: 0,
  100: 0,
  50: 0,
  20: 0
};

// Estado inicial para monedas
export const MONEDAS_INITIAL_STATE = {
  10: 0,
  5: 0,
  2: 0,
  1: 0,
  0.5: 0
};

/**
 * Calcula el total de billetes sumando denominación × cantidad
 *
 * @param {Object} billetes - Objeto con denominaciones como keys y cantidades como values
 * @returns {number} Total en pesos
 *
 * @example
 * const billetes = { 1000: 2, 500: 3, 200: 1 };
 * calcularTotalBilletes(billetes); // 3700
 */
export function calcularTotalBilletes(billetes) {
  let total = 0;

  Object.keys(billetes).forEach(denominacion => {
    const cantidad = parseInt(billetes[denominacion] || 0);
    const valor = parseFloat(denominacion);
    total += valor * cantidad;
  });

  return total;
}

/**
 * Calcula el total de monedas sumando denominación × cantidad
 *
 * @param {Object} monedas - Objeto con denominaciones como keys y cantidades como values
 * @returns {number} Total en pesos
 *
 * @example
 * const monedas = { 10: 5, 5: 2, 2: 3 };
 * calcularTotalMonedas(monedas); // 66
 */
export function calcularTotalMonedas(monedas) {
  let total = 0;

  Object.keys(monedas).forEach(denominacion => {
    const cantidad = parseInt(monedas[denominacion] || 0);
    const valor = parseFloat(denominacion);
    total += valor * cantidad;
  });

  return total;
}

/**
 * Calcula el total de efectivo (billetes + monedas)
 *
 * @param {Object} billetes - Objeto con denominaciones de billetes
 * @param {Object} monedas - Objeto con denominaciones de monedas
 * @returns {number} Total de efectivo en pesos
 */
export function calcularEfectivoContado(billetes, monedas) {
  const totalBilletes = calcularTotalBilletes(billetes);
  const totalMonedas = calcularTotalMonedas(monedas);

  return totalBilletes + totalMonedas;
}
