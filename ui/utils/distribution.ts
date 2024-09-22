// utils/distribution.ts

import axios from 'axios';

interface SelfBondReward {
  denom: string;
  amount: string;
}

interface ValidatorDistributionInfo {
  operator_address: string;
  self_bond_rewards: SelfBondReward[];
  commission: SelfBondReward[];
}

const getValidatorDistributionInfo = async (
  validatorAddress: string
): Promise<ValidatorDistributionInfo> => {
  const apiIP = '207.81.171.181';
  const apiPort = '1317';
  const url = `http://${apiIP}:${apiPort}/cosmos/distribution/v1beta1/validators/${validatorAddress}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching validator distribution info:', error);
    throw error;
  }
};

export default getValidatorDistributionInfo;
export type { ValidatorDistributionInfo, SelfBondReward };