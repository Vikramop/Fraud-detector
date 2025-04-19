"use client"

import { useState, useEffect, useCallback } from "react"

type WalletState = {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  })

  // Check if ethereum is available in the window object
  const isEthereumAvailable = useCallback(() => {
    //@ts-ignore
    return typeof window !== "undefined" && window.ethereum !== undefined
  }, [])

  // Connect to wallet
  const connectWallet = useCallback(async () => {
    if (!isEthereumAvailable()) {
      setWalletState((prev) => ({
        ...prev,
        error: "Ethereum provider not found. Please install MetaMask or another wallet.",
      }))
      return
    }

    try {
      setWalletState((prev) => ({ ...prev, isConnecting: true, error: null }))

      // Request account access
      //@ts-ignore
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

      if (accounts.length > 0) {
        setWalletState({
          address: accounts[0],
          isConnected: true,
          isConnecting: false,
          error: null,
        })
      } else {
        throw new Error("No accounts found")
      }
    } catch (error) {
      setWalletState({
        address: null,
        isConnected: false,
        isConnecting: false,
        error: error instanceof Error ? error.message : "Failed to connect wallet",
      })
    }
  }, [isEthereumAvailable])

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWalletState({
      address: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    })
  }, [])

  // Listen for account changes
  useEffect(() => {
    if (!isEthereumAvailable()) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        disconnectWallet()
      } else if (accounts[0] !== walletState.address) {
        // User switched accounts
        setWalletState((prev) => ({
          ...prev,
          address: accounts[0]!,
          isConnected: true,
        }))
      }
    }

    const handleChainChanged = () => {
      // Reload the page when the chain changes
      window.location.reload()
    }

    //@ts-ignore
    if (window.ethereum) {
        //@ts-ignore
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      //@ts-ignore
      window.ethereum.on("chainChanged", handleChainChanged)
    }

    return () => {
    //   if (window.ethereum) {
    //     window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
    //     window.ethereum.removeListener("chainChanged", handleChainChanged)
    //   }
    }
  }, [disconnectWallet, isEthereumAvailable, walletState.address])

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
  }
}
