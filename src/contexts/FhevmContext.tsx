/**
 * FHEVM Context Provider
 * Handles global FHEVM initialization state
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { initializeFheInstance, getFheInstance } from '@/lib/fhevm';

type FhevmStatus = 'idle' | 'loading' | 'ready' | 'error';

interface FhevmContextValue {
  status: FhevmStatus;
  error: string;
  isReady: boolean;
  initialize: () => Promise<void>;
}

const FhevmContext = createContext<FhevmContextValue | null>(null);

export function FhevmProvider({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();
  const [status, setStatus] = useState<FhevmStatus>('idle');
  const [error, setError] = useState('');

  const initialize = useCallback(async () => {
    // Skip if already ready
    if (getFheInstance()) {
      setStatus('ready');
      return;
    }

    // Skip if no wallet connected
    if (!isConnected) {
      return;
    }

    setStatus('loading');
    setError('');

    try {
      await initializeFheInstance();
      setStatus('ready');
      console.log('✅ FHEVM initialized successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to initialize FHEVM';
      setError(message);
      setStatus('error');
      console.error('❌ FHEVM initialization failed:', err);
    }
  }, [isConnected]);

  // Auto-initialize when wallet connects
  useEffect(() => {
    if (isConnected && status === 'idle') {
      initialize();
    }
  }, [isConnected, status, initialize]);

  return (
    <FhevmContext.Provider
      value={{
        status,
        error,
        isReady: status === 'ready',
        initialize,
      }}
    >
      {children}
    </FhevmContext.Provider>
  );
}

export function useFhevmContext() {
  const context = useContext(FhevmContext);
  if (!context) {
    throw new Error('useFhevmContext must be used within FhevmProvider');
  }
  return context;
}
