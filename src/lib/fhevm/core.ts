/**
 * FHEVM Core - Zama Fully Homomorphic Encryption
 * Handles FHEVM instance initialization and encryption/decryption
 */

let fheInstance: any = null;

// Cast window to access FHEVM SDK properties
const getWindow = () => window as unknown as { 
  RelayerSDK?: any; 
  relayerSDK?: any; 
  ethereum?: any;
};

/**
 * Initialize FHEVM instance for browser environment
 */
export async function initializeFheInstance(): Promise<any> {
  const win = getWindow();
  
  if (typeof window === 'undefined' || !win.ethereum) {
    throw new Error('Ethereum provider not found. Please install MetaMask or connect a wallet.');
  }

  // Check for both uppercase and lowercase versions of RelayerSDK
  const sdk = win.RelayerSDK || win.relayerSDK;
  
  if (!sdk) {
    throw new Error('RelayerSDK not loaded. The CDN script should be in index.html.');
  }

  const { initSDK, createInstance, SepoliaConfig } = sdk;

  // Initialize SDK with CDN
  await initSDK();
  console.log('✅ FHEVM SDK initialized with CDN');
  
  const config = { ...SepoliaConfig, network: win.ethereum };
  
  try {
    fheInstance = await createInstance(config);
    return fheInstance;
  } catch (err) {
    console.error('FHEVM browser instance creation failed:', err);
    throw err;
  }
}

export function getFheInstance() {
  return fheInstance;
}

/**
 * Create encrypted input for contract interaction
 * Encrypts a boolean vote (true=yes, false=no) as uint32 (1 or 0)
 */
export async function createEncryptedVote(
  contractAddress: string, 
  userAddress: string, 
  voteYes: boolean
): Promise<{ encryptedData: string; proof: string }> {
  const fhe = getFheInstance();
  if (!fhe) throw new Error('FHE instance not initialized. Call initializeFheInstance() first.');

  const value = voteYes ? 1 : 0;
  console.log(`🔐 Creating encrypted vote for contract ${contractAddress}, user ${userAddress}, vote=${voteYes ? 'YES' : 'NO'}`);
  
  const inputHandle = fhe.createEncryptedInput(contractAddress, userAddress);
  inputHandle.add32(value);
  const result = await inputHandle.encrypt();
  
  console.log('✅ Encrypted vote created successfully');
  
  // Extract the correct values from the SDK result
  if (result && typeof result === 'object') {
    if (result.handles && Array.isArray(result.handles) && result.handles.length > 0) {
      return {
        encryptedData: result.handles[0],
        proof: result.inputProof
      };
    } else if (result.encryptedData && result.proof) {
      return {
        encryptedData: result.encryptedData,
        proof: result.proof
      };
    }
  }
  
  return {
    encryptedData: result,
    proof: result
  };
}

/**
 * Public decryption for multiple handles with proof
 */
export async function decryptMultipleHandles(
  handles: string[]
): Promise<{ cleartexts: string; decryptionProof: string; values: number[] }> {
  const fhe = getFheInstance();
  if (!fhe) throw new Error('FHE instance not initialized.');

  if (!handles || handles.length === 0) {
    throw new Error('Handles array cannot be empty');
  }

  console.log('🔐 Calling publicDecrypt with handles:', handles);
  const result = await fhe.publicDecrypt(handles);

  const values = handles.map(handle => {
    let decrypted;

    if (result?.clearValues && typeof result.clearValues === 'object') {
      decrypted = result.clearValues[handle];
    } else if (result && typeof result === 'object') {
      decrypted = result[handle];
    } else {
      throw new Error(`Failed to decrypt handle: ${handle}`);
    }

    if (decrypted === undefined || decrypted === null) {
      throw new Error(`Failed to decrypt handle: ${handle}`);
    }

    return typeof decrypted === 'bigint' ? Number(decrypted) : Number(decrypted);
  });

  return {
    cleartexts: result.abiEncodedClearValues || '',
    decryptionProof: result.decryptionProof || '',
    values
  };
}
