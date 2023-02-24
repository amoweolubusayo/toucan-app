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
