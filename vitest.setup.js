import { vi } from 'vitest';

/**
 * Vitest Setup File
 * Configura mocks globales para Firebase y otros servicios externos
 */

// ==================== FIREBASE MOCKS ====================

// Mock Firebase config - Evita inicialización real de Firebase en tests
vi.mock('./src/config/firebase', () => ({
  db: {}, // Mock Firestore database
  storage: {}, // Mock Firebase Storage
  auth: {} // Mock Firebase Auth
}));

// Mock Firebase Firestore functions
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  getDocFromServer: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  setDoc: vi.fn(),
  onSnapshot: vi.fn(() => vi.fn()), // Retorna unsubscribe function
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  runTransaction: vi.fn(),
  arrayUnion: vi.fn()
}));

// Mock Firebase Storage functions
vi.mock('firebase/storage', () => ({
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
  getStorage: vi.fn()
}));

// Mock Firebase Auth functions
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn()
}));

// ==================== EXTERNAL SERVICES MOCKS ====================

// Mock WhatsApp service (evita llamadas reales a API externa)
vi.mock('./src/services/whatsappService', () => ({
  sendDeliveryNotification: vi.fn(() => Promise.resolve()),
  sendOrderReceivedNotification: vi.fn(() => Promise.resolve())
}));

// ==================== GLOBAL TEST UTILITIES ====================

// Mock window.alert (usado en varios componentes)
global.alert = vi.fn();

// Mock console methods (opcional - descomenta si quieres silenciar logs en tests)
// global.console = {
//   ...console,
//   log: vi.fn(),
//   warn: vi.fn(),
//   error: vi.fn(),
// };
