const { ethers } = require("ethers");

url = "http://207.81.171.181:8545";

provider = new ethers.JsonRpcProvider(url);

const distributionAddress = "0x0000000000000000000000000000000000000801"

const distribution = require("./extensions/precompiles/abi/distribution.json");

const distributionContract = new ethers.Contract(distributionAddress, distribution, provider);

const delegatorAddress = "0x1bdd429e96efEe051e83c9b30C584b4DDd999C49";
distributionContract.delegationTotalRewards(delegatorAddress)
    .then((result) => {
        // parse rewards for each validator
        result[0].forEach((rewardInfo) => {
            const validatorAddress = rewardInfo[0]; // validator address
            const rewards = rewardInfo[1].map(reward => {
            return {
                denom: reward.denom,
                amount: reward.amount.toString() // transfer BigNumber to string
            };
            });
            console.log(`Validator Address: ${validatorAddress}, Rewards:`, rewards);
        });
    
        // parse total rewards
        const totalRewards = result[1].map(token => {
            return {
            denom: token.denom,
            amount: token.amount.toString()
            };
        });
        console.log("Total Rewards:", totalRewards);
        })
        .catch((error) => {
        console.error('Call delegationTotalRewards error:', error);
    })
    .catch((error) => {
        console.error('Call delegationTotalRewards error:', error);
    });