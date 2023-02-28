import React from "react";
import ReactDOM from "react-dom";
import CarbonOffsets from "../components/CarbonOffsets";
import CarbonRedeem from "../components/CarbonRedeem";


export default function Home(): JSX.Element {
  return (
    <div>
      <CarbonRedeem/>
      <CarbonOffsets />
    </div>
  );
}
