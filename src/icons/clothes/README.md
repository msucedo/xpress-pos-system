# Iconos de Ropa (PNG Locales)

Esta carpeta contiene iconos PNG descargados de [Flat Color Icons](https://icon-sets.iconify.design/flat-color-icons/) para productos de ropa.

## Cómo Agregar un Nuevo Icono de Ropa

### Paso 1: Descargar el PNG
1. Ve a https://icon-sets.iconify.design/flat-color-icons/
2. Busca el icono que necesitas (ej: "zipper", "heel", "apron")
3. Haz clic en el icono
4. Selecciona "PNG" como formato
5. Selecciona tamaño (recomendado: 50x50 o 100x100)
6. Descarga el PNG

### Paso 2: Colocar el Archivo
Coloca el archivo PNG descargado en esta carpeta:
```
src/icons/clothes/
├── index.js
├── README.md
└── tu-icono.png    ← Aquí
```

**Importante:** Usa nombres en kebab-case (ej: `zipper.png`, `mens-belt.png`, `wash-by-hand.png`)

### Paso 3: Importar en index.js
Abre `src/icons/clothes/index.js` y agrega el import:

```javascript
// Ejemplo
import zipper from './zipper.png';
import heel from './heel.png';
import apron from './apron.png';

export const clothesIcons = {
  'zipper': zipper,
  'heel': heel,
  'apron': apron,
};
```

### Paso 4: Agregar al iconMap.js
Abre `src/icons/iconMap.js` y agrega el icono en la sección de ROPA:

```javascript
// ========================================
// ROPA (Clothes PNG Icons)
// ========================================
'zipper': 'clothes:zipper',
'heel': 'clothes:heel',
'heel-shoe': 'clothes:heel',  // Alias opcional
'apron': 'clothes:apron',
```

### Paso 5: Agregar a IconCategories.jsx
Abre `src/components/iconPicker/IconCategories.jsx` y agrega el nombre en la categoría `clothes`:

```javascript
clothes: {
  label: 'Ropa',
  icons: ['zipper', 'heel', 'apron']  // ← Agregar aquí
},
```

### Paso 6: Usar el Icono
Ahora puedes usar el icono en tu aplicación:

```jsx
import { Icon } from '@/icons';

<Icon name="zipper" size={24} />
<Icon name="heel" size={32} />
<Icon name="apron" size={48} />
```

## Iconos de Ropa Disponibles en Flat Color Icons

Estos son algunos iconos relacionados con ropa que puedes descargar:

- `zipper` - Cremallera
- `heel` - Zapato de tacón
- `mens-belt` - Cinturón de hombre
- `slippers` - Pantuflas
- `wash-by-hand` - Lavar a mano
- `hanger` - Percha
- `apron` - Delantal
- `hand-fan` - Abanico
- `choose-a-dress` - Elegir un vestido

## Notas Técnicas

- **Formato:** PNG
- **Tamaño recomendado:** 50x50px o 100x100px (se escalan automáticamente)
- **Renderizado:** `<img src={clothesSrc} />` (no Iconify)
- **Prefijo:** Todos los iconos usan el prefijo `clothes:`
- **Soporte:** Completamente integrado con IconPicker

## Estructura de Archivos

```
src/icons/clothes/
├── index.js         # Índice de exportación
├── README.md        # Esta guía
└── *.png            # Tus archivos PNG
```
