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
