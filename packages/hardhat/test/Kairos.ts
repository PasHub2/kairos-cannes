import { expect } from "chai";
import { ethers } from "hardhat";
import { Kairos } from "../typechain-types"; // Updated import

describe("Kairos", function () {
  let kairosContract: Kairos;
  before(async () => {
    const [owner] = await ethers.getSigners();
    const kairosContractFactory = await ethers.getContractFactory("Kairos"); // Updated contract name
    kairosContract = (await kairosContractFactory.deploy(owner.address)) as Kairos;
    await kairosContract.waitForDeployment();
  });

  describe("Deployment & Nickname", function () {
    it("Should allow setting a nickname", async function () {
      const [owner] = await ethers.getSigners();
      const newNickname = "testuser";
      await kairosContract.setNickname(newNickname);
      expect(await kairosContract.nicknames(owner.address)).to.equal(newNickname);
    });

    // Add more tests for mintMoment and other functions later
    it("Should allow minting a moment (placeholder test)", async function () {
      const [owner] = await ethers.getSigners();
      const testCID = "QmTestCID123";
      const testTimestamp = Math.floor(Date.now() / 1000); // Current timestamp

      await expect(kairosContract.mintMoment(testCID, testTimestamp))
        .to.emit(kairosContract, "MomentCreated")
        .withArgs(owner.address, 0, testCID, testTimestamp); // Assuming first token ID is 0
    });
  });
});
