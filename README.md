**Introduction**

The Toucan Protocol is a decentralized platform that enables businesses and individuals to offset their carbon footprint by purchasing carbon credits from verified environmental projects. In this tutorial, we will build a dApp that interacts with the Toucan Protocol's carbon credits smart contract using Celo Composer, a development tool that streamlines the creation and deployment of Celo blockchain applications. This app can serve as an incentive and facilitate the transition to a low-carbon economy by making it easy and accessible for individuals and organizations to offset their carbon footprint through the purchase and redemption of carbon credits.

**Prerequisites**
Before starting this tutorial, make sure you have the following installed on your machine:

* Node.js
* NPM (Node Package Manager)

**Creating the Project**

Open your terminal and run the following command to create a new Celo Composer project

`npx @celo/celo-composer create `

You will be prompted to select the framework you want to work with. In this case, we are using React.

![](https://i.imgur.com/7qkhCW0.png)

You will also be prompted to pick a web3 library for the react app. In this tutorial, rainbowkit is chosen

![](https://i.imgur.com/PUVKJ6b.png)

Next up, you will be prompted to choose the smart contract framework, we will be using hardhat in this tutorial.

Finally, you will be asked if you want to create a subgraph, we don't need one so we can select no


![](https://i.imgur.com/PZpdeEM.png)

Pick your project name as well

![](https://i.imgur.com/HqBAp5R.png)

**Writing and deploying our contract**

Now that our project has been created, we need to check out the hardhat folder and navigate to contracts folder and create a new solidity file named ToucanProtocol.sol

In this file, our smart contract will look like this

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ToucanProtocol {
    uint256 public carbonCreditsPerTon;
    uint256 public creditPrice;
    uint256 public totalSupply;

    event CreditsPurchased(address indexed buyer, uint256 credits);

    constructor(uint256 _carbonCreditsPerTon, uint256 _creditPrice) {
        carbonCreditsPerTon = _carbonCreditsPerTon;
        creditPrice = _creditPrice;
    }

    function setCarbonCreditsPerTon(uint256 _carbonCreditsPerTon) public {
        carbonCreditsPerTon = _carbonCreditsPerTon;
    }

    function setCreditPrice(uint256 _creditPrice) public {
        creditPrice = _creditPrice;
    }

    function purchaseCarbonCredits(uint256 _tonnes) public payable {
        require(msg.value == _tonnes * creditPrice, "Incorrect payment amount");
        uint256 credits = _tonnes * carbonCreditsPerTon;
        uint256 newSupply = totalSupply + credits;
        require(newSupply >= totalSupply, "Integer overflow");
        totalSupply = newSupply;
        emit CreditsPurchased(msg.sender, credits);
    }
}


```

The purchaseCarbonCredits function allows users to purchase carbon credits by sending ether to the contract. The tonnes parameter specifies the number of tonnes of carbon offset that the user wants to purchase. The function is marked as payable to allow ether to be sent to the contract.



Compile the contract by running the following command in the terminal

```bash
cd hardhat/contracts
npm install --save-dev hardhat
npx hardhat compile
```

Your contract should compile with the message 

`Compiled 1 Solidity file successfully`

As at this month, hardhat waffle has been depreciated, replace that in your hardhatconfig.js file with chai matchers.

Deploy the contract to the network by creating a deploy.js file in the scripts directory

```javascript
const hre = require('hardhat');

async function main() {
  const ToucanProtocol = await hre.ethers.getContractFactory('ToucanProtocol');
  const toucanProtocol = await ToucanProtocol.deploy(100, 1);
  await toucanProtocol.deployed();
  console.log('Toucan Wrapper address deployed to:', toucanProtocol.address);
}

main();
```

Then run this command

`npx hardhat --network alfajores run scripts/deploy.js`


After a succesful deployment, you would see the message

`Toucan Protocol deployed to: 0xE5738DaDd196816365dCDc92B12E329acC9bcba4`

Verify your contract on https://alfajores.celoscan.io



Create a new file in the root of your project directory called .env. This file will contain your Celo network and contract information. Add the following lines to it

CELO_NETWORK=https://alfajores-forno.celo-testnet.org
TOUCAN_WRAPPER_ADDRESS=<your-ToucanProtocolWrapper-contract-address>

Using a smart contract wrapper
    
Create a new file in your project directory called ToucanProtocolWrapper.js
    
```javascript
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
      touc![](https://i.imgur.com/1s2wFIM.png)
anContract = new ethers.Contract(
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
```

This javaScript file acts as a wrapper or mediator between the Toucan app and the Toucan smart contract on the Celo blockchain. In simpler terms, it's a bridge that helps the Toucan app talk to the Toucan smart contract. The available functions are purchasing carbon credits, getting the carbon footprint, and getting the price of carbon credits. It's up tp you to use the contractkit from Celo to communicate with the app but in this code, ethers was used.

**Starting out the Front-End**

Create a new component file in the react-app/components directory called CarbonCredits.tsx. The code should look like this
    
```typescript
import React, { useState, useEffect } from "react";
import {
  purchaseCarbonCredits,
  getCarbonFootprint,
  getCarbonCreditsPerTon,
  getCreditPrice,
} from "../../../ToucanProtocolWrapper";

function CarbonCredits(): JSX.Element {
  const [carbonCreditsPerTon, setCarbonCreditsPerTon] = useState<number>(0);
  const [creditPrice, setCreditPrice] = useState<number>(0);
  const [carbonFootprint, setCarbonFootprint] = useState<number>(0);
  const [purchaseAmount, setPurchaseAmount] = useState<number>(0);

  async function handlePurchase(event: React.FormEvent<HTMLFormElement>) {
    console.log("got here");
    event.preventDefault();
    try {
      await purchaseCarbonCredits(purchaseAmount);
      console.log("here again");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      const creditsPerTon = await getCarbonCreditsPerTon();
      setCarbonCreditsPerTon(creditsPerTon);

      const price = await getCreditPrice();
      setCreditPrice(price);

      const carbonFootprint = await getCarbonFootprint();
      setCarbonFootprint(carbonFootprint);
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>Carbon Credits</h1>
      <form onSubmit={handlePurchase} className="mt-6">
        <div className="mb-4">
          <label
            htmlFor="purchaseAmount"
            className="block text-gray-700 font-bold mb-2"
          >
            Purchase Amount (tonnes)
          </label>
          <input
            type="number"
            id="purchaseAmount"
            name="purchaseAmount"
            min="1"
            max="1000"
            step="1"
            value={purchaseAmount}
            onChange={(event) =>
              setPurchaseAmount(parseInt(event.target.value, 10))
            }
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Purchase
          </button>
        </div>
      </form>

      <div className="mt-4">
        <p className="text-lg font-medium mb-2">
          Carbon credits per ton: {carbonCreditsPerTon}
        </p>
        <p className="text-lg font-medium mb-2">Credit price: {creditPrice}</p>
        <p className="text-lg font-medium mb-2">
          Carbon footprint: {carbonFootprint}
        </p>
        <p className="text-lg font-medium mb-2">
          Purchase amount: {purchaseAmount}
        </p>
      </div>
    </div>
  );
}

export default CarbonCredits;

```   
    
Also update the index.tsx file in react-app/pages. Your code can look like this
    
```typescript
import React from "react";
import ReactDOM from "react-dom";
import CarbonCredits from "../components/CarbonCredits";


export default function Home(): JSX.Element {
  return (
    <div>
      <CarbonCredits />
    </div>
  );
}
```

Our code adds a form to the `CarbonCredits` component that allows the user to enter the amount of carbon credits they wish to purchase. When the form is submitted, it calls the `handlePurchase` function which sends a transaction to the Toucan Protocol contract's `purchaseCarbonCredits` function with the appropriate amount of ether. It also displays the total carbon foot print we have on the Celo network.
    
    
Go ahead to run the application by running the following command in the terminal
    

`npm run dev`

Here is what you should expect to see with a footprint of 0 initially. In this case, there has been several purchases so the footprint is 11
    
![](https://i.imgur.com/vk80SPw.png)

You can proceed to test the application by entering a value in the "Purchase Amount" field and clicking the "Purchase" button. This should send a transaction to the Toucan Protocol contract and update the "Carbon Footprint" field with the calculated carbon footprint.
    
Congratulations you have just created a dApp using Toucan Protocol and Celo Composer. :confetti_ball: :confetti_ball: 
    

    

    


