const { ethers, toBeHex } = require("ethers");

url = "http://207.81.171.181:8545";

provider = new ethers.JsonRpcProvider(url);

const txhash = "0xc7b5a09c5e87f1660c1e1812ed5b47915120e1394a3d55344961b1575b662988";

provider.getTransactionReceipt(txhash).then((receipt) => {
    console.log("Receipt:", receipt);
  }).catch((error) => {
    console.error('查询交易失败', error);
  });