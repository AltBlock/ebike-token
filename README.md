# Smart Contract for EBIKE and Crowdsale
ERC20 Tokens EBIKE and Crowdsale.

# EbikeTokenCrowdsale
Crowdsale for Ebike Token.

## Properties
  - `stage`: Stage of ICO, ICOStage.PreSale or ICOStage.ICO
  - `bonus`: Mapping of stage to bonus. Bonus should be in `10x` format. eg - `bonus[uint(ICOStage.PreSale)] = 500;` 500 for 50% ***Private***
  - `isFinished`: Used to indicate the end of Sale.
  - `decimals`: Decimals used in token. i.e 18
  - `totalTokenLimit`: Total supply of tokens. 109 mil
  - `publicMaxTokens`: Total token supply for pyblic sale. 60 mil
  - `totalTokensForPreSale`: Total token supply for PreSale. 10 mil
  - `totalTokensForPrivateSale`: Total token supply for Private Sale. 4 mil
  - `totalTokensForDevelopers`: Total token supply for Developers. 20 mil
  - `totalTokensForTeam`: Total token supply for AltBlock team. 10 mil
  - `totalTokensForBounty`: Total token supply for Bounty. 5 mil  
  - `totalTokensMintedPreSale`: Total token sold during PreSale.
  - `totalTokensMintedICO`: Total tokens sold during ICO.
  - `totalWeiRaisedDuringPreSale`: Total amount raised during PreSale.
  - `totalWeiRaisedDuringICO`: Total amount raised during ICO.
  - `bonusCoff`: `10x` of 100%




## Functions

### EbikeTokenCrowdsale(_openingTime, _closingTime, _rate, _wallet, _token)
Creates the EbikeTokenCrowdsale instance.
  - `_openingTime`: Time to open the sale.
  - `_closingTime`: Time when sale closes.
  - `_rate`: Rate of conversion of eth and EBK eg: 1 eth = 3600 EBK.
  - `_wallet`: eaddress to which to transefer the eth and remaining tokens.
  - `_token`: EbikeTokens address. Should be mintable.trackpad).
---

### setOpeningTime(_openingTime) public onlyOwner
Sets opening time for the sale.
  - `_openingTime`: new opening time.  `_openingTime` should be less than `_closingTime`.
---
### setMaxTokenForPublic(_maxTokens) public onlyOwner
Updates circulating tokens.
  -  `_maxTokens`: new limit of circulating coins. `_maxTokens` should be less than `publicMaxTokens`.
---
### setCrowdsaleStage(value) public onlyOwner
Change Crowdsale Stage. Available Options: PreICO, ICO.
  - `value`: `0` for PreSale and `1` for ICO.
---
## setCurrentRate(_rate) private
Change the current rate
  - `_rate`: new rate for the sale. `_rate` must be greater than 0.
---
### _amountWithBonus(amount) internal
Returns token amount with added bonus.
  - `amount`: amount of token given by weiAmount.
---
### FinishPreSale() public onlyOwner onlyOnPreSale
Finish the pre sale. Mint the unsold tokens and sends to wallet(_wallet).

---

### finish(developerWallet, teamWallet, bountyWallet, privateSaleWallet) public onlyOwner notFinished
Finish the sale. Mint and send tokens to developer's, team's, bounty's privateSale's Private wallet respectively.
  -  `developerWallet`: address of wallet which holds tokens for developers.
  -  `teamWallet`: address of wallet which holds tokens for altblock.io Team.
  -  `bountyWallet`: address of wallet which holds tokens for bounty.
  -  `privateSaleWallet`: address of wallet which holds tokens for privateSale.