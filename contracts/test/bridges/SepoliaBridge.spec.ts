import { contracts } from "../../typechain-types";

import { ethers } from "hardhat";
import { expect } from "chai";

describe("SepoliaBridge", function () {
  let sepoliaBridge: contracts.bridge.SepoliaBridge;
  let admin: any;
  let user: any;

  beforeEach(async function () {
    [admin, user] = await ethers.getSigners();

    const SepoliaBridge = await ethers.getContractFactory("SepoliaBridge");
    sepoliaBridge = await SepoliaBridge.deploy();
    await sepoliaBridge.waitForDeployment();
  });

  it("should set the correct admin", async function () {
    expect(await sepoliaBridge.admin()).to.equal(admin.address);
  });

  it("should lock tokens", async function () {
    const amount = ethers.parseEther("1");
    await sepoliaBridge
      .connect(user)
      .lockTokens("SomeChain", user.address, { value: amount });

    expect(await sepoliaBridge.lockedTokens(user.address)).to.equal(amount);
  });

  it("should emit TokensLocked event", async function () {
    const amount = ethers.parseEther("1");
    await expect(
      sepoliaBridge
        .connect(user)
        .lockTokens("SomeChain", user.address, { value: amount })
    )
      .to.emit(sepoliaBridge, "TokensLocked")
      .withArgs(user.address, amount, "SomeChain", user.address);
  });

  it("should unlock tokens", async function () {
    const amount = ethers.parseEther("1");
    await sepoliaBridge
      .connect(user)
      .lockTokens("SomeChain", user.address, { value: amount });

    await sepoliaBridge.connect(admin).unlockTokens(user.address, amount);

    expect(await sepoliaBridge.lockedTokens(user.address)).to.equal(0);
  });

  it("should emit TokensUnlocked event", async function () {
    const amount = ethers.parseEther("1");
    await sepoliaBridge
      .connect(user)
      .lockTokens("SomeChain", user.address, { value: amount });

    await expect(
      sepoliaBridge.connect(admin).unlockTokens(user.address, amount)
    )
      .to.emit(sepoliaBridge, "TokensUnlocked")
      .withArgs(user.address, amount);
  });

  it("should revert unlock if not admin", async function () {
    const amount = ethers.parseEther("1");
    await sepoliaBridge
      .connect(user)
      .lockTokens("SomeChain", user.address, { value: amount });

    await expect(
      sepoliaBridge.connect(user).unlockTokens(user.address, amount)
    ).to.be.revertedWith("Only admin can perform this action");
  });
});
