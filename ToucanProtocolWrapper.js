const toucanProtocolABI = require("./ToucanProtocolABI.json");
const Web3 = require("web3");
const ethers = require("ethers");
const { ContractKit } = require("@celo/contractkit");

require("dotenv").config();

async function getContract() {
  const contractAddress = "0xE5738DaDd196816365dCDc92B12E329acC9bcba4";
  const contractABI = toucanProtocolABI.abi;
  let toucanContract;
  try {
    const { ethereum } = window;
    console.log(ethereum.chainId);
    if (ethereum.chainId === "0xaef3") {
      const provider = new ethers.providers.Web3Provider(ethereum);
      console.log("provider", provider);
      const signer = provider.getSigner();
      toucanContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
    } else {
      throw new Error("Please connect to the Alfajores network");
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
  return toucanContract;
}

async function purchaseCarbonCredits(tonnes) {
  const contract = await getContract();
  const creditPrice = await contract.creditPrice();
  const purchaseAmount = tonnes * creditPrice;
  await contract.purchaseCarbonCredits(tonnes, {
    value: purchaseAmount,
  });
}

async function getCarbonFootprint() {
  const contract = await getContract();
  const creditsPurchased = await contract.totalSupply();
  const creditPrice = await contract.creditPrice();
  const carbonCreditsPerTon = await contract.carbonCreditsPerTon();
  const tonnes = creditsPurchased / carbonCreditsPerTon;
  const purchaseAmount = tonnes * creditPrice;
  const carbonFootprint = purchaseAmount;
  return carbonFootprint;
}

async function getCarbonCreditsPerTon() {
  const contract = await getContract();
  const carbonCreditsPerTon = await contract.carbonCreditsPerTon();
  return carbonCreditsPerTon.toNumber();
}

async function getCreditPrice() {
  const contract = await getContract();
  const creditPrice = await contract.creditPrice();
  return creditPrice.toNumber();
}


module.exports = {
  getContract,
  purchaseCarbonCredits,
  getCarbonFootprint,
  getCarbonCreditsPerTon,
  getCreditPrice
};
