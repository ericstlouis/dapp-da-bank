const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bank App", () => {
  let bank, token, owner, address_1, address_2;
  let addresses;

  beforeEach(async () => {
    const BankContract = await ethers.getContractFactory("Bank");
    bank = await BankContract.deploy();
    await bank.deployed();

    const TokenContract = await ethers.getContractFactory("Token");
    token = await TokenContract.deploy(bank.address);
    await token.deployed();

    [owner, address_1, address_2, ...addresses] = await ethers.getSigners();
  });

  describe("Deployment", () => {

     it("should have totalAssests of 0", async () => {
       expect(await bank.totalAssets()).to.equal("0");
     });
     it("should have a 0 deposits and tokens in owner accounts", async () => {
       expect(await bank.accounts(owner.address)).to.equal("0");
       expect(await token.balanceOf(owner.address)).to.equal("0")
     });
     it('should have 0 tokens, and 0 deposits in address1', async () => {
       expect(await bank.accounts(address_1.address)).to.equal('0');
       expect(await token.balanceOf(address_1.address)).to.equal('0');
     });
     it("should have 0 tokens, and 0 deposits in address2", async () => {
       expect(await bank.accounts(address_2.address)).to.equal("0");
       expect(await token.balanceOf(address_2.address)).to.equal("0");
     });
  });

  describe('deposit and withdrawal', () => {
    const oneEth = ethers.utils.parseEther('1.0');

    it('should let owner deposit 1 ether, then totalAssets should be 1 ether', async ()   => {
      await bank.connect(owner).deposit({ value: oneEth });
      expect(await bank.totalAssets()).to.equal(oneEth);
      expect(await bank.accounts(owner.address)).to.equal(oneEth);
    });
    it("should deposit 1 ether in address1 and withdraw 1 ether from address", async () => {
      await bank.connect(address_1).deposit({value: oneEth});
      await bank.connect(address_1).withdraw(oneEth, token.address);
      expect(await bank.totalAssets()).to.equal("0");
      expect(await token.balanceOf(address_1.address)).to.equal(oneEth);
    });
    it("should fail when trying to withdraw money you haven't deposit", async () => {
      await expect(bank.connect(address_2).withdraw(oneEth, token.address)).to.be.revertedWith('cannot withdraw more than deposit');
    });
  });
});