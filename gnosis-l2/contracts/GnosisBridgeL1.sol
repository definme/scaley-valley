//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract GnosisBridgeL1 is AccessControl {
    bytes32 PRICE_CONTROL_ROLE = keccak256("PRICE_CONTROL_ROLE");

    uint256 public price;

    event BridgeInitialized(address from, uint256 given, uint256 expected);

    constructor(uint256 priceInNative) {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(PRICE_CONTROL_ROLE, _msgSender());
        price = priceInNative;
    }

    function setPrice(uint256 newPrice) public onlyRole(PRICE_CONTROL_ROLE) {
        price = newPrice;
    }

    function withdraw() public onlyRole(DEFAULT_ADMIN_ROLE){
        uint256 amount = address(this).balance;
        payable(_msgSender()).transfer(amount);
    }

    receive() external payable {
        uint256 given = msg.value;
        uint256 expected = given * price;
        address from = _msgSender();
        emit BridgeInitialized(from, given, expected);
    }
}
