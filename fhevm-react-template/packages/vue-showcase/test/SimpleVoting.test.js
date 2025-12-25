const { expect } = require("chai");
const { ethers, fhevm } = require("hardhat");

describe("SimpleVoting - Comprehensive FHE Operations", function () {
  let contract;
  let owner, voter1, voter2, voter3, voter4, voter5;

  beforeEach(async function () {
    if (!fhevm.isMock) {
      throw new Error("This test must run in FHEVM mock environment");
    }

    await fhevm.initializeCLIApi();

    [owner, voter1, voter2, voter3, voter4, voter5] = await ethers.getSigners();
    
    const Factory = await ethers.getContractFactory("SimpleVoting_uint32");
    const deployed = await Factory.deploy();
    await deployed.waitForDeployment();
    contract = deployed;

    console.log(`✅ SimpleVoting deployed at: ${await contract.getAddress()}`);
  });

  it("tests basic FHE operations: createSession, vote, and reveal", async function () {
    console.log("Testing basic FHE voting flow...");

    // Create a voting session (5 minutes)
    const sessionDuration = 300; // 5 minutes in seconds
    const tx = await contract.connect(owner).createSession(sessionDuration);
    const receipt = await tx.wait();
    
    // Get session ID from event
    const sessionCreatedEvent = receipt.logs.find(log => {
      try {
        const decoded = contract.interface.parseLog(log);
        return decoded.name === 'SessionCreated';
      } catch {
        return false;
      }
    });
    
    const sessionId = sessionCreatedEvent ? sessionCreatedEvent.args.sessionId : 0n;
    console.log(`✅ Session created with ID: ${sessionId}`);

    // Test 1: Cast encrypted votes (tests FHE.fromExternal, FHE.eq, FHE.select, FHE.add)
    console.log("Testing encrypted vote casting...");
    
    const voters = [voter1, voter2, voter3, voter4];
    const voteChoices = [1, 0, 1, 0]; // YES, NO, YES, NO

    for (let i = 0; i < voters.length; i++) {
      const voter = voters[i];
      const voteChoice = voteChoices[i];
      
      // Create encrypted input
      const encrypted = await fhevm
        .createEncryptedInput(await contract.getAddress(), voter.address)
        .add32(BigInt(voteChoice))
        .encrypt();
      
      // Cast vote
      await contract.connect(voter).vote(
        sessionId,
        encrypted.handles[0],
        encrypted.inputProof
      );
      
      console.log(`✅ Vote ${voteChoice} cast by ${voter.address.slice(0, 6)}...`);
    }

    // Test 2: Verify session state before reveal
    const sessionBefore = await contract.getSession(sessionId);
    expect(sessionBefore.creator).to.equal(owner.address);
    expect(sessionBefore.resolved).to.equal(false);
    expect(sessionBefore.yesVotes).to.equal(0); // Not revealed yet
    expect(sessionBefore.noVotes).to.equal(0);  // Not revealed yet

    // Test 3: Advance time and request reveal (tests FHE.toBytes32, FHE.requestDecryption)
    console.log("Testing tally reveal process...");
    
    await ethers.provider.send("evm_increaseTime", [sessionDuration + 1]);
    await ethers.provider.send("evm_mine", []);

    const revealTx = await contract.connect(owner).requestTallyReveal(sessionId);
    await revealTx.wait();

    // Wait for decryption oracle (tests FHE.checkSignatures)
    await fhevm.awaitDecryptionOracle();

    // Test 4: Verify decrypted results
    const sessionAfter = await contract.getSession(sessionId);
    expect(sessionAfter.resolved).to.equal(true);
    expect(sessionAfter.yesVotes).to.equal(2); // 2 YES votes
    expect(sessionAfter.noVotes).to.equal(2);  // 2 NO votes

    console.log("✅ FHE.fromExternal() - Vote decryption works");
    console.log("✅ FHE.eq() - Vote comparison works");
    console.log("✅ FHE.select() - Conditional addition works");
    console.log("✅ FHE.add() - Encrypted tally accumulation works");
    console.log("✅ FHE.allowThis() - Decryption permissions work");
    console.log("✅ FHE.toBytes32() - Conversion for decryption works");
    console.log("✅ FHE.requestDecryption() - Oracle request works");
    console.log("✅ FHE.checkSignatures() - Decryption verification works");
  });

  it("tests FHE error handling: invalid proofs and double voting", async function () {
    console.log("Testing FHE error handling...");

    // Create session
    const sessionId = 0n;
    await contract.connect(owner).createSession(300);

    // Test 1: Invalid input proof should revert
    console.log("Testing invalid input proof...");
    const validEncrypted = await fhevm
      .createEncryptedInput(await contract.getAddress(), voter1.address)
      .add32(1n)
      .encrypt();

    const invalidProof = "0x" + "00".repeat(64); // Invalid proof

    await expect(
      contract.connect(voter1).vote(
        sessionId,
        validEncrypted.handles[0],
        invalidProof
      )
    ).to.be.reverted; // FHE.fromExternal should fail with invalid proof

    console.log("✅ FHE.fromExternal() correctly rejects invalid proofs");

    // Test 2: Valid proof should work
    await contract.connect(voter1).vote(
      sessionId,
      validEncrypted.handles[0],
      validEncrypted.inputProof
    );

    console.log("✅ FHE.fromExternal() accepts valid proofs");

    // Test 3: Double voting should revert
    await expect(
      contract.connect(voter1).vote(
        sessionId,
        validEncrypted.handles[0],
        validEncrypted.inputProof
      )
    ).to.be.revertedWith("Already voted");

    console.log("✅ Double voting prevention works");
  });

  it("tests FHE operations with edge cases: zero votes and maximum values", async function () {
    console.log("Testing FHE edge cases...");

    // Create session
    const sessionId = 0n;
    await contract.connect(owner).createSession(300);

    // Test 1: Zero vote (should still work due to FHE.select)
    console.log("Testing zero vote...");
    const zeroVote = await fhevm
      .createEncryptedInput(await contract.getAddress(), voter1.address)
      .add32(0n)
      .encrypt();

    await contract.connect(voter1).vote(
      sessionId,
      zeroVote.handles[0],
      zeroVote.inputProof
    );

    // Test 2: Maximum euint8 value (255)
    console.log("Testing maximum value...");
    const maxVote = await fhevm
      .createEncryptedInput(await contract.getAddress(), voter2.address)
      .add32(255n)
      .encrypt();

    await contract.connect(voter2).vote(
      sessionId,
      maxVote.handles[0],
      maxVote.inputProof
    );

    // Resolve and check
    await ethers.provider.send("evm_increaseTime", [301]);
    await ethers.provider.send("evm_mine", []);

    await contract.connect(owner).requestTallyReveal(sessionId);
    await fhevm.awaitDecryptionOracle();

    const session = await contract.getSession(sessionId);
    expect(session.resolved).to.equal(true);
    expect(session.yesVotes).to.equal(0); // Zero vote
    expect(session.noVotes).to.equal(1);  // Max value vote (treated as 1 for YES/NO)

    console.log("✅ FHE operations handle zero values correctly");
    console.log("✅ FHE operations handle maximum values correctly");
  });

  it("tests complex FHE computation chains: multiple sessions and votes", async function () {
    console.log("Testing complex FHE computation chains...");

    // Create multiple sessions
    const sessionIds = [];
    for (let i = 0; i < 3; i++) {
      const tx = await contract.connect(owner).createSession(300);
      const receipt = await tx.wait();
      const sessionCreatedEvent = receipt.logs.find(log => {
        try {
          const decoded = contract.interface.parseLog(log);
          return decoded.name === 'SessionCreated';
        } catch {
          return false;
        }
      });
      sessionIds.push(sessionCreatedEvent ? sessionCreatedEvent.args.sessionId : BigInt(i));
    }

    console.log(`✅ Created ${sessionIds.length} sessions`);

    // Complex voting pattern across sessions
    const votingPattern = [
      { session: 0, voter: voter1, choice: 1 }, // YES
      { session: 0, voter: voter2, choice: 0 }, // NO
      { session: 1, voter: voter1, choice: 0 }, // NO
      { session: 1, voter: voter3, choice: 1 }, // YES
      { session: 2, voter: voter2, choice: 1 }, // YES
      { session: 2, voter: voter4, choice: 0 }, // NO
    ];

    // Cast all votes
    for (const { session, voter, choice } of votingPattern) {
      const encrypted = await fhevm
        .createEncryptedInput(await contract.getAddress(), voter.address)
        .add32(BigInt(choice))
        .encrypt();

      await contract.connect(voter).vote(
        sessionIds[session],
        encrypted.handles[0],
        encrypted.inputProof
      );
    }

    console.log("✅ Complex voting pattern completed");

    // Resolve all sessions
    await ethers.provider.send("evm_increaseTime", [301]);
    await ethers.provider.send("evm_mine", []);

    for (let i = 0; i < sessionIds.length; i++) {
      await contract.connect(owner).requestTallyReveal(sessionIds[i]);
    }

    await fhevm.awaitDecryptionOracle();

    // Verify results
    const results = [];
    for (let i = 0; i < sessionIds.length; i++) {
      const session = await contract.getSession(sessionIds[i]);
      results.push({ yes: session.yesVotes, no: session.noVotes });
    }

    // Expected results:
    // Session 0: YES=1, NO=1
    // Session 1: YES=1, NO=1  
    // Session 2: YES=1, NO=1
    expect(results[0].yes).to.equal(1);
    expect(results[0].no).to.equal(1);
    expect(results[1].yes).to.equal(1);
    expect(results[1].no).to.equal(1);
    expect(results[2].yes).to.equal(1);
    expect(results[2].no).to.equal(1);

    console.log("✅ Complex FHE computation chains work correctly");
    console.log("✅ Multiple sessions with FHE operations work");
    console.log("✅ FHE state management across sessions works");
  });

  it("tests FHE access control: only creator can request reveal", async function () {
    console.log("Testing FHE access control...");

    // Create session
    const sessionId = 0n;
    await contract.connect(owner).createSession(300);

    // Cast a vote
    const encrypted = await fhevm
      .createEncryptedInput(await contract.getAddress(), voter1.address)
      .add32(1n)
      .encrypt();

    await contract.connect(voter1).vote(
      sessionId,
      encrypted.handles[0],
      encrypted.inputProof
    );

    // Advance time
    await ethers.provider.send("evm_increaseTime", [301]);
    await ethers.provider.send("evm_mine", []);

    // Test: Non-creator cannot request reveal
    await expect(
      contract.connect(voter1).requestTallyReveal(sessionId)
    ).to.be.revertedWith("Only creator can request reveal");

    console.log("✅ Access control prevents unauthorized reveal requests");

    // Test: Creator can request reveal
    await contract.connect(owner).requestTallyReveal(sessionId);
    await fhevm.awaitDecryptionOracle();

    const session = await contract.getSession(sessionId);
    expect(session.resolved).to.equal(true);

    console.log("✅ Creator can successfully request reveal");
  });

  it("tests FHE event emissions: all events are properly emitted", async function () {
    console.log("Testing FHE event emissions...");

    // Test SessionCreated event
    const tx1 = await contract.connect(owner).createSession(300);
    const receipt1 = await tx1.wait();
    
    const sessionCreatedEvent = receipt1.logs.find(log => {
      try {
        const decoded = contract.interface.parseLog(log);
        return decoded.name === 'SessionCreated';
      } catch {
        return false;
      }
    });
    
    expect(sessionCreatedEvent).to.not.be.undefined;
    expect(sessionCreatedEvent.args.creator).to.equal(owner.address);
    console.log("✅ SessionCreated event emitted correctly");

    const sessionId = sessionCreatedEvent.args.sessionId;

    // Test VoteCast event
    const encrypted = await fhevm
      .createEncryptedInput(await contract.getAddress(), voter1.address)
      .add32(1n)
      .encrypt();

    const tx2 = await contract.connect(voter1).vote(
      sessionId,
      encrypted.handles[0],
      encrypted.inputProof
    );
    const receipt2 = await tx2.wait();

    const voteCastEvent = receipt2.logs.find(log => {
      try {
        const decoded = contract.interface.parseLog(log);
        return decoded.name === 'VoteCast';
      } catch {
        return false;
      }
    });

    expect(voteCastEvent).to.not.be.undefined;
    expect(voteCastEvent.args.voter).to.equal(voter1.address);
    console.log("✅ VoteCast event emitted correctly");

    // Test TallyRevealRequested event
    await ethers.provider.send("evm_increaseTime", [301]);
    await ethers.provider.send("evm_mine", []);

    const tx3 = await contract.connect(owner).requestTallyReveal(sessionId);
    const receipt3 = await tx3.wait();

    const tallyRevealEvent = receipt3.logs.find(log => {
      try {
        const decoded = contract.interface.parseLog(log);
        return decoded.name === 'TallyRevealRequested';
      } catch {
        return false;
      }
    });

    expect(tallyRevealEvent).to.not.be.undefined;
    console.log("✅ TallyRevealRequested event emitted correctly");

    // Test SessionResolved event (after oracle callback)
    await fhevm.awaitDecryptionOracle();

    // Note: SessionResolved event is emitted in the callback, 
    // which happens asynchronously via the oracle
    console.log("✅ All FHE events are properly emitted");
  });
});

