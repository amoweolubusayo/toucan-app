**Introduction**

The Toucan Protocol is a decentralized platform that enables businesses and individuals to offset their carbon footprint by purchasing carbon credits from verified environmental projects. You can learn more about Toucan here https://toucan.earth/. In this tutorial, we will build a dApp(carbon offset marketplace) that interacts with the Toucan Protocol's carbon credits smart contract using Celo Composer. Celo Composer is a tool that streamlines the creation and deployment of Celo blockchain applications.

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

Finally, you will be asked if you want to create a subgraph, we don't need to create one so we can select no. However, we will be interacting with Toucan Protocol's contract via a subgraph


![](https://i.imgur.com/PZpdeEM.png)

Pick your project name as well


![](https://i.imgur.com/HqBAp5R.png)


**Starting out the Front-End**

Implementing Toucan Infrastructure

Each TCO2 is representative of a carbon offset. To read more about TCO2, check it out here https://docs.toucan.earth/toucan/dev-resources/smart-contracts/tco2. We will be creating a carbon offset marketplace that will display the first 12 TCO2s on Celo network. To get all TCO2s, all we have to do is check deployed Toucan subgraphs.

So, we head over to https://docs.toucan.earth/toucan/dev-resources/other/subgraph and we see a list of all subgraphs deployed, our focus is on the one deployed on Celo. If this is your first time hearing about subgraphs you can check out the docs [here](https://thegraph.com/docs/en/network/explorer/)

Here is the [subgraph on Celo test network ](https://thegraph.com/hosted-service/subgraph/toucanprotocol/alfajores)


From this subgraph, let's run a quick query in the Playground, 

```json
{
  
  tco2Tokens {
    name
    symbol
    score
    createdAt
    creationTx
    creator {
      id
    }
  }

}
```

This will give a list of all carbon offsets. This is what we need to simulate a marketplace.

![](https://i.imgur.com/N0G6rOt.png)

**Building out the frontend**

In our frontend, we will be using apollo client to makes calls to our subgraphs. 

Navigate to the react-app folder and run the following commands

`yarn add graphql`
`yarn add @apollo/client`

Now head over to your _app.tsx and update it by importing your apollo client, this way

```javascript
import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";
```
Also, wrap your layout with the client by adding this piece of code.

```javascript
 <ApolloProvider client={client}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ApolloProvider>
```

Still in the root folder of react-app, create a js file and name it `apollo-client.js` and the copy the following to it

```javascript
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/toucanprotocol/alfajores",
  cache: new InMemoryCache(),
});

export default client;
```

Create a component and name it CarbonOffsets.tsx, here we will be writing our query for the subgraph using apollo client

Import `gql` and `useQuery`

```javascript
import { gql, useQuery } from "@apollo/client";
```

To call the query, and for the sake of this demo, we will just be querying the first 12 carbon offsets.

```javascript
const CARBON_OFFSETS = gql`
  query CarbonOffsets {
    tco2Tokens(first: 12) {
      name
      symbol
      score
      createdAt
      creationTx
      creator {
        id
      }
    }
  }
`;
```
Proceeding to write an instance of the component, we can do something like 

 ```javascript
const CarbonOffsets = () => {
  const { loading, error, data } = useQuery(CARBON_OFFSETS);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;
    //your custom code
}
```

In the div you want to display your data, we need to do some mapping 

  ```javascript
<div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 clickable-card">
            {data.tco2Tokens.map((carbon: any) => (
              <div
                key={carbon.id}
                className="group relative max-w-sm rounded overflow-hidden shadow-lg"
              >
                <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
                  <img
                    src={randomizeImage()}
                    alt={randomizeImage()}
                  />
                </div>
                <div className="mt-4 flex justify-between pl-4">
                  <div>
                    <h3 className="text-bg font-weight-bold text-gray-900">
                      <Link
                        href={`https://celoscan.io/tx/${carbon.creationTx}`}
                      >
                        <span aria-hidden="true" className="absolute inset-0" />
                        Name: {carbon.name}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Symbol: {carbon.symbol}
                    </p>
                      <p className="mt-2 text-sm font-medium text-gray-900 pr-3">
                    Score: {carbon.score}
                  </p>
                  </div>
                </div>
                <div className="mt-4 flex pl-4">
                  <span className="inline-block bg-gray-200 rounded-full mt-2 px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                    Created At{" "}
                    {new Date(carbon.createdAt * 1000).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: false,
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
```

The next step is to update the index.tsx. Your code can look like this
    
```typescript
import React from "react";
import CarbonOffsets from "../components/CarbonOffsets";

export default function Home(): JSX.Element {
  return (
    <div>
      <CarbonOffsets />
    </div>
  );
}

```    
    
Go ahead to run the application by running the following command in the terminal
    

`npm run dev`

Here is what you should expect to see, basically a collection of carbon offsets including their names, symbol and time it was created. Clicking on it also takes you to the transaction on the Celo explorer

![](https://i.imgur.com/f8OXePM.png)

Clicking on the first one for example, we see the transaction and can check through the logs to see more information such as vintagetokenId and tokenAddress.

![](https://i.imgur.com/x731uGk.png)

Moving on, we can also interact with some functionalities from Toucan's smart contract. One of which is the `RedeemAuto` function. To do this, we can use the SDK provided by the Toucan team. 

Add the sdk to your project by running this command

```
npm i toucan-sdk
```
Create a new component and you can name it `CarbonRedeem.tsx`

Call the instance of the ToucanClient like this

```
const sdk = new ToucanClient("mumbai");
```
Because the RedeemAuto function involves us writing to the blockchain, we need to set a signer. To do this, add this to your code

 ```javascript
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
sdk.setProvider(provider);
sdk.setSigner(signer);
```

Our task is basically to redeem a pool of tco2tokens so we call a query to get all a list from the subgraph and populate them in a dropdown. As above, remember to import your gql client

```typescript
import { gql, useQuery } from "@apollo/client";
```


```graphql
const GET_TCOTOKENS = gql`
  query CarbonRedeem {
    tco2Tokens {
      symbol
    }
  }
`;
```
 ```typescript
<select
        className="bg-gray-100 rounded-none py-2 px-4 mr-2"
        value={selectedToken}
        onChange={handleTokenSelect}
      >
        <option value="">Select Token</option>
        {data.tco2Tokens.map((token: any) => (
          <option key={token.id} value={token.id}>
            {token.symbol}
          </option>
        ))}
      </select>
```

There is also a function to interact with the contract through the sdk which might look like this. We are sending the symbo; of the pool token and the amount to redeem

 ```typescript
 const redeemAuto = async () => {
    try {
      const ethereum: any = window;
      if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log("signer", signer);
      const sdk = new ToucanClient("mumbai");
      sdk.setProvider(provider);
      sdk.setSigner(signer);
      const amountBN = BigNumber.from(amount);
      const contractReceipt = await sdk.redeemAuto(
        selectedToken,
        parseEther(amount.toString())
      );
      console.log(contractReceipt);
      setcontractReceipt(contractReceipt);
      }
      else {
        // `window.ethereum` is not available, so the user may not have a web3-enabled browser
        console.error('Please install MetaMask or another web3-enabled browser extension');
      }
    } catch (error) {
      console.error(error);
    }
  };
```

Finally, this is our full code

```typescript
import React, { useState } from "react";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import { ToucanClient } from "toucan-sdk";
import { BigNumber, Contract, ContractReceipt, ethers } from "ethers";
import { parseEther } from "ethers/lib/utils.js";

const GET_TCOTOKENS = gql`
  query CarbonRedeem {
    tco2Tokens {
      symbol
    }
  }
`;

const CarbonRedeem: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [contractReceipt, setcontractReceipt] = useState<ContractReceipt>();
  const [selectedToken, setSelectedToken] = useState<any>("");
  const { loading, error, data } = useQuery(GET_TCOTOKENS);

  require("dotenv").config();

  const redeemAuto = async () => {
    try {
      const ethereum: any = window;
      if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log("signer", signer);
      const sdk = new ToucanClient("mumbai");
      sdk.setProvider(provider);
      sdk.setSigner(signer);
      const amountBN = BigNumber.from(amount);
      const contractReceipt = await sdk.redeemAuto(
        selectedToken,
        parseEther(amount.toString())
      );
      console.log(contractReceipt);
      setcontractReceipt(contractReceipt);
      }
      else {
        // `window.ethereum` is not available, so the user may not have a web3-enabled browser
        console.error('Please install MetaMask or another web3-enabled browser extension');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTokenSelect = (event:any) => {
    setSelectedToken(event.target.value);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex items-center mb-3">
      <label className="block text-gray-700 font-bold mb-2" htmlFor="amount">
        Amount(minimum value is 1):
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="amount"
        type="text"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <select
        className="bg-gray-100 rounded-none py-2 px-4 mr-2"
        value={selectedToken}
        onChange={handleTokenSelect}
      >
        <option value="">Select Token</option>
        {data.tco2Tokens.map((token: any) => (
          <option key={token.id} value={token.id}>
            {token.symbol}
          </option>
        ))}
      </select>
      <button
        className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
        onClick={redeemAuto}
      >
        Redeem
      </button>
      {contractReceipt && (
  <div>
    <Link href={`https://alfajores.celoscan.io/tx/${contractReceipt.transactionHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 underline">
    View transaction details {contractReceipt.contractAddress}
    </Link>
  </div>
)}
    </div>
  );
};

export default CarbonRedeem;
```
Proceed to check your browser for changes. Make sure to have funds in your Celo testnet wallet. If you don't have a Celo Wallet, you can add it to your Metamask [here](https://docs.celo.org/blog/tutorials/3-simple-steps-to-connect-your-metamask-wallet-to-celo) or add the Celo wallet plugin to your browser.

This is what you should expect

![](https://i.imgur.com/odPYt8h.png)

Fill and select an option 

![](https://i.imgur.com/eJOLDnr.png)

Click on Redeem

![](https://i.imgur.com/K6FzVWK.png)

After a successful transaction, you will see a link to the transaction details

![](https://i.imgur.com/4abr82o.png)

You can click on that and look through it

![](https://i.imgur.com/xIda4I4.png)

![](https://i.imgur.com/wHB21ok.png)

Congratulations you have just created a dApp using Toucan Protocol and Celo Composer. :confetti_ball: :confetti_ball: 
    

    





