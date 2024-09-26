'use client';

import { useEffect, useState } from 'react';
import { BrowserProvider, ethers } from 'ethers';
import { MetaMaskProvider } from "@metamask/sdk-react"
import contractABI from '../../../scripts/extensions/precompiles/abi/staking.json';

const Pledge = () => {
    const nodeId = 'evmosvaloper1r0w5985kalhq285rexesckztfhwen8zfzmymfl';
    const [stakeAmount, setStakeAmount] = useState('');
    const [account, setAccount] = useState(null);
    const contractAddress = '0x0000000000000000000000000000000000000800';
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

    // const contractABI = require('/extensions/precompiles/abi/staking.json');

    useEffect(() => {
        const connectMetaMask = async () => {
            if (!window.ethereum) {
                alert('MetaMask is not installed!');
                return;
            }
            try {
                const browserProvider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await browserProvider.send('eth_requestAccounts', []);
                setProvider(browserProvider);
                setAccount(accounts[0]);
            } catch (error) {
                console.error('Error connecting to MetaMask:', error);
                alert('Error connecting to MetaMask');
            }
        };

        connectMetaMask();
    }, []);

    const handleStake = async () => {
        if (!provider) {
            console.log('Provider not available');
            return;
        }
        
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        const amount = ethers.parseUnits(stakeAmount, 'ether');

        try {
            const result = await contract.delegate(account, nodeId, amount);
            console.log('Stake result:', result);
        } catch (error) {
            console.error('Error delegating stake:', error);
            alert('Error delegating stake');
        }
    };

    return (
        <div>
            <h1>节点ID: {nodeId}</h1>
            <input
                type='number'
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder='Stake amount'
            />
            <button onClick={handleStake}>Stake</button>
        </div>
    )
};

export default Pledge;