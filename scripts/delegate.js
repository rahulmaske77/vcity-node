const {ethers} = require("ethers");

url = "http://207.81.171.181:8545";

provider = new ethers.JsonRpcProvider(url);

const stakingAddress = "0x0000000000000000000000000000000000000800"

const stakingAbi = require("./extensions/precompiles/abi/staking.json");

const delegatorAddress = "0x7cB61D4117AE31a12E393a1Cfa3BaC666481D02E";
const privateKey = "e9b1d63e8acd7fe676acb43afb390d4b0202dab61abec9cf2a561e4becb147de";
// const validatorAddress = "evmosvaloper1r0w5985kalhq285rexesckztfhwen8zfzmymfl";
const validatorAddress = "evmosvaloper17ey5n2pa97u5hdf960s5vl7tunndk8vldzmeas";

const signer = new ethers.Wallet(privateKey, provider);
const stakingContract = new ethers.Contract(stakingAddress, stakingAbi, signer);

stakingContract.delegation(delegatorAddress, validatorAddress).then((result) => {
    // parse share
    const share = result[0];
    console.log("Share:", share.toString());
    // parse balance
    const coinInfo = result[1];
    const balance = {
        denom: coinInfo.denom,
        amount: coinInfo.amount.toString()
    };
    console.log("Balance:", balance);
}).catch((error) => {
    console.error('Call delegation error:', error);
})

// check current balance
const getBalance = async (address) => {
    const balance = await provider.getBalance(address);
    console.log("Current Balance:", ethers.formatEther(balance));
}

getBalance(delegatorAddress).catch((error) => {
    console.error('Get balance error:', error);
});

// delegate some amount to a validator
const amount = ethers.parseEther("10000");
const gasLimit = 1000000;
const gasPrice = ethers.parseUnits("0.1", "gwei");
stakingContract.delegate(delegatorAddress, validatorAddress, amount, {gasLimit, gasPrice}).then((tx) => {
    console.log("Delegate tx:", tx.hash);
});

// getBalance(delegatorAddress).catch((error) => {
//     console.error('Get balance error:', error);
// });

// stakingContract.delegation(delegatorAddress, validatorAddress).then((result) => {
//     // parse share
//     const share = result[0];
//     console.log("Share:", share.toString());
//     // parse balance
//     const coinInfo = result[1];
//     const balance = {
//         denom: coinInfo.denom,
//         amount: coinInfo.amount.toString()
//     };
//     console.log("Balance:", balance);
// }).catch((error) => {
//     console.error('Call delegation error:', error);
// })