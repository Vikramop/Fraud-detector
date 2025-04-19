"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { Shield, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "@/hooks/usewallet"

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { address, connectWallet } = useWallet()

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false)
      router.push("/home")
    }, 1500)
  }

  const handleConnectWallet = async() => {
    setIsLoading(true)
    await connectWallet()

    setIsLoading(false)

    console.log(address)
    router.push("/home")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gradient-bg p-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <Shield className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold">BlockGuard</span>
          </motion.div>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-4xl mb-2">Sign In</CardTitle>
            <CardDescription>Sign in to your account or connect your wallet</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="mb-2">Username</Label>
                <Input id="username"  placeholder="Enter your username" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="mb-2">Password</Label>
                <Input id="password" type="password" placeholder="Enter your password" required />
              </div>
              <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="relative my-4 w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button variant="outline" className="w-full cursor-pointer" onClick={handleConnectWallet} disabled={isLoading}>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Ethereum Wallet
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
