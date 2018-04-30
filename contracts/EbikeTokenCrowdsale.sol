pragma solidity ^0.4.18;

import "./EbikeToken.sol";
import "../node_modules/zeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../node_modules/zeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";

contract EbikeTokenCrowdsale is TimedCrowdsale {
    function EbikeTokenCrowdsale (uint256 _openingTime, uint256 _closingTime, uint256 _rate, address _wallet, ERC20 _token) public 
      Crowdsale(_rate, _wallet, _token)
      TimedCrowdsale(_openingTime, _closingTime) {

    }
}