//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IGreeter {
    function greet() external returns (string memory);

    function setGreeting(string memory _greeting) external;
}
