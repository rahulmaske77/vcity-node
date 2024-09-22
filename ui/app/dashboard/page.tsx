'use client';
import { useEffect, useState } from 'react';
import { getValidators, getDelegations, ValidatorsResponse, Validator, DelegationsResponse } from '@/utils/staking';
import { ValidatorDistributionInfo } from '@/utils/distribution';
import getValidatorDistributionInfo from '@/utils/distribution';

export default function Dashboard() {
  const [validators, setValidators] = useState<ValidatorsResponse | null>(null);
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(null);
  const [delegations, setDelegations] = useState<DelegationsResponse | null>(null);
  const [validatorInfo, setValidatorInfo] = useState<Map<string, ValidatorDistributionInfo>>(new Map());

  useEffect(() => {
    const fetchValidators = async () => {
      const data = await getValidators();
      setValidators(data);
    };

    fetchValidators();
  }, []);

  useEffect(() => {
    if (validators) {
      Promise.all(
        validators.validators.map(async (validator) => {
          const info = await getValidatorDistributionInfo(validator.operator_address);
          setValidatorInfo((prev) => new Map(prev.set(validator.operator_address, info)));
        })
      );
    }
  }, [validators]);

  const handleValidatorClick = async (validator: Validator) => {
    setSelectedValidator(validator);
    const delegationsData = await getDelegations(validator.operator_address);
    setDelegations(delegationsData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Validators</h1>
      {validators ? (
        <div className="space-y-4">
          {validators.validators.map((validator) => {
            const info = validatorInfo.get(validator.operator_address);
            return (
              <div
                key={validator.operator_address}
                className="bg-white shadow-md rounded-lg p-4 cursor-pointer"
                onClick={() => handleValidatorClick(validator)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Operator Address:</span>
                  <span className="text-gray-500">{validator.operator_address}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Moniker:</span>
                  <span className="text-gray-500">{validator.description.moniker}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Status:</span>
                  <span className="text-gray-500">{validator.status}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Tokens:</span>
                  <span className="text-gray-500">{validator.tokens}</span>
                </div>
                {info && (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700">Self Bond Rewards:</span>
                      <span className="text-gray-500">
                        {info.self_bond_rewards.map((reward) => `${reward.denom}: ${reward.amount}`).join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700">Commission:</span>
                      <span className="text-gray-500">
                        {info.commission.map((com) => `${com.denom}: ${com.amount}`).join(', ')}
                      </span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">Loading...</p>
      )}

      {selectedValidator && delegations && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Delegations for {selectedValidator.operator_address}</h2>
          <div className="space-y-4">
            {delegations.delegation_responses.map((delegation, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Delegator Address:</span>
                  <span className="text-gray-500">{delegation.delegation.delegator_address}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Shares:</span>
                  <span className="text-gray-500">{delegation.delegation.shares}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Balance:</span>
                  <span className="text-gray-500">{delegation.balance.amount} {delegation.balance.denom}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}