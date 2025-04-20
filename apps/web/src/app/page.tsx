import { useWallet } from "@/hooks/usewallet"
import { redirect } from "next/navigation"

export default function Home() {
  // In a real app, check authentication status here
  // For now, redirect to sign-in page

  const { address } = useWallet()

  console.log("address is ", address)
  if(address){
    return redirect("/home")
  } else {
    console.log("address is ", address)
    redirect("/signin")
  }
}
