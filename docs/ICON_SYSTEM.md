# Sistema de Iconos

Sistema centralizado de iconos con **Iconify** y **flat-color-icons** - Reemplaza emojis con iconos profesionales y consistentes.

## 📁 Estructura

```
src/
└── icons/
    ├── Icon.jsx            # Componente wrapper (soporta Iconify + SVG local)
    ├── iconMap.js          # Diccionario semántico
    ├── index.js            # Exports centralizados
    └── characters/
        ├── index.js        # Exports de 99 personajes
        └── *.svg           # Archivos SVG de personajes
```

## 🎯 Uso Básico

### Componente Icon

```jsx
import { Icon } from '@/icons';

// Uso simple con nombre semántico
<Icon name="package" size={24} />
<Icon name="chart" size={32} />
<Icon name="success" size={20} />

// Con clases CSS adicionales
<Icon name="money" size={24} className="my-icon" />

// Con estilos inline
<Icon name="error" size={20} style={{ marginRight: '8px' }} />
```

**Props:**
- `name` (string): Nombre semántico del icono (ver iconMap)
- `size` (number): Tamaño en px (default: 24)
- `className` (string): Clases CSS adicionales
- `color` (string): Color (solo para iconos no-coloreados, default: 'inherit')
- `style` (object): Estilos inline adicionales

---

## 🗺️ Diccionario de Iconos (iconMap)

Los iconos se organizan por categorías semánticas. Usa el nombre semántico en lugar del emoji:

### Productos e Inventario
- `package` → 📦
- `box` → 📦
- `product` → 📦
- `inventory` → 🏪
- `shop` → 🏪
- `store` → 🏪

### Promociones y Celebraciones
- `celebration` → 🎉
- `promotion` → 🎉
- `offer` → 🎁
- `gift` → 🎁
- `sparkles` → ✨

### Success & Confirmaciones
- `success` → ✓
- `checkmark` → ✓
- `check` → ✓
- `approve` → 👍
- `thumbs-up` → 👍
- `like` → 👍

### Errores y Warnings
- `error` → ✕
- `cancel` → ✕
- `delete` → 🗑️
- `remove` → ✕
- `close` → ✕
- `warning` → ⚠️
- `alert` → ⚠️
- `danger` → ⚠️

### Reportes y Analytics
- `chart` → 📊
- `bar-chart` → 📊
- `line-chart` → 📈
- `pie-chart` → 🥧
- `statistics` → 📊
- `dashboard` → 📊
- `reports` → 📋

### Dinero y Finanzas
- `money` → 💰
- `cash` → 💵
- `payment` → 💳
- `credit-card` → 💳
- `wallet` → 👛
- `invoice` → 📄
- `expense` → 💸
- `withdraw` → 💸

### Documentos y Archivos
- `document` → 📋
- `file` → 📄
- `list` → 📝
- `history` → 📜
- `clipboard` → 📋
- `note` → 📝
- `archive` → 📁

### Calendario y Tiempo
- `calendar` → 📅
- `date` → 📅
- `time` → ⏰
- `clock` → ⏰
- `schedule` → 📅
- `deadline` → ⏱️

### Acciones
- `save` → 💾
- `backup` → 💾
- `edit` → ✏️
- `add` → ➕
- `plus` → ➕
- `minus` → ➖
- `search` → 🔍
- `filter` → 🔎
- `settings` → ⚙️
- `config` → ⚙️
- `print` → 🖨️
- `download` → ⬇️
- `upload` → ⬆️
- `share` → 📤
- `sync` → 🔄

### Usuarios y Personas
- `user` → 👤
- `client` → 👤
- `customer` → 👥
- `employee` → 👨‍💼
- `team` → 👥
- `profile` → 👤
- `admin` → 👨‍💼

### Comunicación
- `notification` → 🔔
- `message` → 💬
- `email` → 📧
- `phone` → 📞
- `call` → 📞
- `chat` → 💬

### Navegación
- `home` → 🏠
- `back` → ⬅️
- `forward` → ➡️
- `up` → ⬆️
- `down` → ⬇️
- `left` → ⬅️
- `right` → ➡️
- `menu` → ☰
- `more` → ⋯

### Estados
- `loading` → ⏳
- `processing` → ⚙️
- `pending` → ⏳
- `completed` → ✅
- `active` → ⚡
- `inactive` → 🔴
- `locked` → 🔒
- `unlocked` → 🔓

### Commerce & Shopping
- `cart` → 🛒
- `order` → 📦
- `delivery` → 🚚
- `shipping` → 📦
- `tag` → 🏷️
- `discount` → 💰
- `sale` → 💰

### Tech & System
- `database` → 🗄️
- `server` → 🖥️
- `api` → 🔌
- `code` → 💻
- `bug` → 🐛
- `launch` → 🚀
- `rocket` → 🚀

### Misc
- `info` → ℹ️
- `help` → ❓
- `question` → ❓
- `star` → ⭐
- `favorite` → ❤️
- `bookmark` → 🔖
- `flag` → 🚩

### Personajes (Character Icons) 👤
**99 iconos SVG locales** para perfiles de empleados. Usa el prefijo `character:` en el iconMap.

**Uso:** Especialmente diseñados para EmpleadoForm.jsx con categoría "characters".

**Ejemplo:**
```jsx
// En iconMap.js - Prefijo character:
'batman': 'character:batman',
'yoda': 'character:yoda',

// En componentes
<Icon name="batman" size={48} />
<Icon name="yoda" size={48} />

// En IconPickerButton
<IconPickerButton
  category="characters"
  value={formData.emoji}
  onChange={(iconName) => setFormData({ ...formData, emoji: iconName })}
/>
```

**Lista completa de personajes disponibles:**
- Superhéroes: batman, captain-america, hulk, iron-man, thor, deadpool, wolverine, thanos, venom, mystique, green-lantern, beast
- Star Wars: darth-vader, yoda, baby-yoda, chewbacca, c3po, r2d2, stormtrooper
- Disney/Pixar: woody, simba, timon, pumbaa, nemo, goofy, mike, sulley, wall-e, stitch, hercules
- Cartoon Network: jake, finn, bmo, ice-king, lumpy-space, steven
- Futurama: bender, fry, professor-farnsworth
- South Park: cartman, kenny, kyle, stan, the-coon
- Scooby-Doo: scooby, shaggy, fred-jones
- Los Simpsons: homer
- Spongebob: spongebob
- Monsters: gizmo, groot, cookie-monster, totoro, smurf
- Horror: chucky, freddy, jason, pennywise, mummy, scream
- Matrix/Sci-fi: neo, trinity, agent-smith, cylon
- Villanos: joker, joker-suicide, voldemort, grinch
- Anime/Games: sonic, mario, luigi
- Clásicos: popeye
- Otros: anonymous, john-wick, walter-white, dali, billy-mandy, jimmy-neutron

**Detalles técnicos:**
- Formato: SVG optimizado (50x50px)
- Renderizado: `<img src={characterSrc} />` (no Iconify)
- Mapping: `src/icons/characters/index.js`
- Total: 99 personajes

---

## 📝 Guía de Migración

### Migrar Emojis a Iconos

**Antes:**
```jsx
<button>📦 Productos</button>
<div className="icon">🎉</div>
<span>{emoji}</span>
```

**Después:**
```jsx
import { Icon } from '@/icons';

<button><Icon name="package" size={20} /> Productos</button>
<div className="icon"><Icon name="celebration" size={24} /></div>
<span><Icon name={iconName} size={18} /></span>
```

### Migrar en Componentes de Tab

**Antes:**
```jsx
<button className="tab">
  📊 Reportes
</button>
```

**Después:**
```jsx
import { Icon } from '@/icons';

<button className="tab">
  <Icon name="chart" size={20} /> Reportes
</button>
```

### Migrar en Constantes/Utils

**Antes:**
```js
// inventoryConstants.js
export const DEFAULT_EMOJI = '📦';
```

**Después:**
```jsx
// No uses emoji directo en constantes, usa Icon en el componente:
import { Icon } from '@/icons';

// En el componente:
<Icon name="package" size={24} />
```

O si necesitas el nombre:
```js
// inventoryConstants.js
export const DEFAULT_ICON = 'package';

// En el componente:
import { DEFAULT_ICON } from '../utils/inventoryConstants';
<Icon name={DEFAULT_ICON} size={24} />
```

### Migrar IconPicker (Selección de Usuario)

Para permitir que usuarios seleccionen iconos (ej. para productos/promociones):

```jsx
import { Icon } from '@/icons';
import { iconMap } from '@/icons';

// Lista de iconos permitidos para selección
const allowedIcons = [
  'package', 'gift', 'celebration', 'money',
  'cart', 'star', 'tag', 'heart'
];

<div className="icon-picker">
  {allowedIcons.map((iconName) => (
    <button
      key={iconName}
      onClick={() => setSelectedIcon(iconName)}
      className={selectedIcon === iconName ? 'active' : ''}
    >
      <Icon name={iconName} size={32} />
    </button>
  ))}
</div>

// Guardar el nombre del icono en la base de datos
// En el display:
<Icon name={product.icon} size={24} />
```

---

## 🔍 Encontrar Iconos

### Buscar en el catálogo completo

Ver todos los iconos disponibles (329 iconos):
- [Iconify Icon Sets - Flat Color Icons](https://icon-sets.iconify.design/flat-color-icons/)
- [React Icons - FC](https://react-icons.github.io/react-icons/icons/fc/)

### Usar un icono no mapeado

Si necesitas un icono específico que no está en el iconMap:

```jsx
// Usar directamente el nombre de flat-color-icons
<Icon name="flat-color-icons:nombre-del-icono" size={24} />

// O agregarlo al iconMap.js:
export const iconMap = {
  // ...
  'mi-nuevo-icono': 'flat-color-icons:nombre-del-icono',
};
```

---

## 🎨 Personalización

### Iconos con Tamaño Dinámico

```jsx
const sizes = { sm: 16, md: 24, lg: 32, xl: 48 };

<Icon name="package" size={sizes.lg} />
```

### Iconos con Clases CSS

```jsx
<Icon name="success" size={20} className="text-green-500" />
<Icon name="error" size={20} className="text-red-500" />
```

### Iconos Inline

```jsx
<p>
  Tu pedido <Icon name="package" size={16} style={{ verticalAlign: 'middle' }} />
  ha sido enviado!
</p>
```

---

## ✅ Beneficios vs Emojis

| Aspecto | Emojis | Flat Color Icons |
|---------|--------|------------------|
| **Consistencia** | ❌ Diferente en cada OS | ✅ Idéntico en todos los OS |
| **Profesional** | ⚠️ Casual | ✅ Profesional |
| **Control** | ❌ No customizable | ✅ Tamaño, color, estilo |
| **Accesibilidad** | ⚠️ Limitado | ✅ aria-label, semantic |
| **Performance** | ✅ Ligero | ✅ SVG optimizado |
| **Branding** | ❌ Genérico | ✅ Consistente |

---

## ✅ Ejemplos Prácticos de Migración

### Páginas Completadas

#### 1. Reports.jsx ✅
**Migración:** AnimatedTabs + Icon
**Ubicación:** `src/pages/Reports.jsx`

```jsx
import { AnimatedTabs } from '../components/animated';
import { Icon } from '../icons';

const tabs = [
  {
    id: 'reportes',
    label: 'Reportes',
    icon: <Icon name="chart" size={20} />,
    content: <ChartsTab {...props} />
  },
  // ...más tabs
];

<AnimatedTabs tabs={tabs} defaultTab="reportes" onTabChange={setActiveTab} />
```

#### 2. Orders.jsx ✅
**Migración:** AnimatedTabs + Icon + Botón icon-only
**Ubicación:** `src/pages/Orders.jsx`

**Botón Nueva Orden:**
```jsx
<PageHeader
  title="Órdenes"
  buttonIcon={<Icon name="add" size={32} />}  // Sin buttonLabel
  onButtonClick={handleOpenNewOrder}
/>
```

**Tabs con AnimatedTabs:**
```jsx
const renderOrdersList = (tabKey) => (
  <div className="orders-list">
    {/* contenido de la tab */}
  </div>
);

const tabs = [
  {
    id: 'recibidos',
    label: 'Recibidos',
    icon: <Icon name="download" size={20} />,
    content: renderOrdersList('recibidos')
  },
  // ...más tabs
];

<AnimatedTabs tabs={tabs} defaultTab="recibidos" onTabChange={setActiveTab} responsive={true} />
```

#### 3. Empleados.jsx ✅
**Migración:** Icon + Botón icon-only
**Ubicación:** `src/pages/Empleados.jsx`

**Antes:**
```jsx
buttonLabel="Agregar Empleado"
buttonIcon="➕"
```

**Después:**
```jsx
buttonIcon={<Icon name="add" size={32} />}  // Sin buttonLabel
```

**Empty State:**
```jsx
// Antes
<div className="empty-icon">😕</div>

// Después
<div className="empty-icon"><Icon name="question" size={48} /></div>
```

#### 4. Dashboard.jsx ✅
**Migración:** Icon (sin tabs)
**Ubicación:** `src/pages/Dashboard.jsx`

```jsx
const stats = [
  { icon: <Icon name="delivery" size={32} />, label: 'Para Entregar', value: '5' },
  { icon: <Icon name="processing" size={32} />, label: 'En Proceso', value: '12' },
  { icon: <Icon name="money" size={32} />, label: 'Pagos Pendientes', value: '3' },
  // ...más stats
];
```

#### 5. EmpleadoForm.jsx ✅
**Migración:** IconPickerButton con categoría "characters"
**Ubicación:** `src/components/EmpleadoForm.jsx`

**Antes:**
```jsx
<div className="form-group">
  <label htmlFor="emoji">Emoji/Avatar (opcional)</label>
  <input
    type="text"
    id="emoji"
    name="emoji"
    value={formData.emoji}
    onChange={handleChange}
    placeholder="😊"
    maxLength="2"
  />
</div>
```

**Después:**
```jsx
import { IconPickerButton } from './iconPicker';

<IconPickerButton
  label="Icono del Empleado (opcional)"
  value={formData.emoji}
  onChange={(iconName) => setFormData({ ...formData, emoji: iconName })}
  category="characters"
  placeholder="Seleccionar personaje"
/>

// Renderizar el icono seleccionado en EmpleadoCard:
<Icon name={employee.emoji} size={48} />
```

**Características:**
- 99 iconos de personajes (Batman, Yoda, Homer, Mario, etc.)
- Búsqueda en tiempo real
- Grid responsivo con preview
- SVG locales (no Iconify)

#### 6. PromotionCard.jsx ✅
**Migración:** Icon para todos los iconos
**Ubicación:** `src/components/PromotionCard.jsx`

**Migrados:**
- Icono principal de promoción (emoji del usuario)
- Iconos de detalles: `calendar`, `tag`, `money`, `user`
- Iconos de acciones: `edit`, `delete`

**Ejemplo:**
```jsx
<div className="promotion-detail">
  <span className="detail-icon"><Icon name="calendar" size={16} /></span>
  <span className="detail-text">{formatDateRange()}</span>
</div>
```

#### 7. InventoryCard.jsx ✅
**Migración:** Icon para badges y código de barras
**Ubicación:** `src/components/InventoryCard.jsx`

**Migrados:**
- Código de barras: `📊` → `<Icon name="tag" size={14} />`
- Stock bajo: `⚠️` → `<Icon name="alert" size={16} />`
- Stock normal: `✓` → `<Icon name="check" size={16} />`

**Antes:**
```jsx
<span className="product-barcode">
  📊 {product.barcode}
</span>
<div className="stock-badge">
  {isLowStock ? '⚠️' : '✓'} Stock: {product.stock}
</div>
```

**Después:**
```jsx
<span className="product-barcode">
  <Icon name="tag" size={14} /> {product.barcode}
</span>
<div className="stock-badge">
  <Icon name={isLowStock ? 'alert' : 'check'} size={16} /> Stock: {product.stock}
</div>
```

#### 8. Sidebar.jsx ✅
**Migración:** Icon para toda la navegación
**Ubicación:** `src/components/Sidebar.jsx`

**Migrados todos los iconos de navegación:**
- Dashboard: `home`
- Órdenes: `order`
- Clientes: `team`
- Servicios: `services`
- Empleados: `employee`
- Inventario: `package`
- Promociones: `promotion`
- Reportes: `reports`
- Configuración: `settings`
- Cerrar Sesión: `close`

**Antes:**
```jsx
const menuItems = [
  { path: '/', icon: '🏠', label: 'Dashboard' },
  { path: '/orders', icon: '📦', label: 'Órdenes' },
  // ...
];

<span className="menu-icon">{item.icon}</span>
```

**Después:**
```jsx
const menuItems = [
  { path: '/', icon: 'home', label: 'Dashboard' },
  { path: '/orders', icon: 'order', label: 'Órdenes' },
  // ...
];

<span className="menu-icon"><Icon name={item.icon} size={20} /></span>
```

#### 9. PageHeader.jsx ✅
**Migración:** Icon para carrito
**Ubicación:** `src/components/PageHeader.jsx`

**Migrado:**
- Icono de carrito: `🛒` → `<Icon name="cart" size={20} />`

**Antes:**
```jsx
<button className="cart-indicator-btn">
  🛒
  <span className="cart-badge">{cartItemCount}</span>
</button>
```

**Después:**
```jsx
<button className="cart-indicator-btn">
  <Icon name="cart" size={20} />
  <span className="cart-badge">{cartItemCount}</span>
</button>
```

#### 10. Notification.jsx ✅
**Migración:** Icon para todos los estados
**Ubicación:** `src/components/Notification.jsx`

**Migrados todos los iconos de notificación:**
- Success: `✅` → `success`
- Error: `❌` → `error`
- Warning: `⚠️` → `warning`
- Info: `ℹ️` → `info`
- Close: `✕` → `close`

**Antes:**
```jsx
const getIcon = (type) => {
  switch (type) {
    case 'success': return '✅';
    case 'error': return '❌';
    case 'warning': return '⚠️';
    default: return 'ℹ️';
  }
};

<div className="notification-icon">{getIcon(notification.type)}</div>
<button className="notification-close">✕</button>
```

**Después:**
```jsx
const getIconName = (type) => {
  switch (type) {
    case 'success': return 'success';
    case 'error': return 'error';
    case 'warning': return 'warning';
    default: return 'info';
  }
};

<div className="notification-icon">
  <Icon name={getIconName(notification.type)} size={20} />
</div>
<button className="notification-close">
  <Icon name="close" size={16} />
</button>
```

#### 11. Inventory.jsx (Page) ✅
**Migración:** Icon para stats y empty states
**Ubicación:** `src/pages/Inventory.jsx`

**Migrados:**
- Stat icons: `📦` → `package`, `⚠️` → `alert`, `💰` → `money`
- Empty state: `📦` → `package`

**Antes:**
```jsx
<div className="stat-icon">📦</div>
<div className="stat-icon">⚠️</div>
<div className="stat-icon">💰</div>
<div className="empty-icon">📦</div>
```

**Después:**
```jsx
<div className="stat-icon"><Icon name="package" size={32} /></div>
<div className="stat-icon"><Icon name="alert" size={32} /></div>
<div className="stat-icon"><Icon name="money" size={32} /></div>
<div className="empty-icon"><Icon name="package" size={64} /></div>
```

#### 12. ServiceCard.jsx ✅
**Migración:** Icon para duración
**Ubicación:** `src/components/ServiceCard.jsx`

**Migrados:**
- Duración: `⏱️` → `<Icon name="clock" size={16} />`
- Emoji principal: Ya usa `<Icon name={emoji || 'settings'} size={24} />` ✅

**Antes:**
```jsx
<div className="service-duration">⏱️ {duration}</div>
```

**Después:**
```jsx
<div className="service-duration"><Icon name="clock" size={16} /> {duration}</div>
```

#### 13. ServiceForm.jsx ✅
**Migración:** Icon para menú, botones y header + IconPickerButton + constantes
**Ubicación:** `src/components/ServiceForm.jsx`

**Migrados:**
- Menú de 3 puntos: `⋮` → `<Icon name="more" size={20} />`
- Duplicar: `📋` → `<Icon name="clipboard" size={16} />`
- Loading: `⏳` → `<Icon name="loading" size={16} />`
- Eliminar: `🗑️` → `<Icon name="delete" size={16} />`
- Header icon: `{formData.emoji}` → `<Icon name={formData.emoji} size={32} />`
- Botón guardar: `💾` → `<Icon name="save" size={16} />`
- Botón crear: `✨` → `<Icon name="sparkles" size={16} />`
- Constantes: `emoji: '⚙️'` → `emoji: 'settings'`
- IconPickerButton ya implementado con categoría "services" ✅

**Antes:**
```jsx
// Menú
<button className="service-menu-button">⋮</button>

// Duplicar
<span className="menu-icon">{isSubmitting ? '⏳' : '📋'}</span>

// Eliminar
<span className="menu-icon">🗑️</span>

// Header
<div className="form-icon">{formData.emoji}</div>

// Botones
{isSubmitting ? '⏳ Guardando...' : (initialData ? '💾 Guardar Cambios' : '✨ Crear Servicio')}

// Constantes
emoji: '⚙️'
```

**Después:**
```jsx
// Menú
<button className="service-menu-button">
  <Icon name="more" size={20} />
</button>

// Duplicar
<span className="menu-icon">
  <Icon name={isSubmitting ? 'loading' : 'clipboard'} size={16} />
</span>

// Eliminar
<span className="menu-icon"><Icon name="delete" size={16} /></span>

// Header
<div className="form-icon"><Icon name={formData.emoji} size={32} /></div>

// Botones
{isSubmitting ? (
  <><Icon name="loading" size={16} /> Guardando...</>
) : initialData ? (
  <><Icon name="save" size={16} /> Guardar Cambios</>
) : (
  <><Icon name="sparkles" size={16} /> Crear Servicio</>
)}

// Constantes
emoji: 'settings'
```

#### 14. promotionInitialState.js ✅
**Migración:** Constantes de emoji a nombres de iconos
**Ubicación:** `src/utils/promotions/promotionInitialState.js`

**Migrados:**
- Estado inicial: `emoji: '🎉'` → `emoji: 'celebration'`
- Fallback: `emoji: initialData.emoji || '🎉'` → `emoji: initialData.emoji || 'celebration'`

**Antes:**
```js
export const INITIAL_FORM_STATE = {
  name: '',
  description: '',
  emoji: '🎉',
  // ...
};

// En loadInitialData
emoji: initialData.emoji || '🎉',
```

**Después:**
```js
export const INITIAL_FORM_STATE = {
  name: '',
  description: '',
  emoji: 'celebration',
  // ...
};

// En loadInitialData
emoji: initialData.emoji || 'celebration',
```

#### 15. BasicInfoSection.jsx (Promociones) ✅
**Migración:** IconPickerButton - Ya implementado
**Ubicación:** `src/components/promotions/BasicInfoSection.jsx`

**Estado:**
- ✅ IconPickerButton ya implementado con categoría "promotions"
- ✅ No requiere cambios de código
- Solo documentación

**Implementación actual:**
```jsx
<IconPickerButton
  label="Icono"
  value={formData.emoji}
  onChange={handleIconChange}
  category="promotions"
  placeholder="Seleccionar icono"
/>
```

#### 16. BasicProductInfo.jsx (Inventario) ✅
**Migración:** IconPickerButton - Ya implementado
**Ubicación:** `src/components/inventory/BasicProductInfo.jsx`

**Estado:**
- ✅ IconPickerButton ya implementado con categoría "products"
- ✅ No requiere cambios de código
- Solo documentación

**Implementación actual:**
```jsx
<IconPickerButton
  label="Icono del Producto (opcional)"
  value={formData.emoji}
  onChange={handleIconChange}
  category="products"
  placeholder="Seleccionar icono"
/>
```

#### 17. InventoryForm.jsx ✅
**Migración:** Icon para botón loading
**Ubicación:** `src/components/InventoryForm.jsx`

**Migrados:**
- Botón submit loading: `⏳ Guardando...` → `<Icon name="loading" size={16} /> Guardando...`

**Antes:**
```jsx
{isSubmitting
  ? '⏳ Guardando...'
  : (initialData ? 'Guardar Cambios' : 'Agregar Producto')
}
```

**Después:**
```jsx
{isSubmitting ? (
  <>
    <Icon name="loading" size={16} /> Guardando...
  </>
) : (
  initialData ? 'Guardar Cambios' : 'Agregar Producto'
)}
```

#### 18. WithdrawalForm.jsx ✅
**Migración:** Icon para banner de efectivo
**Ubicación:** `src/components/WithdrawalForm.jsx`

**Migrados:**
- Banner efectivo disponible: `💰 Efectivo Disponible` → `<Icon name="money" size={20} /> Efectivo Disponible`

**Antes:**
```jsx
<strong>💰 Efectivo Disponible: {formatCurrency(efectivoDisponible)}</strong>
```

**Después:**
```jsx
<strong><Icon name="money" size={20} /> Efectivo Disponible: {formatCurrency(efectivoDisponible)}</strong>
```

---

## 🚀 Migración Masiva

### Archivos a Migrar

**✅ Completado:**
1. `src/pages/Reports.jsx` - AnimatedTabs + Icon
2. `src/pages/Orders.jsx` - AnimatedTabs + Icon
3. `src/pages/Empleados.jsx` - Icon
4. `src/pages/Dashboard.jsx` - Icon
5. `src/components/EmpleadoForm.jsx` - IconPickerButton (categoría "characters", 99 personajes)
6. `src/components/PromotionCard.jsx` - Icon (calendario, tag, money, user, edit, delete)
7. `src/components/InventoryCard.jsx` - Icon (tag, alert, check)
8. `src/components/Sidebar.jsx` - Icon (navegación: home, order, team, services, employee, package, promotion, reports, settings)
9. `src/components/PageHeader.jsx` - Icon (cart)
10. `src/components/Notification.jsx` - Icon (success, error, warning, info, close)
11. `src/pages/Inventory.jsx` - Icon (stats: package, alert, money; empty state: package)
12. `src/components/ServiceCard.jsx` - Icon (clock para duración)
13. `src/components/ServiceForm.jsx` - Icon (menú, botones, header) + IconPickerButton (categoría "services") + constantes
14. `src/utils/promotions/promotionInitialState.js` - Constantes (emoji strings → icon names)
15. `src/components/promotions/BasicInfoSection.jsx` - IconPickerButton (categoría "promotions") - Ya implementado ✅
16. `src/components/inventory/BasicProductInfo.jsx` - IconPickerButton (categoría "products") - Ya implementado ✅
17. `src/components/InventoryForm.jsx` - Icon (loading en botón submit)
18. `src/components/WithdrawalForm.jsx` - Icon (money en banner de efectivo)

**Prioridad Alta:**
1. ~~`src/utils/inventoryConstants.js`~~ (archivo no existe)
2. ~~`src/utils/promotions/promotionInitialState.js`~~ ✅
3. ~~`src/components/ServiceCard.jsx`~~ ✅
4. ~~`src/components/ServiceForm.jsx`~~ ✅

**Prioridad Media:**
- Todos los componentes de formulario (15+ archivos)
- Componentes de modal
- Empty states en otros componentes

**Prioridad Baja:**
- Contexts (AuthContext, CartContext)
- Utils helpers
- Mensajes de error

### Estrategia de Migración

1. **Buscar y reemplazar** emojis comunes:
   - Busca: `📦` → Reemplaza con: `<Icon name="package" size={20} />`
   - Busca: `🎉` → Reemplaza con: `<Icon name="celebration" size={20} />`
   - Busca: `📊` → Reemplaza con: `<Icon name="chart" size={20} />`
   - etc.

2. **Agregar import** en cada archivo:
   ```jsx
   import { Icon } from '../icons'; // Ajustar ruta según nivel
   ```

3. **Verificar tamaños** según contexto:
   - Tabs/Buttons: 20px
   - Cards/Headers: 24px
   - Iconos grandes: 32-48px
   - Inline text: 16-18px

---

## ✅ IconPickerModal - IMPLEMENTADO

### Objetivo ✅
Selector visual de iconos implementado para reemplazar los campos de texto de emoji en formularios.

### Alcance ✅
**Formularios actualizados:**
1. ✅ `EmpleadoForm.jsx` - Categoría: "characters" (99 personajes)
2. ✅ `ServiceForm.jsx` - Categoría: "services"
3. ✅ `BasicInfoSection.jsx` (Promociones) - Categoría: "promotions"
4. ✅ `BasicProductInfo.jsx` (Productos) - Categoría: "products"

### Arquitectura Implementada ✅

#### Componentes ✅
1. ✅ **IconPickerModal.jsx** - Modal principal con grid de iconos
2. ✅ **IconPickerButton.jsx** - Botón trigger con preview
3. ✅ **IconGrid.jsx** - Grid responsivo de iconos
4. ✅ **IconCategories.jsx** - Tabs de categorías (11 categorías incluyendo characters)

#### Estructura de Archivos ✅
```
src/components/iconPicker/
├── IconPickerModal.jsx       ✅
├── IconPickerModal.css        ✅
├── IconPickerButton.jsx       ✅
├── IconPickerButton.css       ✅
├── IconGrid.jsx               ✅
├── IconCategories.jsx         ✅
└── index.js                   ✅
```

### Características Clave

#### UI/UX
- ✅ Modal animado con AnimatedModal
- ✅ Grid responsive (8 cols desktop → 3 cols móvil)
- ✅ Búsqueda en tiempo real
- ✅ Filtrado por categorías
- ✅ Preview del icono seleccionado
- ✅ Hover states animados (scale 1.1)
- ✅ Estados: normal, hover, selected

#### Performance
- ✅ Lazy loading del modal (dynamic import)
- ✅ useMemo para filtrado de iconos
- ✅ useCallback para handlers
- ✅ Virtualización opcional (react-window)

#### Accesibilidad
- ✅ role="dialog" y aria-labels
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus trap dentro del modal
- ✅ aria-selected para icono activo

#### Testing
- ✅ Tests unitarios con Vitest
- ✅ Testing de búsqueda y filtrado
- ✅ Testing de accesibilidad
- ✅ Testing de keyboard navigation

### Uso en Formularios

**Antes:**
```jsx
<input
  type="text"
  name="emoji"
  value={formData.emoji}
  onChange={handleChange}
  placeholder="🎉"
  maxLength="2"
/>
```

**Después:**
```jsx
import { IconPickerButton } from './iconPicker';

<IconPickerButton
  label="Icono del Servicio"
  value={formData.emoji}
  onChange={(iconName) => setFormData({ ...formData, emoji: iconName })}
  category="services"
  required={true}
  error={errors.emoji}
/>
```

### Categorías de Iconos

Basado en iconMap.js (~120 iconos):

| Categoría | Cantidad | Ejemplos |
|-----------|----------|----------|
| products | 10 | package, box, inventory, shop |
| services | 8 | tools, settings, processing |
| users | 6 | user, employee, team, admin |
| promotions | 5 | celebration, gift, offer |
| status | 8 | success, error, warning |
| actions | 15 | add, edit, delete, save |
| navigation | 10 | home, back, forward, menu |
| finance | 8 | money, cash, payment |
| documents | 8 | document, file, clipboard |
| **characters** | **99** | **batman, yoda, homer, mario** |
| misc | 40+ | calendar, notification, etc. |

### Fases de Implementación ✅

1. ✅ **Fase 1:** Componente base (modal + grid estático)
2. ✅ **Fase 2:** Búsqueda y filtros
3. ✅ **Fase 3:** IconPickerButton wrapper
4. ✅ **Fase 4:** Optimización (memoization con useMemo/useCallback)
5. ✅ **Fase 5:** Integración en EmpleadoForm con categoría "characters"
6. ✅ **Fase 6:** Documentación (ICON_SYSTEM.md actualizado)

### Beneficios

- ✅ UX mejorada (visual vs texto)
- ✅ Previene errores de emoji inválidos
- ✅ Búsqueda rápida de iconos
- ✅ Consistencia en toda la app
- ✅ Responsive y accesible
- ✅ Reutilizable en múltiples formularios

### Estado Actual ✅

**Implementación completada con:**
- 11 categorías de iconos (products, services, users, promotions, status, actions, navigation, finance, documents, characters, misc)
- 99 iconos de personajes SVG para empleados
- Soporte dual: Iconify (flat-color-icons) + SVG local (characters)
- Búsqueda en tiempo real y filtrado por categorías
- Grid responsivo con AnimatedModal
- Optimización con React hooks (useMemo, useCallback)

**Próximos pasos:**
- ✅ Integrar IconPickerButton en ServiceForm.jsx (categoría "services") - COMPLETADO
- ✅ Integrar IconPickerButton en BasicInfoSection.jsx de Promociones (categoría "promotions") - YA ESTABA IMPLEMENTADO
- ✅ Integrar IconPickerButton en BasicProductInfo.jsx (categoría "products") - YA ESTABA IMPLEMENTADO
- **Fase 2:** Continuar con archivos de Prioridad Media (15+ archivos con emojis detectados: CashRegister, OrderDetailView, PaymentScreen, ValidationBanner, etc.)

---

## 🔗 Referencias

- [Iconify React Docs](https://iconify.design/docs/icon-components/react/)
- [Flat Color Icons Catalog](https://icon-sets.iconify.design/flat-color-icons/)
- [Icon Component Source](../src/icons/Icon.jsx)
- [Icon Map Source](../src/icons/iconMap.js)
