pragma solidity ^0.4.18;

import "../node_modules/zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract EbikeToken is StandardToken {
    string public name = "EbikeToken";
    string public symbol = "EBK";
    uint8 public decimals = 2;
    uint public INITIAL_SUPPLY = 21000000;


    function EbikeToken() public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = totalSupply_;
    }
}