/**
 * Universal FHEVM SDK
 * Clean, simple implementation that actually works
 */

// Core FHEVM functionality
export * from './core/index.js';

// Framework adapters - explicit exports to avoid conflicts
export { useWallet, useFhevm, useContract, useDecrypt, useEncrypt } from './adapters/react.js';
export { useWalletVue, useFhevmVue, useContractVue, useDecryptVue, useEncryptVue, useFhevmOperationsVue } from './adapters/vue.js';
export { FhevmNode } from './adapters/node.js';
