pragma solidity 0.4.24;

import "chainlink/contracts/ChainlinkClient.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

interface ForexTradeFactoryContract {
    function registerCounterparty();
}

/**
 * @title MyContract is an example contract which requests data from
 * the Chainlink network
 * @dev This contract is designed to work on multiple networks, including
 * local test networks
 */
contract ForexTrade is ChainlinkClient, Ownable {
    // solium-disable-next-line zeppelin/no-arithmetic-operations
    uint256 private constant ORACLE_PAYMENT = LINK / 10;
    int256 public rate;

    /* Core */
    string[2] currencies; // ["USD", "EUR"]
    address[2] counterparties; // ["Alice", "Bob"]
    // Alice is betting on USD gaining value

    bytes32 jobId;
    int256 times = 10000; // multiply oracle result by 10,000: 1.345% = 13450;
    bool ratesInitiated = false;

    uint256[2] accountCollateral; // initial values ~= notional / 5
    uint256[2] accountReceipts; // initial values = 0 // still need this??

    uint256 notional; // wei
    uint256 tradePeriodStart; // timestamp
    uint256 tradePeriodEnd; // timestamp

    /**
   * @notice Deploy the contract with a specified address for the LINK
   * and Oracle contract addresses
   * @dev Sets the storage for the specified addresses
   * @param _link The address of the LINK token contract
   * @param _oracle The address of the Oracle contract
   */
    constructor(
        address _link,
        address _oracle,
        string _currencyA,
        string _currencyB,
        bytes32 _jobId,
        address _factoryAddress
    ) public {
        setChainlinkToken(_link);
        setChainlinkOracle(_oracle);
        currencies[0] = _currencyA;
        currencies[1] = _currencyB;
        counterparties[0] = tx.origin;
        jobId = _jobId;

        ForexTradeFactoryContract factoryContract = ForexTradeFactoryContract(_factoryAddress);
    }

    /* Chainlink functions */

    /**
   * @notice Returns the address of the LINK token
   * @dev This is the public implementation for chainlinkTokenAddress, which is
   * an internal method of the ChainlinkClient contract
   */
    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    /**
   * @notice Returns the address of the Oracle contract
   * @dev This is the public implementation for chainlinkOracleAddress, which is
   * an internal method of the ChainlinkClient contract
   */
    function getOracle() public view returns (address) {
        return chainlinkOracleAddress();
    }

    /**
   * @notice Creates a request to the stored Oracle contract address
   * @dev Calls createRequestTo using the stored Oracle contract address
   * for the first parameter
   */
    function createRequest() public returns (bytes32) {
        return
            createRequestTo(
                getOracle(),
                jobId,
                currencies[0],
                currencies[1],
                times
            );
    }

    /**
   * @notice Creates a request to the specified Oracle contract address
   * @dev This function ignores the stored Oracle contract address and
   * will instead send the request to the address specified
   * @param _oracle The Oracle contract address to send the request to
   * @param _jobId The bytes32 JobID to be executed
   * @param _baseCurrency base currency
   * @param _symbol pair currency
   * @param _times The number to multiply the result by
   */
    function createRequestTo(
        address _oracle,
        bytes32 _jobId,
        string _baseCurrency, // USD
        string _symbol, // EUR
        int256 _times
    ) public returns (bytes32 requestId) {
        Chainlink.Request memory req = buildChainlinkRequest(
            _jobId,
            this,
            this.fulfill.selector
        );
        req.add("copyPath", getCopyPath());
        req.add("base", _baseCurrency);
        req.add("symbols", _symbol);
        req.addInt("times", _times);
        requestId = sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
    }

    function getCopyPath() internal view returns (string) {
        return string(abi.encodePacked("rates.", currencies[1]));
    }

    /**
   * @notice The fulfill method from requests created by this contract
   * @dev The recordChainlinkFulfillment protects this function from being called
   * by anyone other than the oracle address that the request was sent to
   * @param _requestId The ID that was generated for the request
   * @param _rate The answer provided by the oracle
   */
    function fulfill(bytes32 _requestId, int256 _rate)
        public
        recordChainlinkFulfillment(_requestId)
    {
        if (!ratesInitiated) {
            ratesInitiated = true;
        } else {
            // (oldRate, newRate)
            runRepricing(rate, _rate);
        }
        rate = _rate;
    }

    function runRepricing(int256 oldRate, int256 newRate) private {
        // currencies = ["USD", "EUR"]
        // counterparties = ["addr0", "addr1"]
        // notional = 1,000,000
        // accountCollateral pre = [200000, 200000]
        // oldRate: USD/EUR = 0.9000 * 10000 = 9000
        // newRate: USD/EUR = 0.9200 * 10000 = 9200 (USD appreciated in this ex.)

        uint256 changeInRate;
        uint256 changeInValue;

        if (oldRate < newRate) {
            // currencies[0] is the currency that appreciated
            changeInRate = uint256(newRate) - uint256(oldRate); // 9200 - 9000 = 200
            changeInValue = (notional * changeInRate) / uint256(times); // 1000000 * 200 / 10000 = 20000
            accountCollateral[0] = accountCollateral[0] + changeInValue;
            accountCollateral[1] = accountCollateral[1] - changeInValue;
            /* accountCollateral post TX = [220000, 180000] */
        } else if (oldRate == newRate) {
            return;
        } else {
            changeInRate = uint256(oldRate) - uint256(newRate);
            changeInValue = (notional * changeInRate) / uint256(times);
            accountCollateral[0] = accountCollateral[0] - changeInValue;
            accountCollateral[1] = accountCollateral[1] + changeInValue;
        }

        // add liquidation condition for less than 15% collateralized (initial = 20%)

    }

    /**
   * @notice Call this method if no response is received within 5 minutes
   * @param _requestId The ID that was generated for the request to cancel
   * @param _payment The payment specified for the request to cancel
   * @param _callbackFunctionId The bytes4 callback function ID specified for
   * the request to cancel
   * @param _expiration The expiration generated for the request to cancel
   */
    function cancelRequest(
        bytes32 _requestId,
        uint256 _payment,
        bytes4 _callbackFunctionId,
        uint256 _expiration
    ) public onlyOwner {
        cancelChainlinkRequest(
            _requestId,
            _payment,
            _callbackFunctionId,
            _expiration
        );
    }

    /* Core functions --> one contract per swap */

    function initiateTrade(uint256 _notional, uint256 _tradePeriodEnd)
        public
        payable
        isNotInitiated
    {
        require(msg.value > _notional / 5, "Insufficient collateral"); // initiate at max 5x leverage

        counterparties[0] = msg.sender;
        accountCollateral[0] = msg.value;
        notional = _notional;

        tradePeriodEnd = _tradePeriodEnd;
    }

    modifier isNotInitiated() {
        require(notional == 0, "Swap already initiated");
        _;
    }

    modifier isInitiated() {
        require(notional > 0, "Swap not yet initiated");
        _;
    }

    // Contract must be funded with LINK for this function to run
    function acceptTrade() public payable isInitiated {
        require(msg.value > notional / 5, "Insufficient collateral");

        counterparties[1] = msg.sender;
        accountCollateral[1] = msg.value;

        tradePeriodStart = block.timestamp;
        updateRates();
    }

    // Contract must be funded with LINK for this function to run
    function updateRates() public {
        require(tradePeriodStart > 0, "Trade yet to begin");
        createRequest();
    }
}
