/**
 * HTTP Server for Node.js FHEVM Showcase
 * Exposes endpoints to test FHEVM operations via API
 */

import 'dotenv/config';
import express from 'express';
import { FhevmNode } from '../../fhevm-sdk/dist/adapters/node.js';
import { runCounterDemo } from './counter.js';
import { runVotingDemo } from './voting.js';
import { runRatingsDemo } from './ratings.js';

const app = express();
const PORT = process.env.PORT || 3001; // Use 3001 to avoid conflict with React showcase on 3000

app.use(express.json());

// Configuration
const RPC_URL = process.env.RPC_URL || 'https://sepolia.infura.io/v3/34c3a5f3ecf943498710543fe38b50f4';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '45678y567';
const CHAIN_ID = process.env.CHAIN_ID ? parseInt(process.env.CHAIN_ID) : 11155111; // Sepolia

// Global FHEVM instance
let fhevmInstance: FhevmNode | null = null;

// Initialize FHEVM instance
async function initializeFhevm() {
  if (fhevmInstance) return fhevmInstance;
  
  console.log('🚀 Initializing FHEVM SDK for Node.js...');
  fhevmInstance = new FhevmNode({
    rpcUrl: RPC_URL,
    privateKey: PRIVATE_KEY,
    chainId: CHAIN_ID
  });
  
  await fhevmInstance.initialize();
  console.log('✅ FHEVM Node.js instance initialized successfully!');
  return fhevmInstance;
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'FHEVM Node.js Showcase',
    endpoints: {
      health: '/health',
      config: '/config',
      counter: '/counter',
      voting: '/voting',
      ratings: '/ratings',
      all: '/run-all'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    fhevmInitialized: fhevmInstance !== null,
    timestamp: new Date().toISOString()
  });
});

// Get configuration
app.get('/config', async (req, res) => {
  try {
    const fhevm = await initializeFhevm();
    const config = fhevm.getConfig();
    res.json({
      rpcUrl: config.rpcUrl?.substring(0, 30) + '...',
      chainId: config.chainId,
      hasWallet: config.hasWallet,
      hasProvider: config.hasProvider,
      isReady: config.isReady,
      walletAddress: await fhevm.getAddress()
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Capture console output
function captureConsoleLogs(callback: () => Promise<void>): Promise<{ logs: string[]; result?: any }> {
  const logs: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  
  console.log = (...args: any[]) => {
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    logs.push(message);
    originalLog(...args); // Still log to server console
  };
  
  console.error = (...args: any[]) => {
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    logs.push(`[ERROR] ${message}`);
    originalError(...args); // Still log to server console
  };
  
  return callback().then((result) => {
    console.log = originalLog;
    console.error = originalError;
    return { logs, result };
  }).catch((error) => {
    console.log = originalLog;
    console.error = originalError;
    throw error;
  });
}

// Run counter demo
app.post('/counter', async (req, res) => {
  try {
    const fhevm = await initializeFhevm();
    const { logs } = await captureConsoleLogs(async () => {
      await runCounterDemo(fhevm, {
        rpcUrl: RPC_URL,
        privateKey: PRIVATE_KEY,
        chainId: CHAIN_ID
      });
    });
    res.json({ success: true, demo: 'counter', logs });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      logs: []
    });
  }
});

// Run voting demo
app.post('/voting', async (req, res) => {
  try {
    const fhevm = await initializeFhevm();
    const { logs } = await captureConsoleLogs(async () => {
      await runVotingDemo(fhevm, {
        rpcUrl: RPC_URL,
        privateKey: PRIVATE_KEY,
        chainId: CHAIN_ID
      });
    });
    res.json({ success: true, demo: 'voting', logs });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      logs: []
    });
  }
});

// Run ratings demo
app.post('/ratings', async (req, res) => {
  try {
    const fhevm = await initializeFhevm();
    const { logs } = await captureConsoleLogs(async () => {
      await runRatingsDemo(fhevm, {
        rpcUrl: RPC_URL,
        privateKey: PRIVATE_KEY,
        chainId: CHAIN_ID
      });
    });
    res.json({ success: true, demo: 'ratings', logs });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      logs: []
    });
  }
});

// Run all demos
app.post('/run-all', async (req, res) => {
  try {
    const fhevm = await initializeFhevm();
    const allLogs: string[] = [];
    
    const { logs: counterLogs } = await captureConsoleLogs(async () => {
      await runCounterDemo(fhevm, {
        rpcUrl: RPC_URL,
        privateKey: PRIVATE_KEY,
        chainId: CHAIN_ID
      });
    });
    allLogs.push(...['', '=== COUNTER DEMO ===', ''], ...counterLogs);
    
    const { logs: votingLogs } = await captureConsoleLogs(async () => {
      await runVotingDemo(fhevm, {
        rpcUrl: RPC_URL,
        privateKey: PRIVATE_KEY,
        chainId: CHAIN_ID
      });
    });
    allLogs.push(...['', '=== VOTING DEMO ===', ''], ...votingLogs);
    
    const { logs: ratingsLogs } = await captureConsoleLogs(async () => {
      await runRatingsDemo(fhevm, {
        rpcUrl: RPC_URL,
        privateKey: PRIVATE_KEY,
        chainId: CHAIN_ID
      });
    });
    allLogs.push(...['', '=== RATINGS DEMO ===', ''], ...ratingsLogs);
    
    res.json({ success: true, demos: ['counter', 'voting', 'ratings'], logs: allLogs });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      logs: []
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 FHEVM Node.js Showcase Server running on port ${PORT}`);
  console.log(`📡 Visit http://localhost:${PORT} for API endpoints`);
});

