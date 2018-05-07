pragma solidity ^0.4.18;

import "../node_modules/zeppelin-solidity/contracts/crowdsale/emission/MintedCrowdsale.sol";
import "../node_modules/zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "../node_modules/zeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";

contract EbikeTokenCrowdsale is TimedCrowdsale, MintedCrowdsale, Ownable {

    // ICO stage
    enum ICOStage { PreSale, ICO }
    ICOStage public stage = ICOStage.PreSale;
    mapping (uint => uint256) bonus;

    bool isFinished = false;

    // Token Distribution
    uint8 constant decimals = 18;
    uint256 public totalTokenLimit = 109000000 * (10 ** uint256(decimals)); //   109 milions EBK
    uint256 public publicMaxTokens = 60000000 * (10 ** uint256(decimals)); //   60 milions EBK
    uint256 public totalTokensForPreSale = 10000000 * (10 ** uint256(decimals)); // 10 million EBK
    uint256 public totalTokensForPrivateSale = 4000000 * (10 ** uint256(decimals)); //  4 million EBK
    uint256 public totalTokensForDevelopers = 20000000 * (10 ** uint256(decimals)); //  20 million EBK
    uint256 public totalTokensForTeam = 10000000 * (10 ** uint256(decimals));   //  10 million EBK
    uint256 public totalTokensForBounty = 5000000 * (10 ** uint256(decimals));  //  5 million EBK

    uint256 public totalTokensMintedPreSale = 0;
    uint256 public totalTokensMintedICO = 0;
    
    // Amount raised in PreSale and ICO
    uint256 public totalWeiRaisedDuringPreSale;
    uint256 public totalWeiRaisedDuringICO;

    uint public constant bonusCoff = 1000; // Values should be 10x percents, value 1000 = 100%

    function EbikeTokenCrowdsale (uint256 _openingTime, uint256 _closingTime, uint256 _rate, address _wallet, MintableToken _token) public 
        Crowdsale(_rate, _wallet, _token)
        TimedCrowdsale(_openingTime, _closingTime) {

            // Set Bonus for PreSale and ICO
            bonus[uint(ICOStage.PreSale)] = 500;
            bonus[uint(ICOStage.ICO)] = 0;
    }

    /**
    * @dev Reverts if minted token is more then limit
    */
    modifier onlyWhenNotOnLimit {
        uint256 _mintedTillNow = totalTokensMintedICO;
        uint256 _totalTokens = publicMaxTokens;
        if (stage == ICOStage.PreSale) {
            _totalTokens =  totalTokensForPreSale;
            _mintedTillNow = totalTokensMintedPreSale;
        }
        require(_mintedTillNow < _totalTokens);
        _;
    }

    modifier notFinished {
        require( isFinished != true);
        _;
    }

    modifier onlyOnPreSale {
        require(stage == ICOStage.PreSale);
        _;
    } 

    function startSaleNow() public onlyOwner {
        openingTime = now;
    }

    // Change starting time of Crowdsale
    function setOpeningTime(uint256 _openingTime) public onlyOwner {
        require(_openingTime < closingTime);
        openingTime = _openingTime;
    }

    // Update Circulating tokens
    function setMaxTokenForPublic(uint256 _maxTokens) public onlyOwner {
        require(_maxTokens > publicMaxTokens);
        uint256 diff = _maxTokens - publicMaxTokens;
        publicMaxTokens = _maxTokens;
        totalTokenLimit = totalTokenLimit.add(diff);
    }

    // Change Crowdsale Stage. Available Options: PreSale, ICO
    function setCrowdsaleStage(uint value) public onlyOwner {
        
        ICOStage _stage;

        if (uint(ICOStage.PreSale) == value) {
            _stage = ICOStage.PreSale;
        } else if (uint(ICOStage.ICO) == value) {
            _stage = ICOStage.ICO;
        }

        stage = _stage;
    }

    // Change the current rate
    function setCurrentRate(uint256 _rate) private {
        require(_rate != 0);
        rate = _rate;
    }

    // Bonus for PreSale and ICO
    function _amountWithBonus(uint256 amount) internal returns (uint256) {
        uint256 _bonus = bonus[uint(stage)];
        return amount.mul(bonusCoff.add(_bonus)).div(bonusCoff);
    }

    /**
   * @dev Override the default one
   */
    function _getTokenAmount(uint256 _weiAmount) internal view returns (uint256) {
        uint256 amount = super._getTokenAmount(_weiAmount);
        // return amount with bonus
        return _amountWithBonus(amount);
    }

    /**
   * @dev Override the default one
   */
    function _updatePurchasingState(address _beneficiary, uint256 _weiAmount) internal {
        // optional override
        uint256 _tokenToBeMint = _getTokenAmount(_weiAmount);
        if (stage == ICOStage.PreSale) {
            totalTokensMintedPreSale = totalTokensMintedPreSale.add(_tokenToBeMint);
            totalWeiRaisedDuringPreSale = totalWeiRaisedDuringPreSale.add(_weiAmount);
        } else if (stage == ICOStage.ICO) {
            totalTokensMintedICO = totalTokensMintedICO.add(_tokenToBeMint);
            totalWeiRaisedDuringICO = totalWeiRaisedDuringICO.add(_weiAmount);
        }
        super._updatePurchasingState(_beneficiary, _weiAmount);
    }

    /**
    * @dev Validation of an incoming purchase. 
    */
    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal notFinished onlyWhenNotOnLimit  {
        uint256 _tokenToBeMint = _getTokenAmount(_weiAmount);
        uint256 _totalTokens = publicMaxTokens;
        uint256 _mintedTillNow = totalTokensMintedICO;
        if (stage == ICOStage.PreSale) {
            _totalTokens =  totalTokensForPreSale;
            _mintedTillNow = totalTokensMintedPreSale;
        }
        require(_mintedTillNow.add(_tokenToBeMint) < _totalTokens);
        super._preValidatePurchase(_beneficiary, _weiAmount);
    }

    /**
    * @dev Finish PreSale
    */
    function FinishPreSale() public onlyOwner onlyOnPreSale {
        
        uint256 unsoldTokens = totalTokensForPreSale - totalTokensMintedPreSale;
        if (unsoldTokens > 0) {
            // Mint unsold tokens and send it to wallet
            // MintTokens(wallet, unsoldTokens);
            publicMaxTokens = publicMaxTokens.add(unsoldTokens);
            totalTokensMintedPreSale = totalTokensForPreSale;
        }
        // Set Sale Stage to ICO
        setCrowdsaleStage(1);
        return;
    }

    function MintTokens(address _beneficiary, uint256 _tokenAmount) internal {
        require(_beneficiary != 0x0);
        require(_tokenAmount > 0);
        MintableToken(token).mint(_beneficiary, _tokenAmount);
        return;
    }


    function finish(address developerWallet, address teamWallet, address bountyWallet, address privateSaleWallet) public onlyOwner notFinished {
        require(developerWallet != 0x0);
        require(teamWallet != 0x0);
        require(bountyWallet != 0x0);
        require(privateSaleWallet != 0x0);
        
        isFinished = true;
        MintTokens(developerWallet, totalTokensForDevelopers);
        MintTokens(teamWallet, totalTokensForTeam);
        MintTokens(bountyWallet, totalTokensForBounty);
        MintTokens(privateSaleWallet, totalTokensForPrivateSale);
    }
}