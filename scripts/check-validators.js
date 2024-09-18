const {ethers} = require("ethers");

url = "http://207.81.171.181:8545";

provider = new ethers.JsonRpcProvider(url);

const stakingAddress = "0x0000000000000000000000000000000000000800"
const stakingAbi = require("./extensions/precompiles/abi/staking.json");
const stakingContract = new ethers.Contract(stakingAddress, stakingAbi, provider);

const pageRequest = {
    key: ethers.hexlify(new Uint8Array(0)), // 32 bytes, you can set it as needed
    offset: BigInt(0),
    limit: BigInt(10),
    countTotal: true,
    reverse: false
};

// stakingContract.validator("evmosvaloper1r0w5985kalhq285rexesckztfhwen8zfzmymfl").then((result) => {
//     console.log("Validator:", result);
// });

stakingContract.validators("BOND_STATUS_BONDED", pageRequest).then((result) => {
    console.log("Validators:", result);
}).catch((error) => {
    console.error('Call validators error:', error);
});