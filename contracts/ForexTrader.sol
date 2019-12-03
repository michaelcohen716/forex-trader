pragma solidity 0.4.24;

import "chainlink/contracts/ChainlinkClient.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @title MyContract is an example contract which requests data from
 * the Chainlink network
 * @dev This contract is designed to work on multiple networks, including
 * local test networks
 */
contract ForexTrader is ChainlinkClient, Ownable {
  // solium-disable-next-line zeppelin/no-arithmetic-operations
  uint256 constant private ORACLE_PAYMENT = LINK / 10;
  int256 public data; //maybe int instead. see return val

  /**
   * @notice Deploy the contract with a specified address for the LINK
   * and Oracle contract addresses
   * @dev Sets the storage for the specified addresses
   * @param _link The address of the LINK token contract
   * @param _oracle The address of the Oracle contract
   */
  constructor(address _link, address _oracle) public {
    setChainlinkToken(_link);
    setChainlinkOracle(_oracle);
  }

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
   * @param _jobId The bytes32 JobID to be executed
   * @param _baseCurrency USD
   * @param _symbols gbp/eur
   * @param _path The dot-delimited path to parse of the response
   * @param _times The number to multiply the result by
   */
  function createRequest(
    bytes32 _jobId,
    string _baseCurrency, // USD
    string _symbols,
    string _path,
    int256 _times
  )
    public
    onlyOwner
    returns (bytes32)
  {
    return createRequestTo(getOracle(), _jobId, _baseCurrency, _symbols, _path, _times);
  }

  /**
   * @notice Creates a request to the specified Oracle contract address
   * @dev This function ignores the stored Oracle contract address and
   * will instead send the request to the address specified
   * @param _oracle The Oracle contract address to send the request to
   * @param _jobId The bytes32 JobID to be executed
   * @param _baseCurrency base usd
   * @param _symbols eur,gbp,jpy
   * @param _path The dot-delimited path to parse of the response
   * @param _times The number to multiply the result by
   */
  function createRequestTo(
    address _oracle,
    bytes32 _jobId,
    string _baseCurrency, // USD
    string _symbols,
    string _path,
    int256 _times
  )
    public
    onlyOwner
    returns (bytes32 requestId)
  {
    Chainlink.Request memory req = buildChainlinkRequest(_jobId, this, this.fulfill.selector);
    req.add("copyPath", _path);
    req.add("base", _baseCurrency);
    req.add("symbols", _symbols);
    req.addInt("times", _times);
    requestId = sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
  }

  /**
   * @notice The fulfill method from requests created by this contract
   * @dev The recordChainlinkFulfillment protects this function from being called
   * by anyone other than the oracle address that the request was sent to
   * @param _requestId The ID that was generated for the request
   * @param _data The answer provided by the oracle
   */
  function fulfill(bytes32 _requestId, int256 _data)
    public
    recordChainlinkFulfillment(_requestId)
  {
    data = _data;
  }

  /**
   * @notice Allows the owner to withdraw any LINK balance on the contract
   */
  function withdrawLink() public onlyOwner {
    LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
    require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
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
  )
    public
	  onlyOwner
  {
    cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
  }
}