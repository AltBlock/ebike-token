pragma solidity ^0.4.18;

import "../node_modules/zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";

contract EbikeToken is StandardToken, Ownable {
    string public name = "Bike";
    string public symbol = "BIKE";
    uint8 public decimals = 2;
    uint public INITIAL_SUPPLY = 21000000;


    function EbikeToken() public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = totalSupply_;
    }
}