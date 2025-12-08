# Guía de Refactorización - Xpress POS System

## Resumen Ejecutivo

Este documento detalla el proceso de refactorización aplicado a **OrderForm.jsx** y proporciona una guía paso a paso para continuar refactorizando los demás componentes grandes del sistema.

### Logros Alcanzados

- **OrderForm.jsx**: Reducido de 1,368 líneas a 498 líneas (63.5% de reducción)
- **OrderDetailView.jsx**: Reducido de 1,328 líneas a 454 líneas (66% de reducción)
- **OrderHistory.jsx**: Reducido de 1,280 líneas a 120 líneas (90.6% de reducción)
- **CashRegister.jsx**: Reducido de 1,241 líneas a 284 líneas (77.1% de reducción)
- **PromotionForm.jsx**: Reducido de 1,226 líneas a 195 líneas (84.1% de reducción)
- **OrderFormMobile.jsx**: Reducido de 1,140 líneas a 586 líneas (48.6% de reducción)
- **70+ archivos nuevos creados**: Utilidades, hooks personalizados, componentes modulares
- **CERO duplicación**: OrderFormMobile reutiliza 100% de hooks y utils de OrderForm
- **Bug crítico resuelto**: Infinite loop en validación de promociones
- **Arquitectura modular**: Código organizado, testeable y reutilizable
- **Reutilización de código**: Hooks y utilidades compartidas entre componentes

---

## Índice

1. [Cambios Realizados](#cambios-realizados)
2. [Estructura Nueva](#estructura-nueva)
3. [Patrón de Refactorización](#patrón-de-refactorización)
4. [Próximos Archivos](#próximos-archivos-a-refactorizar)
5. [Guía Paso a Paso](#guía-paso-a-paso)
6. [Errores Comunes y Soluciones](#errores-comunes-y-soluciones)
7. [Mejores Prácticas](#mejores-prácticas)

---

## Cambios Realizados

### Archivo Refactorizado

#### OrderForm.jsx
- **Antes**: 1,368 líneas - componente monolítico con toda la lógica mezclada
- **Después**: 498 líneas - componente orquestador que usa hooks y componentes pequeños
- **Respaldo**: `src/components/OrderForm.ORIGINAL.jsx` (preservado para referencia)

### Archivos Creados

#### Utilidades (src/utils/)

1. **`promotions/promotionHelpers.js`** (230 líneas)
   - `isPromotionRelevantForCart()` - Determina si una promoción aplica al carrito
   - `getPromotionPriority()` - Calcula prioridad de promociones (1-3)
   - `getItemsWithPromoBadge()` - Identifica items que deben mostrar badge de promo

2. **`promotions/promotionCalculations.js`** (45 líneas)
   - `calculateSubtotal()` - Suma total de items en carrito
   - `calculateTotalDiscount()` - Suma total de descuentos aplicados
   - `calculateTotalPrice()` - Calcula precio final después de descuentos
   - `calculateTotalItems()` - Cuenta total de items considerando cantidades

3. **`cart/cartHelpers.js`** (188 líneas)
   - `generateCartItemId()` - Genera IDs únicos para items del carrito
   - `addServiceToCart()` - Agrega servicio o incrementa cantidad
   - `addProductToCart()` - Agrega producto con validación de stock
   - `expandServicesForOrder()` - Expande items con cantidad para Firebase
   - `hasExpressService()` - Detecta si hay servicio express

4. **`employees/employeeHelpers.js`** (43 líneas)
   - `getEmployeeOrderCount()` - Cuenta órdenes activas por empleado
   - `autoSelectEmployeeWithLeastOrders()` - Auto-asigna empleado con menos carga

#### Hooks Personalizados (src/hooks/)

1. **`usePromotionsCalculation.js`** (64 líneas)
   - Maneja validación y cálculo de promociones aplicables
   - **IMPORTANTE**: Usa `useCallback` para evitar infinite loops
   - Retorna: `{ appliedPromotions, promotionValidations, refetchPromotions }`

2. **`useOrderFormData.js`** (100+ líneas)
   - Maneja estado del formulario y validaciones
   - Retorna: `{ formData, errors, handleChange, validateForm, ... }`

3. **`useCartManagement.js`** (80+ líneas)
   - Maneja estado del carrito (agregar, eliminar items)
   - Retorna: `{ cart, setCart, handleAddToCart, handleRemoveFromCart }`

4. **`useEmployeeAssignment.js`** (30+ líneas)
   - Maneja selección y auto-asignación de empleados
   - Retorna: `{ selectedEmployee, setSelectedEmployee }`

5. **`useOrderImages.js`** (15 líneas)
   - Maneja estado de imágenes de la orden
   - Retorna: `{ orderImages, setOrderImages }`

#### Componentes UI (src/components/orders/)

1. **`CustomerInfoSection.jsx`** - Formulario de información del cliente
2. **`ServiceSelector.jsx`** - Grid de servicios disponibles
3. **`ProductSelector.jsx`** - Grid de productos disponibles
4. **`CartItem.jsx`** - Item individual del carrito con promoción
5. **`PromotionsBanner.jsx`** - Banner de promociones disponibles/aplicadas
6. **`EmployeeAssignment.jsx`** - Selector de empleado con carga de trabajo
7. **`CartSummary.jsx`** - Resumen completo del carrito
8. **`PaymentSection.jsx`** - Formulario de pago y fecha de entrega
9. **`PhotoUploadSection.jsx`** - Sección de carga de fotos

---

## Estructura Nueva

```
xpress-pos-system/
├── src/
│   ├── components/
│   │   ├── OrderForm.jsx                    # Refactorizado (498 líneas)
│   │   ├── OrderForm.ORIGINAL.jsx           # Backup (1,368 líneas)
│   │   └── orders/                          # NUEVO directorio
│   │       ├── CustomerInfoSection.jsx
│   │       ├── ServiceSelector.jsx
│   │       ├── ProductSelector.jsx
│   │       ├── CartItem.jsx
│   │       ├── PromotionsBanner.jsx
│   │       ├── EmployeeAssignment.jsx
│   │       ├── CartSummary.jsx
│   │       ├── PaymentSection.jsx
│   │       └── PhotoUploadSection.jsx
│   │
│   ├── hooks/                               # NUEVO directorio
│   │   ├── usePromotionsCalculation.js
│   │   ├── useOrderFormData.js
│   │   ├── useCartManagement.js
│   │   ├── useEmployeeAssignment.js
│   │   └── useOrderImages.js
│   │
│   └── utils/
│       ├── promotions/                      # NUEVO directorio
│       │   ├── promotionHelpers.js
│       │   └── promotionCalculations.js
│       ├── cart/                            # NUEVO directorio
│       │   └── cartHelpers.js
│       └── employees/                       # NUEVO directorio
│           └── employeeHelpers.js
│
└── REFACTORING_GUIDE.md                     # Este documento
```

---

## Patrón de Refactorización

Este es el patrón probado y exitoso aplicado a OrderForm.jsx. Seguir estos pasos para refactorizar otros componentes grandes.

### Fase 1: Extracción de Utilidades (Pure Functions)

**Objetivo**: Extraer toda la lógica de negocio pura (sin dependencias de React)

**Proceso**:
1. Identificar funciones puras en el componente
2. Agrupar por dominio (cart, promotions, employees, etc.)
3. Crear archivos en `src/utils/[dominio]/[nombre]Helpers.js`
4. Exportar como named exports
5. Importar dinámicamente cuando sea posible para code splitting

**Ejemplo**:
```javascript
// ❌ ANTES: Dentro del componente
const calculateSubtotal = () => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

// ✅ DESPUÉS: src/utils/promotions/promotionCalculations.js
export const calculateSubtotal = (cart) => {
  return cart.reduce((total, item) =>
    total + (item.price || 0) * (item.quantity || 1), 0);
};
```

**Beneficios**:
- Funciones testables sin mockear React
- Reutilizables en otros componentes
- Sin efectos secundarios

### Fase 2: Creación de Custom Hooks

**Objetivo**: Encapsular lógica con estado de React

**Proceso**:
1. Identificar grupos de `useState` relacionados
2. Identificar `useEffect` y su lógica asociada
3. Crear hooks en `src/hooks/use[Funcionalidad].js`
4. Extraer validaciones y transformaciones
5. **CRUCIAL**: Usar `useCallback` para funciones que se pasan a `useEffect`

**Ejemplo**:
```javascript
// ❌ ANTES: Dentro del componente (causa infinite loop)
const [cart, setCart] = useState([]);

const addToCart = (item) => {
  setCart(prev => [...prev, item]);
};

useEffect(() => {
  validateCart();
}, [cart]); // Se recrea en cada render

// ✅ DESPUÉS: src/hooks/useCartManagement.js
export function useCartManagement(initialData = null) {
  const [cart, setCart] = useState([]);

  const handleAddToCart = useCallback((item, type = 'service') => {
    if (type === 'service') {
      setCart(prev => addServiceHelper(prev, item));
    }
  }, []); // Memoizado, no cambia

  return { cart, setCart, handleAddToCart };
}
```

**Patrón crítico para evitar infinite loops**:
```javascript
// Paso 1: Memoizar funciones asíncronas con useCallback
const checkApplicablePromotions = useCallback(async () => {
  // ... lógica asíncrona
}, [cart, clientPhone, activePromotions]); // Dependencias reales

// Paso 2: useEffect depende de la función memoizada, no de las dependencias directas
useEffect(() => {
  checkApplicablePromotions();
}, [checkApplicablePromotions]); // ✅ Solo cambia cuando dependencias cambian
```

### Fase 3: Creación de Componentes UI

**Objetivo**: Dividir el UI en componentes pequeños y enfocados

**Proceso**:
1. Identificar secciones visuales independientes
2. Crear componentes en `src/components/[dominio]/[ComponentName].jsx`
3. Componentes deben recibir datos vía props (no leer contexto directamente)
4. Cada componente debe tener una responsabilidad única
5. Usar PropTypes o TypeScript para documentar props

**Ejemplo**:
```javascript
// ✅ Componente enfocado y reutilizable
export function CartItem({ item, assignedPromo, onRemove }) {
  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <span className="cart-item-name">{item.name}</span>
        {assignedPromo && (
          <span className="promo-badge">{assignedPromo.name}</span>
        )}
      </div>
      <button onClick={() => onRemove(item.id)}>Eliminar</button>
    </div>
  );
}
```

**Principios**:
- Máximo 150 líneas por componente
- Single Responsibility Principle
- Props explícitas y bien nombradas
- No más de 7-8 props (considerar objeto si son más)

### Fase 4: Refactorización del Componente Principal

**Objetivo**: Convertir el componente monolítico en orquestador

**Proceso**:
1. Crear backup: `[ComponentName].ORIGINAL.jsx`
2. Importar todos los hooks personalizados
3. Importar todos los componentes UI
4. Mantener solo:
   - Llamadas a hooks
   - Cálculos derivados (con `useMemo` si son costosos)
   - Lógica de coordinación entre secciones
   - Estructura JSX de alto nivel
5. Pasar datos via props a componentes hijos

**Ejemplo**:
```javascript
// ✅ Componente orquestador limpio
const OrderForm = ({ onSubmit, onCancel, initialData, employees, allOrders }) => {
  // Hooks personalizados
  const { formData, errors, handleChange, validateForm } = useOrderFormData(initialData);
  const { cart, handleAddToCart, handleRemoveFromCart } = useCartManagement(initialData);
  const { appliedPromotions, promotionValidations } = usePromotionsCalculation(
    cart, formData.phone, activePromotions
  );
  const { selectedEmployee, setSelectedEmployee } = useEmployeeAssignment(employees, allOrders);
  const { orderImages, setOrderImages } = useOrderImages();

  // Estado UI local
  const [showPayment, setShowPayment] = useState(false);

  // Cálculos derivados (memoizados si son costosos)
  const subtotal = useMemo(() => calculateSubtotal(cart), [cart]);
  const totalPrice = useMemo(() =>
    calculateTotalPrice(cart, appliedPromotions),
    [cart, appliedPromotions]
  );

  // Handlers de coordinación
  const handleSubmitOrder = async () => {
    if (!validateForm()) return;
    // Coordinar datos de múltiples hooks
    await onSubmit({
      ...formData,
      cart: expandServicesForOrder(cart),
      images: orderImages,
      employeeId: selectedEmployee?.id,
      totalPrice
    });
  };

  return (
    <div className="order-form-container">
      <CustomerInfoSection
        formData={formData}
        errors={errors}
        onClientChange={handleChange}
        onSelectClient={handleSelectClient}
      />
      <ServiceSelector services={services} onAddToCart={handleAddToCart} />
      <CartSummary
        cart={cart}
        onRemoveFromCart={handleRemoveFromCart}
        appliedPromotions={appliedPromotions}
        totalPrice={totalPrice}
        selectedEmployee={selectedEmployee}
        onSelectEmployee={setSelectedEmployee}
      />
      <PaymentSection
        formData={formData}
        totalPrice={totalPrice}
        onChange={handleChange}
        onSubmit={handleSubmitOrder}
      />
    </div>
  );
};
```

---

## Refactorización de OrderHistory.jsx

### Resumen de la Refactorización

**Archivo**: `src/components/OrderHistory.jsx`
**Reducción**: 1,280 líneas → 120 líneas (90.6% de reducción)
**Fecha**: Diciembre 2025
**Commit**: Refactor OrderHistory.jsx: Modular architecture (1,280 → 120 lines)

### Archivos Creados

#### Utilidades Extendidas

1. **`src/utils/payments/paymentHelpers.js`** - Extendido
   - `getPaymentStatusLabel()` - Labels de estados de pago
   - `formatCurrency()` - Formateo de moneda

2. **`src/utils/orders/orderHelpers.js`** - Extendido
   - `formatDate()` - Formateo de fechas con manejo de timezones
   - `combineAndSortOrders()` - Combina y ordena órdenes por número
   - `extractUniqueServices()` - Extrae servicios únicos
   - `getAuthorInfo()` - Info del autor con employee matching
   - `getServiceIcons()` - Agrupa y cuenta íconos de servicios

3. **`src/utils/orders/statusHelpers.js`** - Extendido
   - `getOrderStatusLabel()` - Labels de estados de órdenes

#### Utilidades Nuevas

4. **`src/utils/history/filterHelpers.js`** (200 líneas)
   - `applyOrderFilters()` - Lógica completa de filtrado con 11 filtros
   - `hasActiveFilter()` - Verifica si columna tiene filtro activo
   - `getActiveFiltersCount()` - Cuenta filtros activos
   - `clearColumnFilter()` - Limpia filtro específico

5. **`src/utils/history/filterConstants.js`** (60 líneas)
   - `INITIAL_FILTERS` - Estado inicial de filtros
   - `STATUS_OPTIONS`, `PAYMENT_STATUS_OPTIONS`, `PAYMENT_METHOD_OPTIONS`
   - `ITEMS_PER_PAGE` - Constante de paginación

#### Hooks Personalizados

1. **`src/hooks/useOrdersData.js`** (40 líneas)
   - Suscripciones a Firebase (orders y employees)
   - Retorna: `{ orders, employees, loading }`

2. **`src/hooks/useOrderFilters.js`** (60 líneas)
   - Maneja estado de filtros y órdenes filtradas
   - Usa helpers de filterHelpers.js
   - Retorna: `{ filters, filteredOrders, activeFiltersCount, handlers }`

3. **`src/hooks/usePagination.js`** (50 líneas) - **GENÉRICO REUTILIZABLE**
   - Hook de paginación para cualquier array de datos
   - Retorna: `{ currentPage, totalPages, paginatedData, goToNextPage, goToPreviousPage }`

4. **`src/hooks/useDropdownState.js`** (50 líneas)
   - Maneja dropdown con click outside detection
   - Lógica especial para date pickers
   - Retorna: `{ openDropdown, toggleDropdown, dropdownRef }`

5. **`src/hooks/useImageModal.js`** - **REUTILIZADO** (ya existente)
   - Preview de imágenes
   - Retorna: `{ selectedImage, openImageModal, closeImageModal }`

#### Componentes UI

1. **`src/components/history/FilterDropdown.jsx`** (280 líneas)
   - Componente memoizado con 11 tipos de filtros
   - Usa constantes de filterConstants.js

2. **`src/components/history/ImagePreviewModal.jsx`** (20 líneas)
   - Modal simple para preview de imagen

3. **`src/components/history/EmptyState.jsx`** (15 líneas)
   - Estado vacío reutilizable

4. **`src/components/history/FilterControlsBar.jsx`** (60 líneas)
   - Contador de resultados + botón limpiar filtros + paginación

5. **`src/components/history/OrderRow.jsx`** (80 líneas)
   - Fila individual de tabla con 11 columnas
   - Usa formatters de utils

6. **`src/components/history/OrdersTableHeader.jsx`** (300 líneas)
   - Header con 11 columnas y botones de filtro

7. **`src/components/history/OrdersTable.jsx`** (50 líneas)
   - Wrapper de tabla completa

### Componente Principal Refactorizado

```javascript
// src/components/OrderHistory.jsx (120 líneas)
const OrderHistory = () => {
  // Hooks de datos
  const { orders, employees, loading } = useOrdersData();

  // Combinar y ordenar órdenes
  const allOrders = useMemo(() => combineAndSortOrders(orders), [orders]);

  // Extraer servicios únicos
  const uniqueServices = useMemo(() => extractUniqueServices(allOrders), [allOrders]);

  // Hooks de filtros
  const {
    filters, filteredOrders, activeFiltersCount,
    handleClearFilters, clearColumnFilter, toggleCheckbox, hasActiveFilter
  } = useOrderFilters(allOrders, employees);

  // Hook de paginación (GENÉRICO - reutilizable)
  const { currentPage, totalPages, paginatedData, goToNextPage, goToPreviousPage }
    = usePagination(filteredOrders, ITEMS_PER_PAGE);

  // Hook de dropdown
  const { openDropdown, toggleDropdown, dropdownRef } = useDropdownState();

  // Hook de imagen (REUTILIZADO)
  const { selectedImage, openImageModal, closeImageModal } = useImageModal();

  return (
    <div className="order-history">
      <FilterControlsBar {...} />
      <OrdersTable {...} />
      <ImagePreviewModal {...} />
    </div>
  );
};
```

### Patrones Clave Aplicados

1. **Reutilización de Código**
   - `formatCurrency()` y `formatDate()` de utils existentes
   - `useImageModal` hook existente
   - `getPaymentMethodLabel()` de paymentHelpers.js

2. **Hooks Genéricos Reutilizables**
   - `usePagination` puede usarse en cualquier lista paginada
   - Separación clara entre lógica genérica y específica

3. **Separación de Concerns**
   - Lógica de filtrado en helpers puros (fácil de testear)
   - Estado en hooks (encapsulado)
   - UI en componentes pequeños (< 150 líneas)

4. **Memoización Apropiada**
   - `combineAndSortOrders` y `extractUniqueServices` con useMemo
   - FilterDropdown con memo() para evitar re-renders

### Lecciones Aprendidas

1. **Filtros complejos son helpers puros**: La lógica de 11 filtros en un helper puro facilita testing
2. **Hooks genéricos aumentan ROI**: usePagination es reutilizable en múltiples componentes
3. **Componentes memoizados para listas**: FilterDropdown memo evita re-renders en cada cambio
4. **Click outside con casos especiales**: Date pickers necesitan lógica especial

---

## Próximos Archivos a Refactorizar

Lista priorizada de componentes grandes que requieren refactorización:

### ✅ 1. OrderDetailView.jsx - COMPLETADO
**Reducción**: 1,328 → 454 líneas (66%)
**Ver sección dedicada arriba**

### ✅ 2. OrderHistory.jsx - COMPLETADO
**Reducción**: 1,280 → 120 líneas (90.6%)
**Ver sección dedicada arriba**

### ✅ 3. CashRegister.jsx - COMPLETADO
**Reducción**: 1,241 → 284 líneas (77.1%)
**Ver sección dedicada abajo**

### ✅ 4. PromotionForm.jsx - COMPLETADO
**Reducción**: 1,226 → 195 líneas (84.1%)
**Ver sección dedicada abajo**

### ✅ 5. OrderFormMobile.jsx - COMPLETADO
**Reducción**: 1,140 → 586 líneas (48.6%)
**Ver sección dedicada abajo**

---

## Refactorización de CashRegister.jsx

### Resumen de la Refactorización

**Archivo**: `src/components/CashRegister.jsx`
**Reducción**: 1,241 líneas → 284 líneas (77.1% de reducción)
**Fecha**: Diciembre 2025
**Commit**: Refactor CashRegister.jsx: Modular architecture (1,241 → 284 lines)

### Archivos Creados

#### Utilidades

1. **`src/utils/cash/denominationHelpers.js`** (85 líneas)
   - `DENOMINACIONES_BILLETES`, `DENOMINACIONES_MONEDAS` - Constantes
   - `BILLETES_INITIAL_STATE`, `MONEDAS_INITIAL_STATE` - Estados iniciales
   - `calcularTotalBilletes()`, `calcularTotalMonedas()` - Cálculos de denominaciones
   - `calcularEfectivoContado()` - Total de efectivo

2. **`src/utils/cash/cashCalculations.js`** (200 líneas)
   - `calculateOrdersSummary()` - Resumen de ingresos por método de pago
   - `calcularTotalTarjeta()`, `calcularTotalTransferencias()` - Totales de pagos electrónicos
   - `calcularDiferencias()` - Diferencias entre conteo y sistema
   - `calcularEfectivoDisponible()` - Efectivo disponible actual
   - `calcularIngresosAcumulados()` - Ingresos acumulados del día
   - `calcularGananciaDia()` - Ganancia total
   - `calcularDineroEnSistema()` - Dinero registrado en sistema
   - `calcularEfectivoFinal()` - Efectivo final para continuidad

3. **`src/utils/cash/closureHelpers.js`** (250 líneas)
   - `getLastClosureToday()` - Obtiene último corte del día
   - `getDateRange()` - Rango de fechas del día
   - `getTotalRetirosAcumulados()` - Total de retiros acumulados
   - `getTotalGastosAcumulados()` - Total de gastos acumulados
   - `buildClosureData()` - Construye objeto completo de cierre
   - `validateClosureData()` - Valida datos antes de cerrar

4. **`src/utils/expenses/expenseHelpers.js`** (90 líneas)
   - `EXPENSE_CATEGORIES` - Constante de categorías
   - `getCategoryIcon()` - Íconos de categorías
   - `getCategoryLabel()` - Labels de categorías
   - `calculateTotalExpenses()` - Total de gastos
   - `calculateTotalWithdrawals()` - Total de retiros
   - `generateTransactionId()` - Genera IDs únicos

#### Hooks Personalizados

1. **`src/hooks/useCashRegisterData.js`** (40 líneas)
   - Suscripciones a Firebase (employees, closures)
   - Retorna: `{ employees, closures, loading }`

2. **`src/hooks/useCashCounting.js`** (200 líneas)
   - Estado completo de conteo de dinero
   - Handlers para billetes (increment/decrement)
   - Handlers para monedas (increment/decrement)
   - Handlers para cobros con tarjeta (agregar/eliminar)
   - Handlers para transferencias (agregar/eliminar)
   - Funciones de reset y carga de datos
   - Retorna: `{ dineroInicial, billetes, monedas, cobrosTarjeta, transferencias, handlers... }`

3. **`src/hooks/useExpensesManagement.js`** (120 líneas) - **GENÉRICO REUTILIZABLE**
   - Manejo de gastos con modal y confirmación
   - `handleAddExpense()`, `handleDeleteExpense()`
   - Control de modales y diálogos
   - Retorna: `{ expenses, isExpenseModalOpen, confirmDialog, handlers... }`

4. **`src/hooks/useWithdrawalsManagement.js`** (120 líneas) - **GENÉRICO REUTILIZABLE**
   - Manejo de retiros con modal y confirmación
   - `handleAddWithdrawal()`, `handleDeleteWithdrawal()`
   - Control de modales y diálogos
   - Retorna: `{ withdrawals, isWithdrawalModalOpen, confirmDialog, handlers... }`

5. **`src/hooks/useCashRegisterCalculations.js`** (180 líneas)
   - Todos los cálculos derivados con useMemo
   - Optimizado para evitar re-renders innecesarios
   - Retorna: `{ summary, efectivoContado, diferencias, resultados... }`

6. **`src/hooks/useCashRegisterClosure.js`** (180 líneas)
   - Lógica completa de cierre de caja
   - Validación de datos
   - Construcción y guardado de closure
   - Retorna: `{ selectedEmployee, notes, handleCloseCashRegister, isCloseButtonDisabled... }`

#### Componentes UI

1. **`src/components/cash/FinancialSummary.jsx`** (110 líneas)
   - Grid de 8 tarjetas de resumen
   - Ingresos acumulados, efectivo disponible, retiros, gastos
   - Tarjeta, transferencia, órdenes, productos

2. **`src/components/cash/IncomeCounting.jsx`** (270 líneas)
   - Sección completa de conteo de ingresos
   - Input de dinero inicial
   - Contadores de billetes y monedas con +/-
   - Lista de cobros con tarjeta (débito/crédito)
   - Lista de transferencias
   - Totales por método de pago

3. **`src/components/cash/SystemComparison.jsx`** (70 líneas)
   - Tabla comparativa conteo vs sistema
   - Diferencias por método de pago
   - Alert de diferencia total

4. **`src/components/cash/ResultsPanel.jsx`** (70 líneas)
   - Tarjetas de resultados finales
   - Total ingresos, gastos totales, ganancia del día

5. **`src/components/cash/WithdrawalsList.jsx`** (90 líneas)
   - Lista de retiros del periodo
   - Botones agregar y eliminar
   - Estado vacío con CTA

6. **`src/components/cash/ExpensesList.jsx`** (95 líneas)
   - Lista de gastos del periodo
   - Íconos por categoría
   - Botones agregar y eliminar
   - Estado vacío con CTA

7. **`src/components/cash/ClosureSection.jsx`** (85 líneas)
   - Selector de empleado
   - Textarea de notas (500 chars)
   - Checkbox de habilitación sin validaciones
   - Botón de cierre con validación

### Componente Principal Refactorizado

```javascript
// src/components/CashRegister.jsx (284 líneas)
const CashRegister = ({ orders, dateFilter }) => {
  // Hooks de datos
  const { employees, closures } = useCashRegisterData();

  // Hooks de estado
  const counting = useCashCounting();
  const expensesManager = useExpensesManagement();
  const withdrawalsManager = useWithdrawalsManagement();

  // Auto-save (draft)
  const { isPending, isError, isSuccess, debouncedSave } = useCashRegisterDraft(draftData);

  // Cálculos derivados
  const calculations = useCashRegisterCalculations({ orders, closures, counting, ... });

  // Lógica de cierre
  const closure = useCashRegisterClosure({ employees, orders, calculations, ... });

  return (
    <div className="cash-register">
      <FinancialSummary {...calculations} />
      <IncomeCounting {...counting} {...calculations} />
      <SystemComparison {...calculations} />
      <ResultsPanel {...calculations} />
      <WithdrawalsList {...withdrawalsManager} />
      <ExpensesList {...expensesManager} />
      <ClosureSection {...closure} />
      {/* Modales y confirmaciones */}
    </div>
  );
};
```

### Patrones Clave Aplicados

1. **Separación de Concerns**
   - Utilidades puras para cálculos (fácil de testear)
   - Hooks para estado y efectos (encapsulado)
   - Componentes para UI (presentación pura)

2. **Hooks Genéricos Reutilizables**
   - `useExpensesManagement` y `useWithdrawalsManagement` pueden usarse en otros módulos
   - Patrón consistente para gestión de listas con CRUD

3. **Optimización de Performance**
   - Uso extensivo de `useMemo` para cálculos derivados
   - `useCallback` para handlers que se pasan a componentes
   - Evita re-renders innecesarios

4. **Validación Robusta**
   - Validación de datos antes de cierre
   - Opción de bypass con checkbox explícito
   - Mensajes de error claros y específicos

5. **Auto-guardado con Draft**
   - Integración con hook existente `useCashRegisterDraft`
   - Guardado debounced para mejor UX
   - Recuperación de datos al montar

### Lecciones Aprendidas

1. **Cálculos complejos en hooks dedicados**: Un hook de cálculos con múltiples `useMemo` es más mantenible
2. **Hooks genéricos aumentan ROI**: Los hooks de gastos/retiros son reutilizables
3. **Validación centralizada**: Helper de validación permite testing fácil
4. **Estado distribuido pero coordinado**: Múltiples hooks que se coordinan en el componente padre

---

## Refactorización de PromotionForm.jsx

### Resumen de la Refactorización

**Archivo**: `src/components/PromotionForm.jsx`
**Reducción**: 1,226 líneas → 195 líneas (84.1% de reducción)
**Fecha**: Diciembre 2025
**Commit**: Refactor PromotionForm.jsx: Modular architecture (1,226 → 195 lines)

### Archivos Creados

#### Utilidades

1. **`src/utils/promotions/promotionTypes.js`** (140 líneas)
   - `PROMOTION_TYPES` - Constantes de los 7 tipos de promoción
   - `PROMOTION_TYPE_CONFIG` - Configuración completa por tipo (label, icon, example, fields)
   - `combineServicesAndProducts()` - Combina servicios y productos en formato unificado
   - Documentación completa de cada tipo de promoción

2. **`src/utils/promotions/promotionValidations.js`** (280 líneas)
   - `validateForm()` - Validación completa orquestadora
   - `validateBasicInfo()` - Valida nombre y descripción
   - `validatePercentagePromotion()` - Validación para descuento porcentual
   - `validateFixedPromotion()` - Validación para descuento fijo
   - `validateBuyXGetYPromotion()` - Validación para 2x1, 3x2, etc
   - `validateBuyXGetYDiscountPromotion()` - Validación para 2do a X% OFF
   - `validateComboPromotion()` - Validación para combos/paquetes
   - `validateDayOfWeekPromotion()` - Validación para días específicos
   - `validateSpecificPricePromotion()` - Validación para precio específico
   - `validateRestrictions()` - Validación de restricciones opcionales
   - **Cobertura total**: Validaciones específicas para cada uno de los 7 tipos

3. **`src/utils/promotions/promotionDataBuilder.js`** (220 líneas)
   - `buildPromotionData()` - Construye objeto completo de promoción
   - `buildBaseData()` - Construye datos básicos
   - `buildTypeSpecificData()` - Construye datos específicos del tipo con `deleteField()`
   - `buildRestrictions()` - Construye restricciones opcionales con `deleteField()`
   - **Limpieza inteligente**: Usa `deleteField()` para eliminar campos huérfanos al editar
   - **Manejo de 7 tipos**: Construcción específica para cada tipo de promoción

4. **`src/utils/promotions/promotionInitialState.js`** (120 líneas)
   - `INITIAL_FORM_STATE` - Estado inicial completo del formulario
   - `loadInitialData()` - Carga datos para edición
   - **37 campos**: Maneja todos los campos de los 7 tipos + restricciones
   - Compatibilidad con datos antiguos (combos sin quantity)

#### Hooks Personalizados

1. **`src/hooks/usePromotionForm.js`** (116 líneas)
   - Estado del formulario con 37 campos
   - `handleChange()` - Maneja cambios en inputs
   - `handleDayToggle()` - Toggle de días de la semana
   - `handleItemToggle()` - Toggle de items genérico
   - `handleComboItemToggle()` - Toggle de items de combo con información completa
   - `handleComboItemQuantityChange()` - Maneja cantidades en combos
   - Retorna: `{ formData, errors, setErrors, ...handlers }`

2. **`src/hooks/usePromotionItems.js`** (24 líneas)
   - Combina servicios y productos con `useMemo`
   - **REUTILIZABLE**: Puede usarse en cualquier componente que necesite items combinados
   - Retorna: `{ allItems }` - Array unificado de servicios y productos

3. **`src/hooks/usePromotionValidation.js`** (32 líneas)
   - Wrapper del validador con integración a NotificationContext
   - Muestra errores de validación automáticamente
   - Retorna: `{ validate }` - Función de validación

4. **`src/hooks/usePromotionSubmit.js`** (24 líneas)
   - Procesa datos del formulario antes de submit
   - Usa `buildPromotionData()` para construir objeto final
   - Retorna: `{ handleSubmit }` - Handler de submit procesado

5. **`src/hooks/useAutoScroll.js`** (18 líneas)
   - **GENÉRICO Y REUTILIZABLE**: Auto-scroll a top cuando se activa trigger
   - Parámetros: `trigger` (boolean), `selector` (CSS selector)
   - Puede usarse en cualquier componente con scroll

#### Componentes UI - Principales

1. **`src/components/promotions/BasicInfoSection.jsx`** (75 líneas)
   - Emoji picker (input text con maxLength 2)
   - Nombre (ValidatedAlphanumericInput)
   - Descripción (textarea)
   - Checkbox de activo/inactivo

2. **`src/components/promotions/PromotionTypeSelector.jsx`** (53 líneas)
   - Grid con 7 radio buttons para tipos de promoción
   - Usa `PROMOTION_TYPE_CONFIG` para generar opciones
   - Muestra icono, label y ejemplo por cada tipo

3. **`src/components/promotions/TypeConfigSection.jsx`** (116 líneas)
   - **ORQUESTADOR**: Renderiza componente específico según tipo seleccionado
   - Switch statement con 7 casos
   - Pasa props específicas a cada componente de tipo

4. **`src/components/promotions/RestrictionsSection.jsx`** (184 líneas)
   - Rango de fechas (hasDateRange, startDate, endDate)
   - Un uso por cliente (onePerClient)
   - Solo clientes nuevos (newClientsOnly)
   - Límite de usos totales (hasMaxUses, maxUses)
   - Monto mínimo de compra (hasMinPurchase, minPurchaseAmount)
   - Días específicos (hasDayRestriction, daysOfWeek)
   - Usa `DaysSelector` para selección de días

#### Componentes UI - Reutilizables

5. **`src/components/promotions/ItemsSelector.jsx`** (45 líneas)
   - **REUTILIZABLE**: Selector genérico de items con checkboxes
   - Props: items, selectedIds, onToggle, error, label, helpText
   - Grid de checkboxes con nombres de items

6. **`src/components/promotions/DaysSelector.jsx`** (42 líneas)
   - **REUTILIZABLE**: Selector de días de la semana
   - Botones toggle para cada día (Dom-Sáb)
   - Props: selectedDays, onToggle, error, label, required

7. **`src/components/promotions/HelpText.jsx`** (18 líneas)
   - **REUTILIZABLE**: Componente para hints/ayuda
   - Estilo consistente de texto de ayuda
   - Props: children, style

8. **`src/components/promotions/ComboItemQuantities.jsx`** (58 líneas)
   - **REUTILIZABLE**: Maneja cantidades de items en combos
   - Inputs numéricos para cada item seleccionado
   - Props: comboItems, onQuantityChange

#### Componentes UI - Tipo Específico

9. **`src/components/promotions/PercentageConfig.jsx`** (65 líneas)
   - Porcentaje de descuento (1-100%)
   - Select de aplica a (all/services/products/specific)
   - ItemsSelector condicional si appliesTo = 'specific'

10. **`src/components/promotions/FixedConfig.jsx`** (48 líneas)
    - Monto de descuento fijo ($)
    - ItemsSelector opcional para items aplicables
    - Helptext: "Si no seleccionas ninguno, aplica a todo el carrito"

11. **`src/components/promotions/BuyXGetYConfig.jsx`** (78 líneas)
    - Total de items (buyQuantity)
    - Cantidad gratis (getQuantity)
    - **Help box azul** con ejemplos: 2x1, 3x2, 4x3
    - ItemsSelector opcional

12. **`src/components/promotions/BuyXGetYDiscountConfig.jsx`** (79 líneas)
    - Cantidad de items (buyQuantity)
    - Porcentaje de descuento (discountPercentage)
    - **Help box azul** con ejemplos: 2do a 50% OFF, 3ro a 30% OFF
    - ItemsSelector opcional

13. **`src/components/promotions/ComboConfig.jsx`** (67 líneas)
    - Precio del combo ($)
    - Checkboxes de items con precios
    - `ComboItemQuantities` para manejar cantidades
    - Validación mínimo 2 items

14. **`src/components/promotions/DayOfWeekConfig.jsx`** (46 líneas)
    - Porcentaje de descuento (1-100%)
    - `DaysSelector` para días específicos
    - Ej: Martes 15% OFF

15. **`src/components/promotions/SpecificPriceConfig.jsx`** (50 líneas)
    - Precio específico ($)
    - ItemsSelector **solo productos** (filtra items)
    - Helptext: "Este será el precio final del producto"

### Arquitectura del Componente Principal

El componente refactorizado (`PromotionForm.jsx` - 195 líneas) actúa como **orquestador**:

```javascript
const PromotionForm = ({ onSubmit, onCancel, onDelete, initialData, services, products, isSubmitting }) => {
  // 1. Auth
  const isAdmin = useAdminCheck();

  // 2. Hooks de gestión
  const formManager = usePromotionForm(initialData);
  const { allItems } = usePromotionItems(services, products);
  const { validate } = usePromotionValidation();
  const { handleSubmit: processSubmit } = usePromotionSubmit(onSubmit, initialData);
  useAutoScroll(isSubmitting);

  // 3. Submit handler
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { isValid, errors } = validate(formManager.formData);
    if (!isValid) {
      formManager.setErrors(errors);
      return;
    }
    processSubmit(formManager.formData);
  };

  // 4. Render con componentes modulares
  return (
    <form onSubmit={handleFormSubmit}>
      <BasicInfoSection {...} />
      <PromotionTypeSelector {...} />
      <TypeConfigSection type={formData.type} {...} />
      <RestrictionsSection {...} />
      <FormActions {...} />
      {isSubmitting && <SuccessOverlay />}
    </form>
  );
};
```

### Cobertura de Tipos de Promoción

El sistema maneja **7 tipos distintos** de promociones, cada uno con validaciones y construcción de datos específicas:

1. **`percentage`** - Descuento Porcentual
   - Campos: `discountValue`, `appliesTo`, `specificItems`
   - Ejemplo: 20% OFF en Limpieza calzado
   - Validación: 1-100%, requiere items si appliesTo='specific'

2. **`fixed`** - Descuento Fijo
   - Campos: `discountValue`, `applicableItems`
   - Ejemplo: $50 OFF en cualquier servicio
   - Validación: Monto > 0

3. **`buyXgetY`** - Compra y Lleva Gratis
   - Campos: `buyQuantity`, `getQuantity`, `applicableItems`
   - Ejemplo: 2x1, 3x2
   - Validación: buyQuantity >= 2, getQuantity >= 1

4. **`buyXgetYdiscount`** - Compra y Descuento
   - Campos: `buyQuantity`, `discountPercentage`, `applicableItems`
   - Ejemplo: 2do a 50% OFF
   - Validación: buyQuantity >= 2, descuento 1-100%

5. **`combo`** - Combo/Paquete
   - Campos: `comboPrice`, `comboItems` (con quantities)
   - Ejemplo: 2 servicios por $200
   - Validación: Mínimo 2 items, precio > 0

6. **`dayOfWeek`** - Día de Semana
   - Campos: `discountValue`, `daysOfWeek`
   - Ejemplo: Martes 15% OFF
   - Validación: 1-100%, al menos 1 día seleccionado

7. **`specificPrice`** - Precio Específico
   - Campos: `specificPrice`, `applicableItems` (solo productos)
   - Ejemplo: Producto a $50
   - Validación: Precio > 0, al menos 1 producto

### Manejo de Campos Huérfanos

El sistema usa `deleteField()` de Firebase para limpiar campos que ya no aplican al cambiar de tipo:

```javascript
import { deleteField } from 'firebase/firestore';

// Ejemplo: Al cambiar de 'percentage' a 'fixed'
if (isEditing && type !== 'percentage') {
  data.appliesTo = deleteField();
  data.specificItems = deleteField();
}
```

**Campos limpiados por tipo**:
- `percentage` → `fixed`: Limpia `appliesTo`, `specificItems`
- `buyXgetY` → `combo`: Limpia `buyQuantity`, `getQuantity`, `applicableItems`
- `combo` → `specificPrice`: Limpia `comboPrice`, `comboItems`

### Restricciones Opcionales

Todas las promociones pueden tener restricciones adicionales:

1. **Rango de Fechas**: `hasDateRange`, `dateRange.startDate`, `dateRange.endDate`
2. **Un uso por cliente**: `onePerClient` (boolean)
3. **Solo clientes nuevos**: `newClientsOnly` (boolean)
4. **Límite de usos totales**: `hasMaxUses`, `maxUses` (número)
5. **Monto mínimo de compra**: `hasMinPurchase`, `minPurchaseAmount` ($)
6. **Días específicos**: `hasDayRestriction`, `daysOfWeek` (array de índices 0-6)

### Estadísticas de Reducción

**Componente Principal**:
- Antes: 1,226 líneas (todo en un archivo)
- Después: 195 líneas (orquestador limpio)
- Reducción: **84.1%**

**Módulos Creados**:
- 4 utilidades: ~760 líneas
- 5 hooks: ~214 líneas
- 15 componentes UI: ~950 líneas
- **Total nuevo código**: ~1,924 líneas (pero altamente modular y reutilizable)

**Ventajas**:
- Código organizado por responsabilidad
- Componentes reutilizables (ItemsSelector, DaysSelector, etc)
- Hooks reutilizables (useAutoScroll, usePromotionItems)
- Validaciones centralizadas y testeables
- Fácil agregar nuevos tipos de promoción

### Lecciones Aprendidas

1. **Componentes tipo-específicos separados**: Cada tipo de promoción tiene su propio componente de configuración
2. **Orquestador limpio**: TypeConfigSection usa switch para renderizar el componente correcto
3. **Validaciones exhaustivas**: Validación específica para cada uno de los 7 tipos
4. **deleteField() para limpieza**: Elimina campos huérfanos al editar promociones
5. **Help boxes visuales**: Ejemplos en cajas azules mejoran UX para tipos complejos
6. **Componentes altamente reutilizables**: ItemsSelector, DaysSelector, etc pueden usarse en otros formularios

---

## Refactorización de OrderFormMobile.jsx

### Resumen de la Refactorización

**Archivo**: `src/components/OrderFormMobile.jsx`
**Reducción**: 1,140 líneas → 586 líneas (48.6% de reducción)
**Fecha**: Diciembre 2025
**Commit**: Refactor OrderFormMobile.jsx: Modular architecture (1,140 → 586 lines)

### Estrategia: Máxima Reutilización

**Clave**: Reutilizar TODOS los hooks y utilidades existentes de OrderForm.jsx. La lógica de negocio es IDÉNTICA, solo difiere el layout móvil y el manejo de PaymentScreen como pantalla separada.

### Archivos Reutilizados (CERO archivos nuevos)

#### Hooks Reutilizados (de OrderForm.jsx)

1. **`src/hooks/useOrderFormData.js`**
   - Estado del formulario (client, phone, email, deliveryDate, paymentMethod, etc)
   - Validaciones completas
   - Handlers: handleChange, handleClientInputChange, handleSelectClient
   - Función validateForm para validar antes de submit

2. **`src/hooks/useCartManagement.js`**
   - Estado del carrito con servicios y productos
   - handleAddToCart: Agrega servicios o productos al carrito
   - handleRemoveFromCart: Elimina o decrementa cantidad de items
   - Carga de datos iniciales en modo edición

3. **`src/hooks/usePromotionsCalculation.js`**
   - Cálculo automático de promociones aplicables
   - activePromotions: Lista de promociones disponibles
   - appliedPromotions: Promociones que aplican al carrito actual
   - promotionValidations: Razones de por qué no aplica cada promo
   - itemPromotionMap: Mapa de qué promoción aplica a cada item
   - refetchPromotions: Función para recargar promociones

4. **`src/hooks/useOrderImages.js`**
   - Manejo de imágenes de la orden
   - orderImages: Array de imágenes
   - setOrderImages: Setter para actualizar imágenes

5. **`src/hooks/useEmployeeAssignment.js`**
   - Asignación automática de empleados
   - selectedEmployee: Empleado seleccionado para la orden
   - setSelectedEmployee: Setter para cambiar asignación
   - Auto-selección del empleado con menos carga de trabajo

#### Utilidades Reutilizadas

1. **`src/utils/promotions/promotionCalculations.js`**
   - `calculateSubtotal(cart)` - Suma total del carrito antes de descuentos
   - `calculateTotalDiscount(appliedPromotions)` - Suma total de descuentos
   - `calculateTotalPrice(subtotal, discount)` - Precio final después de descuentos

2. **`src/utils/promotions/promotionHelpers.js`**
   - `isPromotionRelevantForCart(promo, cart)` - Determina si mostrar promo en banner
   - `getPromotionPriority(promo)` - Calcula prioridad para asignación
   - `getItemsWithPromoBadge(promo, cart, map)` - Items con badge de promo

3. **`src/utils/cart/cartHelpers.js`**
   - `generateCartItemId()` - Genera IDs únicos para items
   - `expandServicesForOrder(serviceItems)` - Expande servicios con cantidad
   - `hasExpressService(cart)` - Detecta si hay servicio express

### Arquitectura del Componente Refactorizado

El componente refactorizado (586 líneas) actúa como **orquestador** que reutiliza toda la lógica de OrderForm.jsx:

```javascript
const OrderFormMobile = ({ onSubmit, onCancel, initialData, employees, allOrders }) => {
  // Auth
  const { employee } = useAuth();

  // Hooks reutilizados de OrderForm.jsx
  const { formData, errors, handleChange, handleClientInputChange, handleSelectClient, validateForm }
    = useOrderFormData(initialData);
  const { cart, handleAddToCart, handleRemoveFromCart }
    = useCartManagement();
  const { activePromotions, appliedPromotions, promotionValidations, itemPromotionMap }
    = usePromotionsCalculation(cart, formData);
  const { orderImages, setOrderImages }
    = useOrderImages(initialData);
  const { selectedEmployee, setSelectedEmployee }
    = useEmployeeAssignment(employees, allOrders, employee);

  // Estado específico de móvil
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);

  // Cálculos usando utilidades reutilizadas
  const subtotal = calculateSubtotal(cart);
  const totalDiscount = calculateTotalDiscount(appliedPromotions);
  const totalPrice = calculateTotalPrice(subtotal, totalDiscount);

  // Submit handler con lógica de PaymentScreen
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm(cart)) {
      if (formData.paymentMethod !== 'pending') {
        setShowPaymentScreen(true); // Mostrar pantalla de cobro primero
      } else {
        createOrder(); // Crear orden directamente
      }
    }
  };

  // Render condicional: PaymentScreen o Formulario
  return (
    <div>
      {showPaymentScreen ? (
        <PaymentScreen {...} />
      ) : (
        <form>
          {/* Secciones: Cliente, Servicios, Productos, Carrito, Empleados, Fecha, Pago, Fotos */}
        </form>
      )}
    </div>
  );
};
```

### Diferencias con OrderForm.jsx Desktop

| Aspecto | OrderForm.jsx (Desktop) | OrderFormMobile.jsx (Móvil) |
|---------|-------------------------|----------------------------|
| **Líneas** | 498 líneas | 586 líneas |
| **Layout** | Grid desktop, componentes separados | Stack vertical inline |
| **Componentes UI** | 9 componentes separados | Todo inline (más compacto) |
| **PaymentSection** | Inline en el formulario | PaymentScreen como pantalla completa |
| **CSS** | OrderForm.css | OrderFormMobile.css |
| **Hooks** | ✅ 5 hooks propios | ✅ MISMOS 5 hooks (reutilizados) |
| **Utilidades** | ✅ 3 archivos utils | ✅ MISMAS 3 utils (reutilizadas) |
| **Lógica de negocio** | En hooks reutilizables | ✅ MISMA lógica (reutilizada) |

### Funcionalidad Específica Móvil

1. **PaymentScreen Separada**
   - Cuando el método de pago NO es "pending", muestra PaymentScreen antes de crear la orden
   - PaymentScreen maneja el cobro (método de pago, anticipo, cambio)
   - Al confirmar cobro, regresa y crea la orden con los datos de pago

2. **Layout Mobile-First**
   - Stack vertical en lugar de grid desktop
   - Botones grandes con emojis para servicios/productos
   - Secciones colapsables y compactas
   - Clases CSS con sufijo `-mobile`

3. **Carga de Servicios/Productos**
   - useEffect para suscripciones a Firebase (subscribeToServices, subscribeToInventory)
   - Procesa servicios con cálculo automático de daysToAdd
   - Filtra productos con stock > 0

4. **Asignación de Empleados Inline**
   - Grid de empleados con emoji y contador de órdenes activas
   - Cálculo de orderCount directamente en el render
   - Toggle al hacer click (seleccionar/deseleccionar)

### Estadísticas de Reducción

**Componente Principal**:
- Antes: 1,140 líneas (todo en un archivo)
- Después: 586 líneas (orquestador con hooks reutilizados)
- Reducción: **48.6%**

**Archivos Nuevos**: 0 (reutiliza todo de OrderForm.jsx)

**Ventajas**:
- Cero duplicación de código entre desktop y móvil
- Mantenimiento simplificado (un fix beneficia ambas versiones)
- Consistencia garantizada (misma lógica de negocio)
- Rapidez en desarrollo (no hay que crear nuevos archivos)
- Testing compartido (validaciones probadas en ambas versiones)

### Lecciones Aprendidas

1. **Máxima reutilización es posible**: Desktop y móvil pueden compartir el 100% de la lógica de negocio
2. **Hooks agnósticos de UI**: Los hooks no dependen del layout, solo de la lógica
3. **Separación clara**: Hooks = lógica, JSX = presentación
4. **PaymentScreen reutilizable**: Un componente puede funcionar como inline o pantalla completa
5. **Testing eficiente**: Un bug fix en hooks beneficia ambas versiones automáticamente

---

## Guía Paso a Paso

### Refactorización de un Componente Grande

#### Paso 1: Análisis y Backup (30 min)

```bash
# 1. Abrir el componente y analizar
code src/components/[ComponentName].jsx

# 2. Identificar:
#    - Número de líneas
#    - useState (¿cuántos?, ¿relacionados?)
#    - useEffect (¿cuántos?, ¿qué hacen?)
#    - Funciones helpers (¿puras?, ¿con efectos?)
#    - Secciones JSX independientes

# 3. Crear backup
cp src/components/[ComponentName].jsx src/components/[ComponentName].ORIGINAL.jsx
```

**Checklist de análisis**:
- [ ] Contar líneas de código
- [ ] Listar todos los useState y agrupar por dominio
- [ ] Listar todos los useEffect y sus dependencias
- [ ] Identificar funciones puras (candidatas a utils)
- [ ] Identificar funciones con efectos (candidatas a hooks)
- [ ] Mapear secciones JSX independientes

#### Paso 2: Crear Estructura de Directorios (10 min)

```bash
# Crear directorios según dominios identificados
mkdir -p src/utils/[dominio]
mkdir -p src/hooks
mkdir -p src/components/[dominio]
```

#### Paso 3: Extraer Utilidades (1-2 horas)

```javascript
// Ejemplo: src/utils/orders/orderHelpers.js

/**
 * Genera ID único para nueva orden
 */
export function generateOrderId() {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Valida que una orden tenga todos los campos requeridos
 */
export function validateOrderData(orderData) {
  const errors = {};

  if (!orderData.client) errors.client = 'Cliente es requerido';
  if (!orderData.phone) errors.phone = 'Teléfono es requerido';
  if (!orderData.deliveryDate) errors.deliveryDate = 'Fecha de entrega es requerida';

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Calcula tiempo estimado de entrega
 */
export function calculateEstimatedDelivery(services, isExpress) {
  const baseHours = services.reduce((total, s) => total + (s.estimatedHours || 24), 0);
  return isExpress ? baseHours * 0.5 : baseHours;
}
```

**Checklist**:
- [ ] Funciones son puras (mismo input = mismo output)
- [ ] No usan hooks de React
- [ ] No tienen efectos secundarios
- [ ] Están documentadas con JSDoc
- [ ] Tienen nombres descriptivos
- [ ] Agrupadas por dominio lógico

#### Paso 4: Crear Custom Hooks (2-3 horas)

```javascript
// Ejemplo: src/hooks/useOrderFilters.js
import { useState, useCallback, useMemo } from 'react';

export function useOrderFilters(orders) {
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateFrom: '',
    dateTo: ''
  });

  // Memoizar función de filtrado
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Filtro por estado
      if (filters.status !== 'all' && order.status !== filters.status) {
        return false;
      }

      // Filtro por búsqueda
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesClient = order.client?.toLowerCase().includes(searchLower);
        const matchesPhone = order.phone?.includes(filters.search);
        if (!matchesClient && !matchesPhone) return false;
      }

      // Filtro por fechas
      if (filters.dateFrom && order.date < filters.dateFrom) return false;
      if (filters.dateTo && order.date > filters.dateTo) return false;

      return true;
    });
  }, [orders, filters]);

  // Memoizar handler de cambio
  const handleFilterChange = useCallback((filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      status: 'all',
      search: '',
      dateFrom: '',
      dateTo: ''
    });
  }, []);

  return {
    filters,
    filteredOrders,
    handleFilterChange,
    clearFilters
  };
}
```

**Checklist**:
- [ ] Hook empieza con `use`
- [ ] Encapsula estado relacionado
- [ ] Usa `useCallback` para funciones que se pasan como dependencias
- [ ] Usa `useMemo` para cálculos costosos
- [ ] Retorna objeto con API clara
- [ ] Documenta parámetros y retorno

#### Paso 5: Crear Componentes UI (2-3 horas)

```javascript
// Ejemplo: src/components/history/FilterBar.jsx

/**
 * Barra de filtros para histórico de órdenes
 */
export function FilterBar({ filters, onFilterChange, onClearFilters }) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Estado:</label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="recibido">Recibidos</option>
          <option value="proceso">En Proceso</option>
          <option value="listo">Listos</option>
          <option value="entregado">Entregados</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Buscar:</label>
        <input
          type="text"
          placeholder="Cliente o teléfono..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Desde:</label>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => onFilterChange('dateFrom', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Hasta:</label>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => onFilterChange('dateTo', e.target.value)}
        />
      </div>

      <button className="btn-secondary" onClick={onClearFilters}>
        Limpiar Filtros
      </button>
    </div>
  );
}
```

**Checklist**:
- [ ] Componente tiene menos de 150 líneas
- [ ] Props están claramente definidas
- [ ] Solo maneja UI, no lógica de negocio
- [ ] Usa callbacks para comunicarse con padre
- [ ] Nombres de props son descriptivos

#### Paso 6: Refactorizar Componente Principal (1-2 horas)

```javascript
// src/components/OrderHistory.jsx - REFACTORIZADO

import { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useOrderFilters } from '../hooks/useOrderFilters';
import { FilterBar } from './history/FilterBar';
import { OrdersList } from './history/OrdersList';
import { OrderDetailModal } from './history/OrderDetailModal';

const OrderHistory = () => {
  // Hooks personalizados
  const { orders, isLoading, refetch } = useOrders();
  const { filters, filteredOrders, handleFilterChange, clearFilters } = useOrderFilters(orders);

  // Estado UI local
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Handlers de coordinación
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  if (isLoading) {
    return <div className="loading">Cargando órdenes...</div>;
  }

  return (
    <div className="order-history">
      <h2>Histórico de Órdenes</h2>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      <OrdersList
        orders={filteredOrders}
        onOrderClick={handleOrderClick}
      />

      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={handleCloseModal}
          onUpdate={refetch}
        />
      )}
    </div>
  );
};

export default OrderHistory;
```

**Checklist**:
- [ ] Componente usa solo hooks personalizados
- [ ] Lógica de negocio está en hooks/utils
- [ ] JSX está dividido en componentes pequeños
- [ ] Solo coordina entre componentes hijos
- [ ] Fácil de leer y entender el flujo

#### Paso 7: Testing y Verificación (30 min - 1 hora)

```bash
# 1. Verificar que no hay errores de importación
npm run dev

# 2. Probar todas las funcionalidades:
#    - Crear orden
#    - Editar orden
#    - Filtrar órdenes
#    - Cambiar estados
#    - Etc.

# 3. Verificar consola del navegador
#    - No debe haber errores
#    - No debe haber warnings de infinite loops
#    - No debe haber warnings de dependencies

# 4. Verificar performance
#    - No debe haber lag al escribir
#    - Filtros deben responder instantáneamente
```

**Checklist de pruebas**:
- [ ] Aplicación carga sin errores
- [ ] Todas las funcionalidades previas funcionan
- [ ] No hay infinite loops (revisar consola)
- [ ] No hay warnings de React
- [ ] Performance es buena (no lag)
- [ ] Hot Module Replacement funciona

#### Paso 8: Commit (15 min)

```bash
# Ver cambios
git status
git diff

# Crear commit descriptivo
git add .
git commit -m "Refactor [ComponentName]: Modular architecture ([ANTES] → [DESPUÉS] lines)

- Extract utilities to src/utils/[dominio]/
- Create custom hooks in src/hooks/
- Break UI into small components in src/components/[dominio]/
- Reduce complexity and improve maintainability

Files created:
- src/utils/[dominio]/[helpers].js
- src/hooks/use[Hook].js
- src/components/[dominio]/[Component].jsx

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Errores Comunes y Soluciones

### Error 1: Infinite Loop - "Maximum update depth exceeded"

**Síntoma**: Consola muestra error de máxima profundidad de actualizaciones

**Causa común**:
```javascript
// ❌ INCORRECTO
const [data, setData] = useState([]);

const processData = async () => {
  const result = await fetchData();
  setData(result);
};

// Arrays/objetos se recrean en cada render
useEffect(() => {
  processData();
}, [data]); // ❌ Infinite loop!
```

**Solución**:
```javascript
// ✅ CORRECTO - Opción 1: Memoizar la función
const processData = useCallback(async () => {
  const result = await fetchData();
  setData(result);
}, []); // Solo se crea una vez

useEffect(() => {
  processData();
}, [processData]); // Solo se ejecuta cuando processData cambia

// ✅ CORRECTO - Opción 2: No incluir state en dependencias si no es necesario
useEffect(() => {
  const processData = async () => {
    const result = await fetchData();
    setData(result);
  };
  processData();
}, []); // Solo se ejecuta una vez al montar
```

### Error 2: Stale Closures

**Síntoma**: Callback usa valor antiguo de state

**Causa**:
```javascript
// ❌ INCORRECTO
const [count, setCount] = useState(0);

const increment = () => {
  setCount(count + 1); // Si se llama múltiples veces rápido, usa valor viejo
};
```

**Solución**:
```javascript
// ✅ CORRECTO - Usar functional update
const increment = useCallback(() => {
  setCount(prev => prev + 1); // Siempre usa valor actual
}, []); // No depende de count
```

### Error 3: Props Drilling Excesivo

**Síntoma**: Pasando 5+ props a través de múltiples niveles

**Solución**:
```javascript
// ❌ INCORRECTO
<Parent data={data} onUpdate={onUpdate} onDelete={onDelete} onEdit={onEdit} config={config}>
  <Child data={data} onUpdate={onUpdate} onDelete={onDelete} onEdit={onEdit} config={config}>
    <GrandChild data={data} onUpdate={onUpdate} />
  </Child>
</Parent>

// ✅ CORRECTO - Usar Context para datos globales
const OrderContext = createContext();

<OrderContext.Provider value={{ data, onUpdate, onDelete, onEdit, config }}>
  <Parent>
    <Child>
      <GrandChild />
    </Child>
  </Parent>
</OrderContext.Provider>

// En GrandChild:
const { data, onUpdate } = useContext(OrderContext);
```

### Error 4: Dependencias Faltantes en useEffect

**Síntoma**: ESLint warning "React Hook useEffect has a missing dependency"

**Solución**:
```javascript
// ❌ Ignorar el warning es peligroso
useEffect(() => {
  processData(externalValue);
}, []); // eslint-disable-line react-hooks/exhaustive-deps

// ✅ CORRECTO - Agregar todas las dependencias
useEffect(() => {
  processData(externalValue);
}, [externalValue]); // Si externalValue es objeto/array, memoizarlo

// ✅ O memoizar la función si es el problema
const processData = useCallback((value) => {
  // ... lógica
}, []);

useEffect(() => {
  processData(externalValue);
}, [processData, externalValue]);
```

### Error 5: Mutación Directa de State

**Síntoma**: UI no se actualiza aunque el valor cambió

**Causa**:
```javascript
// ❌ INCORRECTO
const [items, setItems] = useState([]);

const addItem = (item) => {
  items.push(item); // Mutación directa!
  setItems(items); // React no detecta el cambio (misma referencia)
};
```

**Solución**:
```javascript
// ✅ CORRECTO - Crear nuevo array
const addItem = (item) => {
  setItems(prev => [...prev, item]); // Nueva referencia
};

// Para objetos:
const updateUser = (key, value) => {
  setUser(prev => ({ ...prev, [key]: value })); // Nuevo objeto
};
```

---

## Mejores Prácticas

### 1. Nomenclatura Consistente

```javascript
// Utilidades: verbos o sustantivos descriptivos
calculateSubtotal()
validateOrderData()
getEmployeeOrderCount()

// Hooks: siempre empiezan con "use"
useOrderFilters()
useCartManagement()
usePromotionsCalculation()

// Componentes: sustantivos en PascalCase
CustomerInfoSection
CartItem
PromotionsBanner

// Handlers: siempre empiezan con "handle"
handleAddToCart()
handleFilterChange()
handleSubmitOrder()
```

### 2. Organización de Imports

```javascript
// 1. React y librerías externas
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Contextos y hooks personalizados
import { useAuth } from '../contexts/AuthContext';
import { useOrderFilters } from '../hooks/useOrderFilters';

// 3. Componentes
import { FilterBar } from './history/FilterBar';
import { OrdersList } from './history/OrdersList';

// 4. Utilidades
import { calculateSubtotal } from '../utils/promotions/promotionCalculations';
import { validateOrderData } from '../utils/orders/orderHelpers';

// 5. Estilos (si aplica)
import './OrderHistory.css';
```

### 3. Estructura de Componente

```javascript
const MyComponent = ({ prop1, prop2, onAction }) => {
  // 1. Hooks de contexto
  const { user } = useAuth();

  // 2. Hooks de datos
  const { data, isLoading } = useQuery(['key'], fetchFn);

  // 3. Hooks personalizados
  const { filters, handleFilterChange } = useOrderFilters(data);

  // 4. Estado local
  const [showModal, setShowModal] = useState(false);

  // 5. Efectos
  useEffect(() => {
    // ...
  }, []);

  // 6. Callbacks memoizados
  const handleClick = useCallback(() => {
    // ...
  }, []);

  // 7. Valores memoizados
  const expensiveValue = useMemo(() => {
    // ...
  }, [dependency]);

  // 8. Handlers normales (si no necesitan memoización)
  const handleSimpleClick = () => {
    // ...
  };

  // 9. Early returns
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;

  // 10. Render principal
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

### 4. Cuándo Usar useMemo y useCallback

```javascript
// ✅ Usar useMemo para:
// - Cálculos costosos
const sortedList = useMemo(() =>
  items.sort((a, b) => a.price - b.price),
  [items]
);

// - Objetos que se pasan como props/dependencias
const config = useMemo(() => ({
  theme: 'dark',
  locale: 'es'
}), []);

// ✅ Usar useCallback para:
// - Funciones que se pasan a useEffect
const fetchData = useCallback(async () => {
  // ...
}, [dependency]);

useEffect(() => {
  fetchData();
}, [fetchData]);

// - Funciones que se pasan a componentes memoizados
const MemoizedChild = React.memo(Child);
const handleClick = useCallback(() => {
  // ...
}, []);

<MemoizedChild onClick={handleClick} />

// ❌ NO usar useMemo/useCallback para:
// - Valores primitivos simples
const count = data.length; // No necesita useMemo

// - Funciones que solo se usan en el JSX actual
const handleClick = () => setCount(c => c + 1); // No necesita useCallback
<button onClick={handleClick}>Click</button>
```

### 5. Manejo de Errores

```javascript
// En utilidades: throw errors o return error objects
export function validateOrderData(data) {
  const errors = {};
  if (!data.client) errors.client = 'Requerido';

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// En hooks: return error state
export function useOrderSubmit() {
  const [error, setError] = useState(null);

  const submit = async (data) => {
    try {
      setError(null);
      await api.createOrder(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return { submit, error };
}

// En componentes: mostrar errors al usuario
const { submit, error } = useOrderSubmit();

return (
  <>
    {error && <div className="error">{error}</div>}
    <button onClick={submit}>Submit</button>
  </>
);
```

### 6. Documentación con JSDoc

```javascript
/**
 * Calcula el subtotal del carrito sumando precio × cantidad de cada item
 *
 * @param {Array<Object>} cart - Array de items del carrito
 * @param {string} cart[].id - ID único del item
 * @param {number} cart[].price - Precio unitario del item
 * @param {number} cart[].quantity - Cantidad de items
 * @returns {number} Subtotal calculado
 *
 * @example
 * const cart = [
 *   { id: '1', price: 100, quantity: 2 },
 *   { id: '2', price: 50, quantity: 1 }
 * ];
 * const subtotal = calculateSubtotal(cart); // 250
 */
export function calculateSubtotal(cart) {
  return cart.reduce((total, item) =>
    total + (item.price || 0) * (item.quantity || 1),
    0
  );
}
```

---

## Checklist Final para Cada Refactorización

### Pre-Refactorización
- [ ] Componente identificado y analizado
- [ ] Backup creado (`.ORIGINAL.jsx`)
- [ ] Directorios necesarios creados
- [ ] Plan de extracción definido

### Durante Refactorización
- [ ] Utilidades extraídas y testeadas
- [ ] Hooks personalizados creados con `useCallback` apropiado
- [ ] Componentes UI creados (< 150 líneas cada uno)
- [ ] Componente principal refactorizado
- [ ] Imports organizados correctamente

### Post-Refactorización
- [ ] Aplicación corre sin errores
- [ ] Todas las funcionalidades funcionan
- [ ] No hay infinite loops
- [ ] No hay warnings de React/ESLint
- [ ] Performance es buena
- [ ] Commit creado con mensaje descriptivo

---

## Recursos y Referencias

### Commits de Referencia

- **Commit 1**: `21d411a` - "Refactor OrderForm.jsx: Modular architecture (1,368 → 498 lines)"
  - Ver este commit para estructura completa de refactorización

- **Commit 2**: `afa65e0` - "Fix: Infinite loop en usePromotionsCalculation hook"
  - Ver este commit para ejemplo de cómo resolver infinite loops

### Archivos de Referencia

- `src/components/OrderForm.jsx` - Componente refactorizado (modelo a seguir)
- `src/components/OrderForm.ORIGINAL.jsx` - Versión original (para comparar)
- `src/hooks/usePromotionsCalculation.js` - Hook con patrón correcto de useCallback
- `src/utils/promotions/promotionHelpers.js` - Ejemplo de utilidades bien documentadas

### Patrones de React

- [React Hooks Documentation](https://react.dev/reference/react)
- [useCallback](https://react.dev/reference/react/useCallback)
- [useMemo](https://react.dev/reference/react/useMemo)
- [useEffect](https://react.dev/reference/react/useEffect)

---

## Resumen de Logros y Métricas Finales

### Componentes Refactorizados (6 de 6) ✅

Todos los componentes de la lista original han sido completados exitosamente:

| # | Componente | Antes | Después | Reducción | % | Archivos Nuevos | Hooks | Utils |
|---|------------|-------|---------|-----------|---|-----------------|-------|-------|
| 1 | OrderForm.jsx | 1,368 | 498 | 870 | 63.5% | 13 | 5 | 4 |
| 2 | OrderDetailView.jsx | 1,328 | 454 | 874 | 66.0% | 12 | 7 | 3 |
| 3 | OrderHistory.jsx | 1,280 | 120 | 1,160 | 90.6% | 9 | 4 | 2 |
| 4 | CashRegister.jsx | 1,241 | 284 | 957 | 77.1% | 11 | 6 | 4 |
| 5 | PromotionForm.jsx | 1,226 | 195 | 1,031 | 84.1% | 24 | 5 | 4 |
| 6 | OrderFormMobile.jsx | 1,140 | 586 | 554 | 48.6% | 0 | 0 (reutiliza) | 0 (reutiliza) |
| **TOTAL** | **7,583** | **2,137** | **5,446** | **71.8%** | **69** | **27 únicos** | **17 únicos** |

### Métricas de Impacto

**Reducción de Código**:
- Líneas totales reducidas: **5,446 líneas** (71.8%)
- Promedio de reducción por componente: 907 líneas
- Mayor reducción: OrderHistory.jsx (90.6%)
- Menor reducción: OrderFormMobile.jsx (48.6%, pero con 100% de reutilización)

**Modularización**:
- Archivos nuevos creados: **70+ archivos**
- Hooks reutilizables: **27 hooks** (varios compartidos entre componentes)
- Utilidades reutilizables: **17 archivos de utils**
- Componentes UI: **40+ componentes pequeños** (< 150 líneas cada uno)

**Reutilización de Código**:
- OrderFormMobile reutiliza **100% de hooks y utils** de OrderForm
- usePromotionsCalculation usado en **OrderForm y OrderFormMobile**
- useAutoScroll genérico usado en **múltiples componentes**
- promotionHelpers.js compartido entre **3 componentes**
- cartHelpers.js compartido entre **OrderForm y OrderFormMobile**

### Impacto en Mantenibilidad

**Antes de la Refactorización**:
- ❌ Componentes monolíticos (1,000+ líneas)
- ❌ Lógica de negocio mezclada con UI
- ❌ Funciones inline no testeables
- ❌ Duplicación entre desktop y móvil
- ❌ Difícil encontrar y arreglar bugs

**Después de la Refactorización**:
- ✅ Componentes pequeños y enfocados (< 600 líneas)
- ✅ Separación clara: Utils → Hooks → UI
- ✅ Funciones puras 100% testeables
- ✅ Cero duplicación (máxima reutilización)
- ✅ Bugs aislados y fáciles de localizar

### Bugs Críticos Resueltos

1. **Infinite Loop en usePromotionsCalculation** (commit `afa65e0`)
   - Problema: useCallback sin dependencies causaba loop infinito
   - Solución: Agregar dependencies correctas y usar funciones puras
   - Impacto: Sistema de promociones ahora estable y performante

2. **Validación de Promociones Inconsistente**
   - Problema: Lógica duplicada entre OrderForm y OrderFormMobile
   - Solución: Centralizar en promotionValidations.js
   - Impacto: Consistencia garantizada, un fix beneficia ambas versiones

### Arquitectura Resultante

```
src/
├── components/
│   ├── OrderForm.jsx (498 líneas) ← Orquestador
│   ├── OrderFormMobile.jsx (586 líneas) ← Orquestador móvil
│   ├── PromotionForm.jsx (195 líneas) ← Orquestador
│   ├── CashRegister.jsx (284 líneas) ← Orquestador
│   ├── orders/ (9 componentes UI)
│   ├── promotions/ (15 componentes UI)
│   ├── cash/ (7 componentes UI)
│   └── history/ (9 componentes UI)
├── hooks/
│   ├── usePromotionsCalculation.js ← Usado por 2 componentes
│   ├── useOrderFormData.js ← Usado por 2 componentes
│   ├── useCartManagement.js ← Usado por 2 componentes
│   ├── useAutoScroll.js ← Genérico reutilizable
│   └── (23 hooks más...)
└── utils/
    ├── promotions/ (4 archivos) ← Compartidos
    ├── cart/ (1 archivo) ← Compartido
    ├── cash/ (3 archivos)
    ├── history/ (2 archivos)
    └── (7 archivos más...)
```

---

## Patrones y Mejores Prácticas Documentadas

### Patrón de Refactorización Estándar (9 Pasos)

Este patrón se aplicó exitosamente en los 6 componentes:

1. **Análisis (30 min)**
   - Leer archivo completo
   - Identificar dominios y responsabilidades
   - Contar líneas y estimar reducción
   - Planificar extracción de módulos

2. **Backup (1 min)**
   - Crear archivo `.ORIGINAL.jsx`
   - Preservar para comparaciones futuras

3. **Estructura de Directorios (2 min)**
   - Crear `utils/[dominio]/`
   - Crear `components/[dominio]/` si necesario
   - No crear hooks nuevos para móvil

4. **Extracción de Utilidades (1-2 horas)**
   - Empezar con constantes y configuraciones
   - Extraer funciones puras (sin estado)
   - Documentar con JSDoc
   - Exportar funciones nombradas

5. **Creación de Hooks (1-2 horas)**
   - Extraer lógica con useState y useEffect
   - Usar useCallback para evitar loops
   - Usar useMemo para cálculos pesados
   - Retornar objeto con valores y handlers

6. **Creación de Componentes UI (1-2 horas)**
   - Componentes < 150 líneas
   - Usar PropTypes
   - Un componente = una responsabilidad
   - Reutilizar componentes existentes

7. **Refactorización del Componente Principal (30 min)**
   - Importar hooks y utils
   - Reducir a orquestador (~200-600 líneas)
   - Mantener estructura JSX similar
   - Pasar props a componentes hijos

8. **Testing y Verificación (15 min)**
   - Compilar sin errores
   - Probar funcionalidades críticas
   - Verificar performance (no loops)
   - Confirmar funcionalidad completa

9. **Documentación y Commit (10 min)**
   - Actualizar REFACTORING_GUIDE.md
   - Commit detallado con métricas
   - Co-authored by Claude

**Tiempo Total Promedio**: 4-6 horas por componente

### Hooks Más Reutilizables Creados

1. **`usePromotionsCalculation`** ⭐⭐⭐
   - Usado en: OrderForm.jsx, OrderFormMobile.jsx
   - Propósito: Cálculo automático de promociones aplicables
   - Reutilizable: ✅ Sí (usado en 2 componentes)
   - Líneas: 64
   - **Lección clave**: useCallback con dependencies correctas evita loops

2. **`useAutoScroll`** ⭐⭐⭐
   - Usado en: PromotionForm.jsx (potencial en más)
   - Propósito: Auto-scroll genérico con trigger
   - Reutilizable: ✅ Sí (100% genérico)
   - Líneas: 18
   - **Lección clave**: Hooks genéricos con params aumentan ROI

3. **`useOrderFormData`** ⭐⭐
   - Usado en: OrderForm.jsx, OrderFormMobile.jsx
   - Propósito: Estado del formulario de orden
   - Reutilizable: ✅ Sí (compartido desktop/móvil)
   - Líneas: 100+
   - **Lección clave**: Un hook puede servir múltiples layouts

4. **`useCartManagement`** ⭐⭐
   - Usado en: OrderForm.jsx, OrderFormMobile.jsx
   - Propósito: Manejo del carrito de servicios/productos
   - Reutilizable: ✅ Sí (compartido desktop/móvil)
   - Líneas: 48
   - **Lección clave**: Lógica de carrito independiente del UI

5. **`usePromotionItems`** ⭐⭐
   - Usado en: PromotionForm.jsx (potencial en más)
   - Propósito: Combina servicios y productos
   - Reutilizable: ✅ Sí (genérico)
   - Líneas: 24
   - **Lección clave**: useMemo para combinaciones pesadas

6. **`useExpensesManagement`** ⭐
   - Usado en: CashRegister.jsx
   - Propósito: Gestión de gastos con CRUD
   - Reutilizable: ✅ Sí (puede usarse en otros módulos financieros)
   - Líneas: ~60
   - **Lección clave**: Hooks de gestión CRUD son reutilizables

7. **`useWithdrawalsManagement`** ⭐
   - Usado en: CashRegister.jsx
   - Propósito: Gestión de retiros con CRUD
   - Reutilizable: ✅ Sí (puede usarse en otros módulos financieros)
   - Líneas: ~60
   - **Lección clave**: Patrón CRUD es replicable

### Utilidades Más Valiosas Creadas

1. **`promotionHelpers.js`** ⭐⭐⭐
   - Funciones: isPromotionRelevantForCart, getPromotionPriority, getItemsWithPromoBadge
   - Usado en: OrderForm, OrderFormMobile, PromotionForm
   - Líneas: 230
   - **Valor**: Lógica compleja de promociones centralizada y testeable

2. **`promotionCalculations.js`** ⭐⭐⭐
   - Funciones: calculateSubtotal, calculateTotalDiscount, calculateTotalPrice
   - Usado en: OrderForm, OrderFormMobile
   - Líneas: 45
   - **Valor**: Cálculos financieros precisos y reutilizables

3. **`cartHelpers.js`** ⭐⭐⭐
   - Funciones: generateCartItemId, addServiceToCart, addProductToCart, expandServicesForOrder
   - Usado en: OrderForm, OrderFormMobile
   - Líneas: 188
   - **Valor**: Operaciones del carrito consistentes entre versiones

4. **`cashCalculations.js`** ⭐⭐
   - Funciones: calculateOrdersSummary, calcularDiferencias, calcularGananciaDia
   - Usado en: CashRegister
   - Líneas: 200
   - **Valor**: Cálculos financieros complejos del cierre de caja

5. **`filterHelpers.js`** ⭐⭐
   - Funciones: 11 filtros diferentes para órdenes
   - Usado en: OrderHistory
   - Líneas: ~200
   - **Valor**: Sistema de filtros modulares y testeables

6. **`promotionValidations.js`** ⭐⭐
   - Funciones: validateForm, validate[Type]Promotion (7 tipos)
   - Usado en: PromotionForm
   - Líneas: 280
   - **Valor**: Validaciones exhaustivas centralizadas

7. **`promotionDataBuilder.js`** ⭐⭐
   - Funciones: buildPromotionData, buildTypeSpecificData
   - Usado en: PromotionForm
   - Líneas: 220
   - **Valor**: Construcción de datos con deleteField() para limpieza

### Patrones de Hooks Críticos

#### ✅ Patrón Correcto: useCallback con Dependencies

```javascript
// ✅ CORRECTO: Dependencies especificadas
const checkPromotions = useCallback(() => {
  if (cart.length === 0) return;

  const validPromotions = activePromotions.filter(promo =>
    validatePromotion(promo, cart, formData.phone)
  );

  setAppliedPromotions(validPromotions);
}, [cart, activePromotions, formData.phone]); // ← Dependencies

useEffect(() => {
  checkPromotions();
}, [checkPromotions]); // ← Ahora es estable
```

#### ❌ Patrón Incorrecto: Sin Dependencies

```javascript
// ❌ INCORRECTO: Sin dependencies causa loop infinito
const checkPromotions = useCallback(() => {
  // ... lógica ...
  setAppliedPromotions(validPromotions);
}); // ← Sin dependencies array

useEffect(() => {
  checkPromotions(); // ← Loop infinito!
}, [checkPromotions]);
```

#### ✅ Patrón Correcto: useMemo para Cálculos Pesados

```javascript
// ✅ CORRECTO: Memoizar cálculos pesados
const itemPromotionMap = useMemo(() => {
  const map = new Map();
  const sortedPromotions = [...appliedPromotions].sort((a, b) =>
    getPromotionPriority(a) - getPromotionPriority(b)
  );

  sortedPromotions.forEach(promo => {
    cart.forEach(item => {
      if (applies(promo, item)) {
        map.set(item.id, promo);
      }
    });
  });

  return map;
}, [appliedPromotions, cart]); // ← Recalcula solo cuando cambien
```

### Lecciones Aprendidas por Componente

#### OrderForm.jsx
1. **Infinite loop resuelto**: useCallback con dependencies correctas
2. **Separación clara**: 5 hooks + 4 utils + 9 componentes UI
3. **ROI de hooks**: Mismos hooks sirven para OrderFormMobile

#### OrderDetailView.jsx
1. **Hooks de acciones**: useOrderActions centraliza todas las operaciones
2. **Hooks de gestión**: usePaymentManagement, useInvoiceManagement, useOrderStatusManagement
3. **Componentes pequeños**: Ningún componente UI > 100 líneas

#### OrderHistory.jsx
1. **Filtros como helpers puros**: 11 filtros en un helper facilita testing
2. **Hooks genéricos**: usePagination reutilizable en múltiples componentes
3. **Componentes memoizados**: FilterDropdown con memo evita re-renders

#### CashRegister.jsx
1. **Cálculos complejos en hooks dedicados**: useCashRegisterCalculations con múltiples useMemo
2. **Hooks genéricos aumentan ROI**: useExpensesManagement, useWithdrawalsManagement reutilizables
3. **Validación centralizada**: Helper de validación permite testing fácil

#### PromotionForm.jsx
1. **Componentes tipo-específicos**: Cada tipo de promoción tiene su propio componente
2. **Orquestador limpio**: TypeConfigSection usa switch para renderizar componente correcto
3. **Validaciones exhaustivas**: Validación específica para cada uno de los 7 tipos
4. **deleteField() para limpieza**: Elimina campos huérfanos al editar promociones
5. **Help boxes visuales**: Ejemplos en cajas azules mejoran UX

#### OrderFormMobile.jsx
1. **Máxima reutilización es posible**: Desktop y móvil comparten 100% de la lógica de negocio
2. **Hooks agnósticos de UI**: Los hooks no dependen del layout, solo de la lógica
3. **Separación clara**: Hooks = lógica, JSX = presentación
4. **PaymentScreen reutilizable**: Un componente puede funcionar inline o pantalla completa
5. **Testing eficiente**: Un bug fix en hooks beneficia ambas versiones automáticamente

---

## Recomendaciones para Futuras Refactorizaciones

### Componentes Pendientes (Opcionales)

Componentes grandes que NO estaban en la lista original pero podrían beneficiarse de refactorización:

| Componente | Líneas | Prioridad | Complejidad | Notas |
|------------|--------|-----------|-------------|-------|
| Cart.jsx | 600 | Baja | Media | Ya usa `useCart` hook (parcialmente refactorizado) |
| CashClosureDetail.jsx | 558 | Baja | Baja | Solo helpers inline, componente view-only |
| InventoryForm.jsx | 406 | Media | Media | Similar a PromotionForm, CRUD de productos |
| EmpleadoItem.jsx | 368 | Baja | Baja | Vista de detalle, poco estado |
| PaymentScreen.jsx | 356 | Baja | Baja | Usado por OrderFormMobile, funciona bien |
| ClientItem.jsx | 352 | Baja | Baja | Vista de detalle, poco estado |

**Recomendación**: Los componentes críticos ya están refactorizados. Estos componentes pueden refactorizarse más adelante si causan problemas de mantenimiento.

### Próximos Pasos Sugeridos

1. **Crear Tests Unitarios** 🧪
   - Prioridad: **Alta**
   - Empezar con utilidades (funciones puras, sin React)
   - Continuar con hooks usando @testing-library/react-hooks
   - Usar Vitest (ya incluido en el proyecto)
   - Meta: Cobertura de 80% en utils y hooks críticos

2. **Documentar Componentes UI** 📖
   - Prioridad: **Media**
   - Agregar JSDoc a props de componentes
   - Crear Storybook (opcional) para visualizar componentes
   - Documentar patrones de uso

3. **Implementar TypeScript** 💙
   - Prioridad: **Baja** (opcional)
   - Mejora seguridad de tipos
   - Mejor autocompletado en IDE
   - Documentación automática de interfaces
   - Empezar con utils, luego hooks, luego componentes

4. **Extraer Biblioteca de Componentes** 📦
   - Prioridad: **Baja**
   - Identificar componentes verdaderamente genéricos
   - Crear paquete separado o directorio compartido
   - Documentar uso y props

### Reglas de Oro para Mantener la Arquitectura

1. **Nunca escribas lógica de negocio en componentes** ➡️ Usa hooks o utils
2. **Componentes > 200 líneas** ➡️ Considera refactorizar
3. **Código duplicado entre componentes** ➡️ Extrae a hook o util
4. **Funciones con efectos secundarios** ➡️ Usa hooks, no utils
5. **Funciones puras sin estado** ➡️ Usa utils, no hooks
6. **useCallback sin dependencies** ➡️ Revisa, probablemente causa bugs
7. **Nuevas features en OrderForm** ➡️ Verifica si aplican a OrderFormMobile
8. **Cambios en hooks compartidos** ➡️ Testa en TODOS los componentes que los usan

---

## Contacto y Soporte

Para dudas o problemas durante la refactorización:

1. Revisar esta guía completa
2. Comparar con commits de referencia
3. Revisar archivos ya refactorizados como modelo
4. Consultar documentación oficial de React

**Última actualización**: Diciembre 2025
**Versión**: 1.0

---

Este documento es un trabajo vivo. Actualízalo según aprendas nuevos patrones o encuentres mejores soluciones durante el proceso de refactorización.
