import { createContext, useState, useEffect, useRef, useMemo } from 'react';
import { usePromotions } from '../hooks/usePromotions';
import { useCartPromotions } from '../hooks/useCartPromotions';

export const CartContext = createContext();

const CART_STORAGE_KEY = 'cleanmaster_cart';

export const CartProvider = ({ children }) => {
  // Usar hook de React Query para promociones (subscripción compartida)
  const { data: allPromotions = [] } = usePromotions();

  // Estados básicos del carrito
  const [cartItems, setCartItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('amount'); // 'amount' o 'percentage'
  const [notes, setNotes] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Ref para debounce de guardado en localStorage
  const saveTimeoutRef = useRef(null);

  // Hook de promociones (encapsula toda la lógica de promociones)
  const promotionsData = useCartPromotions(cartItems, allPromotions, selectedClient);

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        setCartItems(parsed.items || []);
        setDiscount(parsed.discount || 0);
        setDiscountType(parsed.discountType || 'amount');
        setNotes(parsed.notes || '');
        setSelectedClient(parsed.selectedClient || null);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Guardar carrito en localStorage con debounce de 500ms
  useEffect(() => {
    // Limpiar timeout previo
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Guardar después de 500ms de inactividad
    saveTimeoutRef.current = setTimeout(() => {
      try {
        const cartData = {
          items: cartItems,
          discount,
          discountType,
          notes,
          selectedClient
        };
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }, 500);

    // Cleanup: cancelar timeout si el componente se desmonta
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [cartItems, discount, discountType, notes, selectedClient]);

  // ========== CRUD OPERATIONS ==========

  // Agregar producto al carrito
  const addProduct = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);

      if (existingItemIndex > -1) {
        // Si el producto ya existe, incrementar cantidad
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
        return newItems;
      } else {
        // Si es nuevo, agregarlo
        return [...prevItems, {
          id: product.id,
          name: product.name,
          barcode: product.barcode,
          salePrice: product.salePrice,
          purchasePrice: product.purchasePrice,
          emoji: product.emoji || '📦',
          stock: product.stock,
          quantity: quantity,
          images: product.images || []
        }];
      }
    });
    setIsCartOpen(true); // Abrir carrito automáticamente
  };

  // Eliminar producto del carrito
  const removeProduct = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Actualizar cantidad de un producto
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeProduct(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Aplicar descuento manual
  const applyDiscount = (value, type = 'amount') => {
    setDiscount(value);
    setDiscountType(type);
  };

  // Limpiar todo el carrito
  const clearCart = () => {
    setCartItems([]);
    setDiscount(0);
    setDiscountType('amount');
    setNotes('');
    setSelectedClient(null);
    // Limpiar promociones usando función del hook
    promotionsData.clearPromotions();
    // Carrito permanece abierto después de vaciarse
  };

  // ========== CALCULATIONS ==========

  // Calcular subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
  };

  // Calcular descuento en dinero
  const calculateDiscountAmount = () => {
    // Si hay promociones aplicadas, usar descuentos de promociones
    if (promotionsData.appliedPromotions.length > 0) {
      return promotionsData.calculatePromotionDiscount();
    }

    // Si no hay promociones, usar descuento manual
    const subtotal = calculateSubtotal();
    if (discountType === 'percentage') {
      return (subtotal * discount) / 100;
    }
    return discount;
  };

  // Calcular total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount();
    return Math.max(0, subtotal - discountAmount);
  };

  // Contar items en el carrito
  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Memoizar cálculos para evitar recalcular en cada render
  const subtotal = useMemo(() => calculateSubtotal(), [cartItems]);
  const discountAmount = useMemo(() => calculateDiscountAmount(), [discount, discountType, cartItems, promotionsData.appliedPromotions]);
  const total = useMemo(() => calculateTotal(), [cartItems, discount, discountType, promotionsData.appliedPromotions]);
  const itemCount = useMemo(() => getItemCount(), [cartItems]);

  // ========== CONTEXT VALUE ==========

  const value = {
    // Estados básicos
    cartItems,
    discount,
    discountType,
    notes,
    isCartOpen,
    selectedClient,

    // Setters de estados
    setNotes,
    setIsCartOpen,
    setSelectedClient,

    // CRUD operations
    addProduct,
    removeProduct,
    updateQuantity,
    applyDiscount,
    clearCart,

    // Cálculos memoizados
    subtotal,
    discountAmount,
    total,
    itemCount,

    // Datos de promociones (del hook)
    activePromotions: promotionsData.activePromotions,
    appliedPromotions: promotionsData.appliedPromotions,
    promotionValidations: promotionsData.promotionValidations,
    isPromotionRelevantForCart: promotionsData.isPromotionRelevantForCart,
    itemPromotionMap: promotionsData.itemPromotionMap
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
