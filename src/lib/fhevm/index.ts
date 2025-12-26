/**
 * FHEVM SDK for CipherVote
 * Provides hooks and utilities for encrypted voting
 */

export { initializeFheInstance, getFheInstance, createEncryptedVote, decryptMultipleHandles } from './core';
export { useFhevm } from './useFhevm';
export { VOTING_CONTRACT_ADDRESS, VOTING_CONTRACT_ABI } from './contract';
