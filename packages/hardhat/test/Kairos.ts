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

  describe("Deployment & Minting", function () {
    it("Should allow minting a moment", async function () {
      const [owner] = await ethers.getSigners();
      const testCID = "QmTestCID123";
      const testTimestamp = Math.floor(Date.now() / 1000); // Current timestamp

      await expect(kairosContract.mintMoment(testCID, testTimestamp))
        .to.emit(kairosContract, "MomentCreated")
        .withArgs(owner.address, 0, testCID, testTimestamp); // Assuming first token ID is 0
    });

    it("Should return correct tokenURI", async function () {
      // owner wird nicht benötigt
      const testCID = "QmTestCID123";
      const testTimestamp = Math.floor(Date.now() / 1000);

      await kairosContract.mintMoment(testCID, testTimestamp);
      const tokenURI = await kairosContract.tokenURI(0);
      expect(tokenURI).to.equal(`ipfs://${testCID}`);
    });
  });
});
