//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "./Token.sol";

contract Bank {
    //VARIBLES
    mapping(address => uint256) public accounts;

    //MODIFERS

    //EVENTS


    //FUNCTIONS
    constructor() {
        
    }  

    function totalAssets() view external returns (uint) {
        return address(this).balance;
    }

    function deposit() payable external { 
        require(msg.value > 0, "must deposit 0 amount");
        accounts[msg.sender] += msg.value;
    }

    function withdraw(uint _amount, address _tokenContract) external {
        require(_amount <= accounts[msg.sender], "cannot withdraw more than deposit");
        require(_amount > 0, "can't withdraw nothing");

        accounts[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);

        Token daToken = Token(_tokenContract);
        daToken.mint(msg.sender, 1 ether);
    } 
}

