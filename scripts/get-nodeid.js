const axios = require('axios');

// 替换为你的Evmos节点的Tendermint RPC地址
const tendermintRPC = 'http://207.81.171.181:26657';

async function queryNodeID() {
  try {
    // 获取节点状态，这将包含节点ID
    const response = await axios.get(`${tendermintRPC}/status`);
    const nodeInfo = response.data.result.node_info;
    console.log('Node ID:', nodeInfo.id);
    console.log('Node Name:', nodeInfo.name);
  } catch (error) {
    console.error('Error querying node ID:', error);
  }
}

queryNodeID();