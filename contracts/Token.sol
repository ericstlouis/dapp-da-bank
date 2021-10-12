//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

    //varibles
    address private bankContract;

    //modifiers
    modifier onlyBank() {
        require(msg.sender == bankContract);
        _;
    }







    //functions
    constructor( address _bankAdress) ERC20("Da Token", "DT"){
        bankContract = _bankAdress;
    }

    function mint(address to, uint256 amount) public onlyBank {
        _mint(to, amount);
    } 
        
}