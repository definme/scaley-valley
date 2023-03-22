//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// This contract gives general description on Resource contracts
// Actual resource contracts are located in corresponding directories (siblings of current `scaley-valley/contracts`)

// GnosisRiver — gnosis-l2
// OptimisticLight — optimism-l2
// ZksyncForest — zksync-l2
// PolyAir - polygon-l2

contract GnosisRiver is ERC20, AccessControl {

    bytes32 MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public price;

    constructor(uint256 priceInNative) ERC20("GnosisRiver", "WATR") {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(MINTER_ROLE, _msgSender());
        price = priceInNative;
    }

    function mint(address to, uint256 value) public onlyRole(MINTER_ROLE) {
        _mint(to, value);
    }

    function buy(uint256 value) public payable{
        require(msg.value * price == value, "BUY_RESOURCE_BAD_AMOUNT");
        _mint(_msgSender(), value);
    }

    function withdraw() public onlyRole(DEFAULT_ADMIN_ROLE) {
        payable(_msgSender()).transfer(address(this).balance);
    }

    function getRequiredNativeCurrencyToBuy(uint256 requestedTokenAmount) public view returns(uint256 result) {
        result = requestedTokenAmount / price;
    }
}
