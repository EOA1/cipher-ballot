import { ethers } from "ethers";
import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy SimpleVoting_uint32 contract
  console.log("Deploying SimpleVoting_uint32 contract...");
  console.log("Deploying SimpleVoting_uint32 contract...");
  const SimpleVoting = await hre.ethers.getContractFactory("SimpleVoting_uint32");
  const simpleVoting = await SimpleVoting.deploy();
  await simpleVoting.waitForDeployment();
  const votingAddress = await simpleVoting.getAddress();
  console.log(`SimpleVoting_uint32 contract deployed to: ${votingAddress}`);

  console.log("\n=== Deployment Summary ===");
  console.log(`SimpleVoting_uint32: ${votingAddress}`);
}

// Export the main function for hardhat-deploy
export default main;