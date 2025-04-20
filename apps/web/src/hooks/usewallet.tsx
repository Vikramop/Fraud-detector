"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import { BrowserProvider, ethers } from "ethers";
import { MyAppContext } from "@/state/store";

// type WalletState = {
//   address: string | null;
//   provider : undefined | BrowserProvider,
//   signer : ethers.JsonRpcSigner | null
//   isConnected: boolean;
//   isConnecting: boolean;
//   error: string | null;
// };


function useMyAppContext(){
    const context = useContext(MyAppContext);
    if(context === null){
        throw new Error("useStoreContext must be used within a StoreContextProvider");
    }

    return context;
}

export function useWallet() {
    const {walletState, setWalletState} = useMyAppContext()

  // Check if ethereum is available in the window object
  const isEthereumAvailable = useCallback(() => {
    //@ts-ignore
    return typeof window !== "undefined" && window.ethereum !== undefined;
  }, []);

//   Connect to wallet
  const connectWallet = useCallback(async () => {
    let provider;
    let signer = null
    if (!isEthereumAvailable()) {
      setWalletState((prev) => ({
        ...prev,
        error:
          "Ethereum provider not found. Please install MetaMask or another wallet.",
      }));
      console.log("Ethereum not present");
      return
    }

    try {
      setWalletState((prev) => ({ ...prev, isConnecting: true, error: null }));


      //@ts-ignore
      provider = new ethers.BrowserProvider(window.ethereum);

      await provider.send("eth_requestAccounts", []);

      console.log("provider is ", provider)

      signer = await provider.getSigner();

      const account = await signer.getAddress()


    //   console.log("wallets are ", walletState);
    //   // Request account access
    //   //@ts-ignore
    //   console.log("window ", window.ethereum);
    //   // @ts-ignore
    //   console.log("window ", window.ethereum.request);
    //   //@ts-ignore
    //   const accounts = await window.ethereum.request({
    //     method: "eth_requestAccounts",
    //   });


    //   console.log("Account state is ", accounts);
    //   if (accounts.length > 0) {
    //     setWalletState({
    //       address: accounts[0]!,
    //       provider,
    //       signer,
    //       isConnected: true,
    //       isConnecting: false,
    //       error: null,
    //     });
    //   } else {
    //     throw new Error("No accounts found");
    //   }

    setWalletState({
              address: account,
              provider,
              signer,
              isConnected: true,
              isConnecting: false,
              error: null,
            });

            localStorage.setItem("address", account)
    } catch (error) {
      setWalletState({
        address: null,
        provider : undefined,
        signer : null,
        isConnected: false,
        isConnecting: false,
        error:
          error instanceof Error ? error.message : "Failed to connect wallet",
      });
    }
  }, [isEthereumAvailable]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWalletState({
      address: null,
      provider : undefined,
      signer : null,
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
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      //@ts-ignore
      window.ethereum.on("chainChanged", handleChainChanged);
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
