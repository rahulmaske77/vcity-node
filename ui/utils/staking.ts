// utils/staking.ts

import axios from 'axios';

// /cosmos/staking/v1beta1/validators

interface Validator {
  operator_address: string;
  consensus_pubkey: {
    type_url: string;
    value: string;
  };
  jailed: boolean;
  status: string;
  tokens: string;
  delegator_shares: string;
  description: {
    moniker: string;
    identity: string;
    website: string;
    security_contact: string;
    details: string;
  };
  unbonding_height: string;
  unbonding_time: string;
  commission: {
    commission_rates: {
      rate: string;
      max_rate: string;
      max_change_rate: string;
    };
    update_time: string;
  };
  min_self_delegation: string;
  unbonding_on_hold_ref_count: string;
  unbonding_ids: string[];
}

interface Pagination {
  next_key: string;
  total: string;
}

interface ValidatorsResponse {
  validators: Validator[];
  pagination: Pagination;
}

interface StakingParams {
  status?: string;
  pagination?: {
    key?: string;
    offset?: string;
    limit?: string;
    count_total?: boolean;
    reverse?: boolean;
  };
}

interface Delegation {
    delegator_address: string;
    validator_address: string;
    shares: string;
  }
  
  interface Balance {
    denom: string;
    amount: string;
  }
  
  interface DelegationResponse {
    delegation: Delegation;
    balance: Balance;
  }
  
  interface DelegationsResponse {
    delegation_responses: DelegationResponse[];
    pagination: Pagination;
  }
  
  interface DelegationsParams {
    pagination?: {
      key?: string;
      offset?: string;
      limit?: string;
      count_total?: boolean;
      reverse?: boolean;
    };
  }

const getValidators = async (params?: StakingParams): Promise<ValidatorsResponse> => {
  const apiIP = '207.81.171.181';
  const apiPort = '1317';
  const baseUrl = `http://${apiIP}:${apiPort}/cosmos/staking/v1beta1/validators`;

  try {
    const response = await axios.get(baseUrl, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching validators:', error);
    throw error;
  }
};

// /cosmos/staking/v1beta1/validators/{validator_addr}/delegations

const getDelegations = async (
    validatorAddr: string,
    params?: DelegationsParams
  ): Promise<DelegationsResponse> => {
    const apiIP = '207.81.171.181';
    const apiPort = '1317';
    const baseUrl = `http://${apiIP}:${apiPort}/cosmos/staking/v1beta1/validators/${validatorAddr}/delegations`;
  
    try {
      const response = await axios.get(baseUrl, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching delegations:', error);
      throw error;
    }
  };

export type {ValidatorsResponse, DelegationsResponse, Validator };
export { getValidators, getDelegations };
