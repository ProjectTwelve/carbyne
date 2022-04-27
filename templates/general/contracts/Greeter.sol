//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import 'hardhat/console.sol';
import './interface/IGreeter.sol';

contract Greeter is IGreeter {
  string private greeting;

  constructor(string memory _greeting) {
    console.log('Deploying a Greeter with greeting:', _greeting);
    greeting = _greeting;
  }

  function greet() public view override returns (string memory) {
    return greeting;
  }

  function setGreeting(string memory _greeting) public override {
    console.log('Changing greeting from \'%s\' to \'%s\'', greeting, _greeting);
    greeting = _greeting;
  }
}
