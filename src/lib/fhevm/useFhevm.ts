/**
 * React hook for FHEVM instance management
 */

import { useState, useCallback } from 'react';
import { initializeFheInstance, getFheInstance } from './core';

export type FhevmStatus = 'idle' | 'loading' | 'ready' | 'error';

export function useFhevm() {
  const [status, setStatus] = useState<FhevmStatus>('idle');
  const [error, setError] = useState<string>('');

  const initialize = useCallback(async () => {
    // Already initialized
    if (getFheInstance()) {
      setStatus('ready');
      return getFheInstance();
    }

    setStatus('loading');
    setError('');
    
    try {
      const fheInstance = await initializeFheInstance();
      setStatus('ready');
      console.log('✅ FHEVM initialized');
      return fheInstance;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
      console.error('❌ FHEVM initialization failed:', err);
      throw err;
    }
  }, []);

  return {
    status,
    error,
    initialize,
    isReady: status === 'ready',
    isLoading: status === 'loading',
  };
}
