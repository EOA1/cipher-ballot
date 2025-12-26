/**
 * FHEVM Voting Contract Configuration
 * SimpleVoting_uint32 contract on Sepolia
 */

// Contract deployed on Sepolia testnet
export const VOTING_CONTRACT_ADDRESS = '0x5Bdeb5390cA4063029F3eF44Bc15F01e8d621260';

// Contract ABI for SimpleVoting_uint32
export const VOTING_CONTRACT_ABI = [
  {
    "inputs": [{ "internalType": "uint256", "name": "durationSeconds", "type": "uint256" }],
    "name": "createSession",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "sessionId", "type": "uint256" }],
    "name": "getSession",
    "outputs": [
      { "internalType": "address", "name": "creator", "type": "address" },
      { "internalType": "uint256", "name": "endTime", "type": "uint256" },
      { "internalType": "bool", "name": "resolved", "type": "bool" },
      { "internalType": "uint32", "name": "yesVotes", "type": "uint32" },
      { "internalType": "uint32", "name": "noVotes", "type": "uint32" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSessionCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" },
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "hasVoted",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "sessions",
    "outputs": [
      { "internalType": "address", "name": "creator", "type": "address" },
      { "internalType": "uint256", "name": "endTime", "type": "uint256" },
      { "internalType": "bool", "name": "resolved", "type": "bool" },
      { "internalType": "uint32", "name": "revealedYes", "type": "uint32" },
      { "internalType": "uint32", "name": "revealedNo", "type": "uint32" },
      { "internalType": "bool", "name": "revealRequested", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "sessionId", "type": "uint256" }],
    "name": "requestTallyReveal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "sessionId", "type": "uint256" },
      { "internalType": "bytes", "name": "cleartexts", "type": "bytes" },
      { "internalType": "bytes", "name": "decryptionProof", "type": "bytes" }
    ],
    "name": "resolveTallyCallback",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "sessionId", "type": "uint256" },
      { "indexed": false, "internalType": "bytes32", "name": "yesVotesHandle", "type": "bytes32" },
      { "indexed": false, "internalType": "bytes32", "name": "noVotesHandle", "type": "bytes32" }
    ],
    "name": "TallyRevealRequested",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "sessionId", "type": "uint256" },
      { "internalType": "externalEuint32", "name": "encryptedVote", "type": "bytes32" },
      { "internalType": "bytes", "name": "proof", "type": "bytes" }
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
