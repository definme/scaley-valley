//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TradeContract is AccessControl {
    IERC20 public resourceToken;

    uint256 public deltaPerMintedToken;

    uint256 public constant AQUATIQUE_KIND = 0x0000;
    uint256 public constant DRUID_KIND = 0x0001;
    uint256 public constant ILLUMINATOR_KIND = 0x0002;
    uint256 public constant HERMES_KIND = 0x0003;

    bytes32 public PRICE_CONTROL_ROLE = keccak256("PRICE_CONTROL_ROLE");

    uint256[] public kinds;
    uint256 public tradedKind;
    mapping(uint256 => uint256) internal kindPrice;
    mapping(uint256 => uint256) internal kindSupply;

    event PriceChanged(uint256 indexed kind, uint256 newPrice);

    constructor(IERC20 resource, uint256 initialPrice, uint256 mintTokenDelta, uint256 kindToBeTraded) {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(PRICE_CONTROL_ROLE, _msgSender());

        kinds.push(AQUATIQUE_KIND);
        kinds.push(DRUID_KIND);
        kinds.push(ILLUMINATOR_KIND);
        kinds.push(HERMES_KIND);

        kindPrice[AQUATIQUE_KIND] = initialPrice;
        kindPrice[DRUID_KIND] = initialPrice;
        kindPrice[ILLUMINATOR_KIND] = initialPrice;
        kindPrice[HERMES_KIND] = initialPrice;

        deltaPerMintedToken = mintTokenDelta;
        tradedKind = kindToBeTraded;
        resourceToken = resource;
    }

    function calculatePrices(
        uint256 kind,
        uint256 amountMinted
    ) public onlyRole(PRICE_CONTROL_ROLE) {
        // if for given kind no price found then this kind is considered as non-existing
        require(kindPrice[kind] > 0, "CALCULATE_BAD_KIND");
        require(amountMinted > 0, "CALCULATE_BAD_MINT_BATCH_SIZE");
        uint256 priceDelta = deltaPerMintedToken * amountMinted;
        for (uint256 i = 0; i < kinds.length; i++) {
            uint256 currentKind = kinds[i];
            if (currentKind == kind) {
                kindSupply[currentKind] += amountMinted;
                // prevent underflow
                if(kindPrice[currentKind] - priceDelta > 0) {
                    kindPrice[currentKind] -= priceDelta;
                }
            } else {
                kindPrice[currentKind] += priceDelta;
            }
            emit PriceChanged(currentKind, kindPrice[currentKind]);
        }
    }

    function isTradeValid(address token, uint256 amount, uint256 kind) public view returns(bool){
        if (token != address(resourceToken)) {
            return false;
        }
        if(kind != tradedKind) {
            return false;
        }
        uint256 price = kindPrice[kind];
        if (amount != price) {
            return false;
        }
        return true;
    }

    function getPrice(uint256 kind) public view returns (uint256) {
        return kindPrice[kind];
    }

    function getSupply(uint256 kind) public view returns (uint256) {
        return kindSupply[kind];
    }
}
