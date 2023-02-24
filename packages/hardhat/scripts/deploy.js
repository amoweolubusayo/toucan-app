const hre = require("hardhat");

async function main() {
  const ToucanProtocol = await hre.ethers.getContractFactory("ToucanProtocol");
  const toucanProtocol = await ToucanProtocol.deploy(100, 1);
  await toucanProtocol.deployed();
  console.log("Toucan Protocol deployed to:", toucanProtocol.address);
}

main();
