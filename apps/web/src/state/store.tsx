"use client"
import { BrowserProvider, ethers } from "ethers";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";

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


      useEffect(() => {
        const checkConnection = async () => {
            //@ts-ignore
            if(window.ethereum){
                const storedAddress = localStorage.getItem("address");

                console.log("Stored address ", storedAddress)
                if(storedAddress){
                    try {
                        //@ts-ignore
                        const provider = new ethers.BrowserProvider(window.ethereum)
                        const signer = await provider.getSigner(storedAddress)

                        const address = await signer.getAddress();


                        if(address === storedAddress){
                            setWalletState({
                                address : address,
                                provider,
                                signer,
                                isConnected : true,
                                isConnecting : false,
                                error : null
                            })
                        } else {
                            localStorage.removeItem("address")
                        }
                    } catch (error) {
                        console.log("Error")
                        localStorage.removeItem("address")
                    }
                }
            }
        }

        checkConnection()
      }, [])




    return (
        <MyAppContext.Provider value={{walletState, setWalletState}}>
            {children}
        </MyAppContext.Provider>
    )


}