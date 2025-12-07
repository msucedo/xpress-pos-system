/**
 * Utilidades para manejo de carrito
 * Extraído de OrderForm.jsx para reutilización
 */

/**
 * Genera un ID único para items del carrito
 * @returns {string} - ID único
 */
export function generateCartItemId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Agrega un servicio al carrito o incrementa su cantidad si ya existe
 * @param {Array} cart - Carrito actual
 * @param {Object} service - Servicio a agregar
 * @returns {Array} - Carrito actualizado
 */
export function addServiceToCart(cart, service) {
  // Buscar si ya existe un item con el mismo servicio
  const existingItemIndex = cart.findIndex(
    i => i.type === 'service' && i.serviceName === service.name
  );

  if (existingItemIndex !== -1) {
    // Si existe, incrementar la cantidad
    const updatedCart = [...cart];
    updatedCart[existingItemIndex] = {
      ...updatedCart[existingItemIndex],
      quantity: (updatedCart[existingItemIndex].quantity || 1) + 1
    };
    return updatedCart;
  } else {
    // Si no existe, agregar nuevo servicio con cantidad 1
    const newItem = {
      id: generateCartItemId(),
      serviceId: service.id, // Preservar ID original del servicio de Firebase
      type: 'service',
      serviceName: service.name,
      price: service.price,
      icon: service.emoji || '🛠️',
      quantity: 1,
      daysToAdd: service.daysToAdd
    };
    return [...cart, newItem];
  }
}

/**
 * Agrega un producto al carrito o incrementa su cantidad si ya existe
 * @param {Array} cart - Carrito actual
 * @param {Object} product - Producto a agregar
 * @returns {Object} - { cart: Array, error: string|null }
 */
export function addProductToCart(cart, product) {
  // Buscar si ya existe un item con el mismo producto
  const existingItemIndex = cart.findIndex(
    i => i.type === 'product' && i.productId === product.id
  );

  if (existingItemIndex !== -1) {
    // Verificar que no exceda el stock disponible
    const currentQuantity = cart[existingItemIndex].quantity || 1;
    if (currentQuantity < product.stock) {
      // Si existe y hay stock, incrementar la cantidad
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: currentQuantity + 1
      };
      return { cart: updatedCart, error: null };
    } else {
      // Stock insuficiente
      return {
        cart,
        error: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`
      };
    }
  } else {
    // Si no existe, agregar nuevo producto con cantidad 1
    const newItem = {
      id: generateCartItemId(),
      type: 'product',
      productId: product.id,
      name: product.name,
      price: product.salePrice,
      purchasePrice: product.purchasePrice,
      sku: product.sku,
      barcode: product.barcode,
      category: product.category,
      emoji: product.emoji,
      icon: product.emoji || '📦',
      quantity: 1,
      maxStock: product.stock
    };
    return { cart: [...cart, newItem], error: null };
  }
}

/**
 * Elimina o decrementa un item del carrito
 * @param {Array} cart - Carrito actual
 * @param {string} itemId - ID del item a remover
 * @returns {Array} - Carrito actualizado
 */
export function removeFromCart(cart, itemId) {
  const item = cart.find(i => i.id === itemId);

  if (item && item.quantity > 1) {
    // Si tiene más de 1, decrementar cantidad
    return cart.map(i =>
      i.id === itemId
        ? { ...i, quantity: i.quantity - 1 }
        : i
    );
  } else {
    // Si solo tiene 1, eliminar del carrito
    return cart.filter(i => i.id !== itemId);
  }
}

/**
 * Expande servicios con cantidades a servicios individuales (para crear orden)
 * @param {Array} cart - Items del carrito
 * @returns {Array} - Servicios individuales expandidos
 */
export function expandServicesForOrder(cart) {
  const serviceItems = cart.filter(item => item.type === 'service');

  return serviceItems.flatMap(item => {
    const expandedServices = [];
    for (let i = 0; i < (item.quantity || 1); i++) {
      expandedServices.push({
        id: generateCartItemId(),
        serviceId: item.serviceId, // ID del servicio en Firestore
        serviceName: item.serviceName, // Snapshot del nombre
        price: item.price,
        icon: item.icon,
        images: [], // Servicios sin imágenes individuales
        notes: '',
        status: 'pending'
      });
    }
    return expandedServices;
  });
}

/**
 * Transforma productos del carrito a formato de orden (con snapshot de datos)
 * @param {Array} cart - Items del carrito
 * @returns {Array} - Productos en formato de orden
 */
export function transformProductsForOrder(cart) {
  const productItems = cart.filter(item => item.type === 'product');

  return productItems.map(item => ({
    id: generateCartItemId(),
    productId: item.productId,
    name: item.name,
    salePrice: item.price,
    purchasePrice: item.purchasePrice,
    sku: item.sku,
    barcode: item.barcode,
    category: item.category,
    emoji: item.emoji,
    quantity: item.quantity
  }));
}

/**
 * Detecta si el carrito tiene servicio express
 * @param {Array} cart - Items del carrito
 * @returns {boolean} - true si hay servicio express
 */
export function hasExpressService(cart) {
  const serviceItems = cart.filter(item => item.type === 'service');
  return serviceItems.some(item =>
    item.serviceName?.toLowerCase() === 'servicio express'
  );
}
