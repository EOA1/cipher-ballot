const { expect } = require("chai");
const { ethers, fhevm } = require("hardhat");

describe("ReviewCardsFHE - Basic Functionality Tests", function () {
  let contract;
  let owner, user1, user2, user3;

  beforeEach(async function () {
    if (!fhevm.isMock) {
      throw new Error("This test must run in FHEVM mock environment");
    }
    
    await fhevm.initializeCLIApi();
    [owner, user1, user2, user3] = await ethers.getSigners();
    
    const Factory = await ethers.getContractFactory("ReviewCardsFHE");
    const deployed = await Factory.deploy();
    await deployed.waitForDeployment();
    contract = deployed;
  });

  it("should deploy contract successfully", async function () {
    expect(await contract.getAddress()).to.be.properAddress;
    console.log("✅ Contract deployed at:", await contract.getAddress());
  });

  it("should have correct initial values", async function () {
    const creationFee = await contract.creationFee();
    const contractOwner = await contract.owner();
    const totalCards = await contract.getTotalCards();
    
    expect(creationFee).to.equal(ethers.parseEther("0.005"));
    expect(contractOwner).to.equal(owner.address);
    expect(totalCards).to.equal(0);
    console.log("✅ Initial values correct");
  });

  it("should create a review card", async function () {
    const tx = await contract.connect(owner).createReviewCard({ value: ethers.parseEther("0.005") });
    await tx.wait();
    
    const cardInfo = await contract.getCardInfo(0);
    expect(cardInfo.exists).to.equal(true);
    expect(cardInfo.creator).to.equal(owner.address);
    expect(cardInfo.createdAt).to.be.greaterThan(0);
    
    const totalCards = await contract.getTotalCards();
    expect(totalCards).to.equal(1);
    console.log("✅ Review card created successfully");
  });

  it("should prevent double voting", async function () {
    // Create a card
    await contract.connect(owner).createReviewCard({ value: ethers.parseEther("0.005") });
    
    // Create encrypted rating
    const encrypted = await fhevm
      .createEncryptedInput(await contract.getAddress(), user1.address)
      .add32(3n) // Rating of 3
      .encrypt();
    
    // First vote should succeed
    await contract.connect(user1).submitEncryptedRating(
      0,
      encrypted.handles[0],
      encrypted.inputProof
    );
    
    // Second vote should fail
    await expect(
      contract.connect(user1).submitEncryptedRating(
        0,
        encrypted.handles[0],
        encrypted.inputProof
      )
    ).to.be.revertedWith("Already voted on this card");
    
    console.log("✅ Double voting prevention works");
  });

  it("should require correct creation fee amount", async function () {
    // Insufficient fee should fail
    await expect(
      contract.connect(owner).createReviewCard({ value: ethers.parseEther("0.001") })
    ).to.be.revertedWith("Insufficient creation fee");
    
    // Correct fee should succeed
    await contract.connect(owner).createReviewCard({ value: ethers.parseEther("0.005") });
    
    console.log("✅ Creation fee validation works");
  });

  it("should allow owner to withdraw fees", async function () {
    // Create card to generate fees
    await contract.connect(owner).createReviewCard({ value: ethers.parseEther("0.005") });
    
    const initialBalance = await ethers.provider.getBalance(owner.address);
    const tx = await contract.connect(owner).withdrawFees();
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed * receipt.gasPrice;
    const finalBalance = await ethers.provider.getBalance(owner.address);
    
    expect(finalBalance).to.be.greaterThan(initialBalance - gasUsed);
    console.log("✅ Fee withdrawal works");
  });

  it("should handle multiple cards", async function () {
    // Create multiple cards
    await contract.connect(owner).createReviewCard({ value: ethers.parseEther("0.005") });
    await contract.connect(user1).createReviewCard({ value: ethers.parseEther("0.005") });
    await contract.connect(user2).createReviewCard({ value: ethers.parseEther("0.005") });
    
    const cardCount = await contract.getTotalCards();
    expect(cardCount).to.equal(3);
    
    // Verify each card exists
    for (let i = 0; i < 3; i++) {
      const cardInfo = await contract.getCardInfo(i);
      expect(cardInfo.exists).to.equal(true);
    }
    
    console.log("✅ Multiple cards handling works");
  });

  it("should track encrypted ratings correctly", async function () {
    await contract.connect(owner).createReviewCard({ value: ethers.parseEther("0.005") });
    
    // Submit multiple ratings
    const ratings = [4, 5, 3];
    const users = [user1, user2, user3];
    
    for (let i = 0; i < ratings.length; i++) {
      const encrypted = await fhevm
        .createEncryptedInput(await contract.getAddress(), users[i].address)
        .add32(BigInt(ratings[i]))
        .encrypt();
      
      await contract.connect(users[i]).submitEncryptedRating(
        0,
        encrypted.handles[0],
        encrypted.inputProof
      );
    }
    
    // Check that all users have voted
    for (let i = 0; i < users.length; i++) {
      const hasVoted = await contract.hasAddressVoted(0, users[i].address);
      expect(hasVoted).to.equal(true);
    }
    
    console.log("✅ Encrypted ratings tracking works");
  });

  it("should handle edge case: single rating", async function () {
    await contract.connect(owner).createReviewCard({ value: ethers.parseEther("0.005") });
    
    const encrypted = await fhevm
      .createEncryptedInput(await contract.getAddress(), user1.address)
      .add32(5n)
      .encrypt();
    
    await contract.connect(user1).submitEncryptedRating(
      0,
      encrypted.handles[0],
      encrypted.inputProof
    );
    
    const hasVoted = await contract.hasAddressVoted(0, user1.address);
    expect(hasVoted).to.equal(true);
    console.log("✅ Single rating handling works");
  });

  it("should handle performance: rapid sequential operations", async function () {
    const startTime = Date.now();
    
    // Create 5 cards rapidly
    for (let i = 0; i < 5; i++) {
      await contract.connect(owner).createReviewCard({ value: ethers.parseEther("0.005") });
    }
    
    // Submit ratings rapidly
    for (let i = 0; i < 5; i++) {
      const encrypted = await fhevm
        .createEncryptedInput(await contract.getAddress(), user1.address)
        .add32(4n)
        .encrypt();
      
      await contract.connect(user1).submitEncryptedRating(
        i,
        encrypted.handles[0],
        encrypted.inputProof
      );
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).to.be.lessThan(10000); // Should complete in under 10 seconds
    console.log(`✅ Performance test passed in ${duration}ms`);
  });
});

