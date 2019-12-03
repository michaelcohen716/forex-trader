const chainlinkHelpers = require("chainlink-test-helpers");

const MyContract = artifacts.require("ForexTrader");
const LinkToken = artifacts.require("LinkToken.sol");

const myContractAddress = '0x11ac119666299322820FE7265301a8c41158C92f'; // ropsten
const linkTokenAddress = '0x20fE562d797A42Dcb3399062AE9546cd06f63280'; // ropsten

const jobId = web3.utils.toHex('920fc1321dc441c68975aff18e30340c'); //fixer

const base = "USD"
const symbols = "GBP,JPY,EUR"
const copyPath =  'rates.EUR'
// const q = 'berlin';
// const copyPath = 'data.current_condition.0.temp_C';
// const times = 1;

module.exports = async function () {
    // We will only check events after this point
    const lastBlock = await web3.eth.getBlock('latest');

    const myContract = await MyContract.at(myContractAddress);
    console.log('Requester: ' + myContract.address);

    const linkTokenContract = await LinkToken.at(linkTokenAddress);
    console.log('LINK token: ' + linkTokenContract.address);

    // Send the contract 0.111 LINK for it to send it to the oracle
    // await linkTokenContract.transfer(myContract.address, web3.utils.toWei('0.111', 'ether'));
    // console.log('Sent 0.111 LINK to the requester');

    tx = await myContract.createRequest(jobId, base, symbols, copyPath, times);
    console.log('Created request');
    request = chainlinkHelpers.decodeRunRequest(tx.receipt.rawLogs[3]);
    console.log(request);

    // Wait until you get a ChainlinkFulfilled event with the same requestId
    while (true) {
        breakFlag = false;

        const fulfilledEvents = await myContract.getPastEvents('ChainlinkFulfilled', { fromBlock: lastBlock.number, toBlock: 'latest' });

        for (fulfilledEvent of fulfilledEvents) {
            if (request.id === fulfilledEvent.returnValues.id) {
                console.log(fulfilledEvent);
                breakFlag = true;
                break;
            }
        }
        if (breakFlag) {
            break;
        }
        await new Promise(done => setTimeout(done, 5000)); // 5 second delay
        console.log('...');
    }
    console.log('Request fulfilled');

    const returnedData = await myContract.data();
    console.log('eur rates', returnedData);
    // const temperature = parseFloat(returnedData.toString()) / times;
    // console.log('Temperature in Berlin: ' + temperature.toString());
}

// const jobId = web3.utils.toHex('a37ee8100c4c4ab19e30ae8039289b67'); //

// const q = 'berlin';
// const copyPath = 'data.current_condition.0.temp_C';
// const times = 1;
// const q = 'berlin';
// const copyPath = 'data.current_condition.0.temp_C';
// const times = 1;

// module.exports = async function () {
//     // We will only check events after this point
//     const lastBlock = await web3.eth.getBlock('latest');

//     const myContract = await MyContract.at(myContractAddress);
//     console.log('Requester: ' + myContract.address);

//     const linkTokenContract = await LinkToken.at(linkTokenAddress);
//     console.log('LINK token: ' + linkTokenContract.address);

//     // Send the contract 0.1 LINK for it to send it to the oracle
//     await linkTokenContract.transfer(myContract.address, web3.utils.toWei('0.1', 'ether'));
//     console.log('Sent 0.1 LINK to the requester');

//     tx = await myContract.createRequest(jobId, q, copyPath, times);
//     console.log('Created request');
//     request = chainlinkHelpers.decodeRunRequest(tx.receipt.rawLogs[3]);
//     console.log(request);

//     // Wait until you get a ChainlinkFulfilled event with the same requestId
//     while (true) {
//         breakFlag = false;

//         const fulfilledEvents = await myContract.getPastEvents('ChainlinkFulfilled', { fromBlock: lastBlock.number, toBlock: 'latest' });

//         for (fulfilledEvent of fulfilledEvents) {
//             if (request.id === fulfilledEvent.returnValues.id) {
//                 console.log(fulfilledEvent);
//                 breakFlag = true;
//                 break;
//             }
//         }
//         if (breakFlag) {
//             break;
//         }
//         await new Promise(done => setTimeout(done, 5000)); // 5 second delay
//         console.log('...');
//     }
//     console.log('Request fulfilled');

//     const returnedData = await myContract.data();
//     const temperature = parseFloat(returnedData.toString()) / times;
//     console.log('Temperature in Berlin: ' + temperature.toString());
// }
