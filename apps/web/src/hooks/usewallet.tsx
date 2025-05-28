'use client';

import { useState, useEffect, useCallback, useContext } from 'react';
import { BrowserProvider, ethers } from 'ethers';
import { MyAppContext } from '@/state/store';

// type WalletState = {
//   address: string | null;
//   provider : undefined | BrowserProvider,
//   signer : ethers.JsonRpcSigner | null
//   isConnected: boolean;
//   isConnecting: boolean;
//   error: string | null;
// };

function useMyAppContext() {
  const context = useContext(MyAppContext);
  if (context === null) {
    throw new Error(
      'useStoreContext must be used within a StoreContextProvider'
    );
  }

  return context;
}

export function useWallet() {
  const { walletState, setWalletState } = useMyAppContext();

  // Check if ethereum is available in the window object
  const isEthereumAvailable = useCallback(() => {
    //@ts-ignore
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  }, []);

  const isMetaMaskAvailable = () => {
    return (
      typeof window !== 'undefined' &&
      window.ethereum &&
      window.ethereum.isMetaMask
    );
  };

  //   Connect to wallet
  const connectWallet = useCallback(async () => {
    let provider;
    let signer = null;
    if (!isMetaMaskAvailable()) {
      setWalletState((prev) => ({
        ...prev,
        error: 'MetaMask not found. Please install MetaMask.',
      }));
      return;
    }

    try {
      setWalletState((prev) => ({ ...prev, isConnecting: true, error: null }));

      provider = new ethers.BrowserProvider(window.ethereum);

      await provider.send('eth_requestAccounts', []);
      signer = await provider.getSigner();
      const account = await signer.getAddress();

      setWalletState({
        address: account,
        provider,
        signer,
        isConnected: true,
        isConnecting: false,
        error: null,
      });

      localStorage.setItem('address', account);
    } catch (error) {
      setWalletState({
        address: null,
        provider: undefined,
        signer: null,
        isConnected: false,
        isConnecting: false,
        error:
          error instanceof Error ? error.message : 'Failed to connect wallet',
      });
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWalletState({
      address: null,
      provider: undefined,
      signer: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (!isEthereumAvailable()) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnectWallet();
      } else if (accounts[0] !== walletState.address) {
        // User switched accounts
        setWalletState((prev) => ({
          ...prev,
          address: accounts[0]!,
          isConnected: true,
        }));
      }
    };

    const handleChainChanged = () => {
      // Reload the page when the chain changes
      window.location.reload();
    };

    //@ts-ignore
    if (window.ethereum) {
      //@ts-ignore
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      //@ts-ignore
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      //   if (window.ethereum) {
      //     window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
      //     window.ethereum.removeListener("chainChanged", handleChainChanged)
      //   }
    };
  }, [disconnectWallet, isEthereumAvailable, walletState.address]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
  };
}
