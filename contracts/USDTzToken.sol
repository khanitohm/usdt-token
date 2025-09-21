// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract USDTzToken is ERC20, Ownable {
    constructor(address initialHolder, uint256 initialSupply) ERC20("USDT.z", "USDTz") Ownable(initialHolder) {
        _mint(initialHolder, initialSupply * (10 ** decimals()));
    }
}
