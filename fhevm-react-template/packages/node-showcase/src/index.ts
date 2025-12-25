/**
 * Node.js FHEVM Showcase
 * Demonstrates REAL Universal FHEVM SDK in Node.js environment
 * No more mocks - actual server-side FHEVM operations!
 */

import 'dotenv/config';
import { FhevmNode } from '../../fhevm-sdk/dist/adapters/node.js';
import { runCounterDemo } from './counter.js';
import { runVotingDemo } from './voting.js';
import { runRatingsDemo } from './ratings.js';

// Configuration - Hardcoded to match test-fhevm-operations.js working wallet
const RPC_URL = process.env.RPC_URL || 'https://sepolia.infura.io/v3/34c3a5f3ecf943498710543fe38b50f4';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '8e393a02d65f980a236a299c033ac867e0bdfc3f8718d7dd55f791dc0fae81fe';
const CHAIN_ID = process.env.CHAIN_ID ? parseInt(process.env.CHAIN_ID) : 11155111; // Sepolia

console.log('🔧 Environment Configuration:');
console.log(`   RPC_URL: ${RPC_URL.substring(0, 30)}...`);
console.log(`   PRIVATE_KEY: ${PRIVATE_KEY.substring(0, 10)}...`);
console.log(`   CHAIN_ID: ${CHAIN_ID}\n`);

async function main() {
  console.log('🔐 Universal FHEVM SDK - Node.js Showcase (REAL OPERATIONS)');
  console.log('============================================================\n');

  try {
    // Initialize FHEVM Node.js instance
    console.log('🚀 Initializing FHEVM SDK for Node.js...');
    const fhevm = new FhevmNode({
      rpcUrl: RPC_URL,
      privateKey: PRIVATE_KEY,
      chainId: CHAIN_ID
    });
    
    await fhevm.initialize();
    console.log('✅ FHEVM Node.js instance initialized successfully!\n');

    // Show configuration
    console.log('⚙️ Configuration summary...');
    const config = fhevm.getConfig();
    console.log('✅ Configuration:');
    console.log(`   RPC URL: ${config.rpcUrl?.substring(0, 30)}...`);
    console.log(`   Chain ID: ${config.chainId}`);
    console.log(`   Has Wallet: ${config.hasWallet}`);
    console.log(`   Has Provider: ${config.hasProvider}`);
    console.log(`   Status: ${config.isReady ? 'Ready' : 'Not Ready'}\n`);

    // Run counter demo
    console.log('🎯 Running Counter Demo...');
    console.log('============================================================\n');
    await runCounterDemo(fhevm, {
      rpcUrl: RPC_URL,
      privateKey: PRIVATE_KEY,
      chainId: CHAIN_ID
    });

    // Run voting demo
    console.log('\n🎯 Running Voting Demo...');
    console.log('============================================================\n');
    await runVotingDemo(fhevm, {
      rpcUrl: RPC_URL,
      privateKey: PRIVATE_KEY,
      chainId: CHAIN_ID
    });

    // Run ratings demo
    console.log('\n🎯 Running Ratings Demo...');
    console.log('============================================================\n');
    await runRatingsDemo(fhevm, {
      rpcUrl: RPC_URL,
      privateKey: PRIVATE_KEY,
      chainId: CHAIN_ID
    });

    console.log('\n🎉 Complete FHEVM operations showcase completed!');
    console.log('============================================================');
    console.log('✅ REAL FHEVM operations demonstrated');
    console.log('✅ Counter demo operations completed');
    console.log('✅ Voting demo operations completed');
    console.log('✅ Ratings demo operations completed');
    console.log('✅ Server-side encryption/decryption');
    console.log('✅ Real blockchain interactions');
    console.log('✅ No more mocks - actual FHEVM functionality!');
    console.log('============================================================');

  } catch (error) {
    console.error('❌ Error in Node.js FHEVM Showcase:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the showcase
main();
