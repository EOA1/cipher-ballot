/**
 * Vue adapter stub for React builds
 * Replaces @fhevm-sdk/dist/adapters/vue.js to prevent bundling Vue code
 * This file is browser-safe (no require, no Node.js dependencies)
 */

// Export all Vue composables as empty stubs
// These will never be called in React showcase
export function useWalletVue() {
  throw new Error('Vue adapters are not available in React showcase. Use useWallet instead.');
}

export function useFhevmVue() {
  throw new Error('Vue adapters are not available in React showcase. Use useFhevm instead.');
}

export function useContractVue() {
  throw new Error('Vue adapters are not available in React showcase. Use useContract instead.');
}

export function useDecryptVue() {
  throw new Error('Vue adapters are not available in React showcase. Use useDecrypt instead.');
}

export function useEncryptVue() {
  throw new Error('Vue adapters are not available in React showcase. Use useEncrypt instead.');
}

export function useFhevmOperationsVue() {
  throw new Error('Vue adapters are not available in React showcase. Use useFhevmOperations instead.');
}

