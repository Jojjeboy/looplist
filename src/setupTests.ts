import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase modules globally
vi.mock('firebase/app', () => ({
    initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(() => ({})),
    GoogleAuthProvider: vi.fn(),
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn((auth, callback) => {
        // Call callback with null user by default
        callback(null);
        return vi.fn(); // Return unsubscribe function
    }),
}));

vi.mock('firebase/firestore', () => ({
    initializeFirestore: vi.fn(() => ({})),
    persistentLocalCache: vi.fn(() => ({})),
    persistentMultipleTabManager: vi.fn(() => ({})),
    collection: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    onSnapshot: vi.fn(() => vi.fn()),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    getDocs: vi.fn(),
}));

