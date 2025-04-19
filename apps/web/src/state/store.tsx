"use client"
import { BrowserProvider, ethers } from "ethers";
import { createContext, Dispatch, SetStateAction, useState } from "react";

type WalletState = {
    address: string | null;
    provider : undefined | BrowserProvider,
    signer : ethers.JsonRpcSigner | null
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;
  };

interface MyAppContextType {
    walletState : WalletState,
    setWalletState : Dispatch<SetStateAction<WalletState>>
}


export const MyAppContext = createContext<MyAppContextType | null>(null)



export function MyAppContextProvider({
    children
} : {
    children : React.ReactNode
}){
    const [walletState, setWalletState] = useState<WalletState>({
        address: null,
        provider : undefined,
        signer : null,
        isConnected: false,
        isConnecting: false,
        error: null,
      })

    return (
        <MyAppContext.Provider value={{walletState, setWalletState}}>
            {children}
        </MyAppContext.Provider>
    )


}