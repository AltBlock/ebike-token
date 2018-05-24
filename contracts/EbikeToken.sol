pragma solidity ^0.4.18;

import "../node_modules/zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";

contract EbikeToken is MintableToken {
    string public name = "Bike";
    string public symbol = "BIKE";
    uint8 public decimals = 18;
}