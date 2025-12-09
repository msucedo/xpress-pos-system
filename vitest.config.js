import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  test: {
    // Entorno de pruebas (simula el DOM del navegador)
    environment: 'happy-dom',

    // Configuración global
    globals: true,

    // Archivos de setup (configurar mocks de Firebase y servicios externos)
    setupFiles: ['./vitest.setup.js'],

    // Cobertura de código
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      include: [
        'src/utils/promotions/promotionCalculations.js',
        'src/utils/promotions/promotionHelpers.js',
        'src/utils/cart/cartHelpers.js',
        'src/utils/employees/employeeHelpers.js',
        'src/utils/cash/cashCalculations.js',
        'src/utils/history/filterHelpers.js',
        'src/hooks/usePagination.js',
        'src/hooks/useAutoScroll.js',
        'src/hooks/useDropdownState.js',
        'src/hooks/useCartManagement.js',
        'src/hooks/useOrderFormData.js',
        'src/hooks/usePromotionsCalculation.js'
      ],
      exclude: [
        'src/**/*.test.{js,jsx}',
        'src/**/*.spec.{js,jsx}',
        'src/**/__tests__/**',
        'node_modules/**'
      ],
      // Umbrales de cobertura (80% para utils y hooks críticos testeados)
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    },

    // Resolver alias como en vite.config.js
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
});
