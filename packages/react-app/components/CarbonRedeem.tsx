import React, { useState } from "react";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import { ToucanClient } from "toucan-sdk";
import { BigNumber, Contract, ContractReceipt, ethers } from "ethers";
import { useSigner } from "wagmi";
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
  const [swapTokenAddress, setSwapTokenAddress] = useState<string>("");
  const [selectedToken, setSelectedToken] = useState<any>("");
  const { loading, error, data } = useQuery(GET_TCOTOKENS);

  require("dotenv").config();

  const redeemAuto = async () => {
    try {
      const ethereum: any = window;
      console.log("ethereum is", ethereum);

      const provider = new ethers.providers.Web3Provider(ethereum);
      console.log("provider", provider);
      const signer = provider.getSigner();
      console.log("signer", signer);
      const sdk = new ToucanClient("mumbai");
      console.log("sdk", sdk);
      sdk.setProvider(provider);
      sdk.setSigner(signer);
      const amountBN = BigNumber.from(amount);
      console.log(amountBN);
      const contractReceipt = await sdk.redeemAuto(
        selectedToken,
        parseEther(amount.toString())
      );
      console.log(contractReceipt);
      setcontractReceipt(contractReceipt);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTokenSelect = (event: any) => {
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
          <Link
            href={`https://alfajores.celoscan.io/tx/${contractReceipt.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            View transaction details {contractReceipt.contractAddress}
          </Link>
        </div>
      )}
    </div>
  );
};

export default CarbonRedeem;
