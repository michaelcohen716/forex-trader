pragma solidity 0.4.24;

import "./ForexTrade.sol";

contract ForexTradeFactory {
    mapping(address => address[]) tradesByAddress; // user address => trade contract address
    mapping(address => bool) contractExists;

    address ropstenLINKAddress = 0x20fE562d797A42Dcb3399062AE9546cd06f63280;
    address oracleAddress = 0x4a3fbbb385b5efeb4bc84a25aaadcd644bd09721;

    bytes32 jobId;

    constructor(bytes32 _jobId) public {
        jobId = _jobId;
    }

    function createTrade(string _currencyA, string _currencyB) public {
        ForexTrade newTrade = new ForexTrade(
            ropstenLINKAddress,
            oracleAddress,
            _currencyA,
            _currencyB,
            jobId,
            address(this)
        );
        tradesByAddress[msg.sender].push(address(newTrade));
        contractExists[address(newTrade)] = true;
    }

    function registerCounterparty() public {
        require(contractExists[msg.sender] == true, "Invalid contract");
        tradesByAddress[tx.origin].push(msg.sender);
    }

    function getTradesByAddress(address _counterparty) view returns(address[] _trades){
        return tradesByAddress[_counterparty];
    }


}
