import { contracts } from "../../typechain-types";

import { expect } from "chai";
import { ethers } from "hardhat";

describe("GaladrielBridge", function () {
  let galadrielBridge: contracts.bridges.Bridge;
  let admin: any;
  let user: any;

  beforeEach(async function () {
    [admin, user] = await ethers.getSigners();

    const initialBalance = ethers.parseEther("10");

    const GaladrielBridge = await ethers.getContractFactory("Bridge");
    galadrielBridge = await GaladrielBridge.deploy({ value: initialBalance });
    await galadrielBridge.waitForDeployment();
  });

  it("should set the correct admin", async function () {
    expect(await galadrielBridge.admin()).to.equal(admin.address);
  });

  it("should have initial GAL balance", async function () {
    const balance = await galadrielBridge.tokenBalance();
    expect(balance).to.equal(ethers.parseEther("10"));
  });

  it("should mint tokens", async function () {
    const amount = ethers.parseEther("5");

    await galadrielBridge.connect(admin).mintTokens(user.address, amount);

    expect(await galadrielBridge.mintedTokens(user.address)).to.equal(amount);
  });

  it("should emit TokensMinted event", async function () {
    const amount = ethers.parseEther("5");

    await expect(
      galadrielBridge.connect(admin).mintTokens(user.address, amount)
    )
      .to.emit(galadrielBridge, "TokensMinted")
      .withArgs(user.address, amount);
  });

  it("should burn tokens", async function () {
    const amount = ethers.parseEther("5");

    await galadrielBridge.connect(admin).mintTokens(user.address, amount);
    await galadrielBridge
      .connect(user)
      .burnTokens(amount, "AnotherChain", admin.address);

    expect(await galadrielBridge.mintedTokens(user.address)).to.equal(0);
  });

  it("should emit TokensBurned event", async function () {
    const amount = ethers.parseEther("5");

    await galadrielBridge.connect(admin).mintTokens(user.address, amount);

    await expect(
      galadrielBridge
        .connect(user)
        .burnTokens(amount, "AnotherChain", admin.address)
    )
      .to.emit(galadrielBridge, "TokensBurned")
      .withArgs(user.address, amount, "AnotherChain", admin.address);
  });

  it("should withdraw GAL", async function () {
    const withdrawAmount = ethers.parseEther("5");
    await galadrielBridge.connect(admin).withdraw(withdrawAmount);

    const contractBalance = await galadrielBridge.tokenBalance();
    expect(contractBalance).to.equal(ethers.parseEther("5"));
  });

  it("should deposit GAL", async function () {
    const depositAmount = ethers.parseEther("5");
    await galadrielBridge.connect(admin).deposit({ value: depositAmount });

    const contractBalance = await galadrielBridge.tokenBalance();
    expect(contractBalance).to.equal(ethers.parseEther("15"));
  });

  it("should revert mint if not admin", async function () {
    const amount = ethers.parseEther("5");

    await expect(
      galadrielBridge.connect(user).mintTokens(user.address, amount)
    ).to.be.revertedWith("Only admin can perform this action");
  });
  it("should allow admin to withdraw user balance", async function () {
    const mintAmount = ethers.parseEther("5");
    const withdrawAmount = ethers.parseEther("3");

    await galadrielBridge.connect(admin).mintTokens(user.address, mintAmount);

    await galadrielBridge
      .connect(admin)
      .withdrawUserBalance(user.address, withdrawAmount);

    const remainingMintedTokens = await galadrielBridge.mintedTokens(
      user.address
    );
    const contractBalance = await galadrielBridge.tokenBalance();

    expect(remainingMintedTokens).to.equal(mintAmount - withdrawAmount);
    expect(contractBalance).to.equal(ethers.parseEther("7"));
  });

  it("should revert if contract has insufficient GAL balance", async function () {
    const mintAmount = ethers.parseEther("5");
    const withdrawAmount = ethers.parseEther("15"); // Exceeds contract's balance

    // Mint tokens to the user
    await galadrielBridge.connect(admin).mintTokens(user.address, mintAmount);

    // Try to withdraw more than the contract's balance
    await expect(
      galadrielBridge
        .connect(admin)
        .withdrawUserBalance(user.address, withdrawAmount)
    ).to.be.revertedWith("Insufficient contract balance");
  });

  it("should revert if withdraw amount exceeds user's minted tokens", async function () {
    const mintAmount = ethers.parseEther("5");
    const withdrawAmount = ethers.parseEther("10"); // Exceeds user's minted tokens

    // Mint tokens to the user
    await galadrielBridge.connect(admin).mintTokens(user.address, mintAmount);

    // Try to withdraw more than the user's minted tokens
    await expect(
      galadrielBridge
        .connect(admin)
        .withdrawUserBalance(user.address, withdrawAmount)
    ).to.be.revertedWith("Insufficient contract balance");
  });
});
