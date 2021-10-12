const fs = require('fs');
const hre = require('hardhat');

async function main() {
  // Deploying bank address
  const BankContract = await hre.ethers.getContractFactory('Bank');
  const bank = await BankContract.deploy();
  await bank.deployed();
  console.log('BanK Contract Deployed at:', bank.address);

  //deploying token contract and inserting bank address into the constructor
  const TokenContract = await hre.ethers.getContractFactory('Token');
  const token = await TokenContract.deploy(bank.address);
  await token.deployed();
  console.log('Token Contract was deployed at:', token.address);

  //create the environment file with the smart contract addresses
  let addresses = { bankContract: bank.address, tokenContract: token.address };
  let addressesJSON = JSON.stringify(addresses);
  fs.writeFileSync('contract-address.json', addressesJSON);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
