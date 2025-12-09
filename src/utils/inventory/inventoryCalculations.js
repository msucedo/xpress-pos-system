/**
 * Funciones de cálculo para el módulo de inventario
 * Todas son funciones puras (sin efectos secundarios)
 */

/**
 * Calcula la ganancia y el porcentaje de ganancia entre precio de compra y venta
 * @param {number|string} purchasePrice - Precio de compra
 * @param {number|string} salePrice - Precio de venta
 * @returns {{profit: number, percentage: string}} Ganancia en monto y porcentaje
 */
export function calculateProfit(purchasePrice, salePrice) {
  const purchase = parseFloat(purchasePrice) || 0;
  const sale = parseFloat(salePrice) || 0;
  const profit = sale - purchase;
  const percentage = purchase > 0 ? ((profit / purchase) * 100).toFixed(1) : '0';

  return { profit, percentage };
}

/**
 * Genera un código de barras EAN-13 válido con dígito verificador
 * EAN-13 es un estándar de 13 dígitos usado internacionalmente
 * @returns {string} Código EAN-13 de 13 dígitos
 */
export function generateEAN13() {
  // Generar los primeros 12 dígitos aleatorios
  let digits = '';
  for (let i = 0; i < 12; i++) {
    digits += Math.floor(Math.random() * 10);
  }

  // Calcular el dígito verificador usando el algoritmo EAN-13
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(digits[i]);
    // Multiplicar por 1 si la posición es par (0, 2, 4...), por 3 si es impar (1, 3, 5...)
    sum += (i % 2 === 0) ? digit : digit * 3;
  }
  const checkDigit = (10 - (sum % 10)) % 10;

  // Generar el código EAN-13 completo
  return digits + checkDigit;
}
