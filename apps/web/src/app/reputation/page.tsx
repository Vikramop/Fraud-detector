"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Search, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReputationPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const users = [
    {
      name: "Alex Johnson",
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      reputation: "Trusted",
      score: 98,
      color: "bg-success text-success-foreground",
      transactions: 156,
      verified: true,
    },
    {
      name: "Maria Garcia",
      address: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
      reputation: "Good",
      score: 87,
      color: "bg-success text-success-foreground",
      transactions: 89,
      verified: true,
    },
    {
      name: "Unknown",
      address: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
      reputation: "Suspicious",
      score: 42,
      color: "bg-destructive text-destructive-foreground",
      transactions: 23,
      verified: false,
    },
    {
      name: "DeFi Protocol",
      address: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
      reputation: "Verified",
      score: 95,
      color: "bg-success text-success-foreground",
      transactions: 1205,
      verified: true,
    },
    {
      name: "Unknown",
      address: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
      reputation: "Neutral",
      score: 65,
      color: "bg-secondary text-secondary-foreground",
      transactions: 17,
      verified: false,
    },
  ]

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 gradient-bg">
        <div className="container py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-5xl"
          >
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold">Wallet Reputation</h1>
              <p className="mt-2 text-muted-foreground">
                View and search wallet reputation scores based on on-chain activity
              </p>
            </div>

            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by wallet address or name..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="trusted">Trusted</TabsTrigger>
                <TabsTrigger value="suspicious">Suspicious</TabsTrigger>
                <TabsTrigger value="neutral">Neutral</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                  {filteredUsers.map((user, index) => (
                    <motion.div key={index} variants={item}>
                      <Card className="border-border/50 bg-card/50 backdrop-blur-md overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-10 w-10 border border-border">
                                <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${user.name.charAt(0)}`} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium">{user.name}</h3>
                                  {user.verified && <CheckCircle className="h-4 w-4 text-success" />}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {user.address.substring(0, 6)}...{user.address.substring(user.address.length - 4)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className={user.color}>
                                    {user.reputation}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{user.transactions} transactions</p>
                              </div>
                              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background">
                                <span className="text-sm font-medium">{user.score}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>

              <TabsContent value="trusted" className="mt-6">
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                  {filteredUsers
                    .filter((user) => ["Trusted", "Good", "Verified"].includes(user.reputation))
                    .map((user, index) => (
                      <motion.div key={index} variants={item}>
                        <Card className="border-border/50 bg-card/50 backdrop-blur-md overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10 border border-border">
                                  <AvatarImage
                                    src={`/placeholder.svg?height=40&width=40&text=${user.name.charAt(0)}`}
                                  />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium">{user.name}</h3>
                                    {user.verified && <CheckCircle className="h-4 w-4 text-success" />}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {user.address.substring(0, 6)}...{user.address.substring(user.address.length - 4)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={user.color}>
                                      {user.reputation}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">{user.transactions} transactions</p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background">
                                  <span className="text-sm font-medium">{user.score}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </motion.div>
              </TabsContent>

              <TabsContent value="suspicious" className="mt-6">
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                  {filteredUsers
                    .filter((user) => user.reputation === "Suspicious")
                    .map((user, index) => (
                      <motion.div key={index} variants={item}>
                        <Card className="border-border/50 bg-card/50 backdrop-blur-md overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10 border border-border">
                                  <AvatarImage
                                    src={`/placeholder.svg?height=40&width=40&text=${user.name.charAt(0)}`}
                                  />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium">{user.name}</h3>
                                    <AlertTriangle className="h-4 w-4 text-destructive" />
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {user.address.substring(0, 6)}...{user.address.substring(user.address.length - 4)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={user.color}>
                                      {user.reputation}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">{user.transactions} transactions</p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background">
                                  <span className="text-sm font-medium">{user.score}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </motion.div>
              </TabsContent>

              <TabsContent value="neutral" className="mt-6">
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                  {filteredUsers
                    .filter((user) => user.reputation === "Neutral")
                    .map((user, index) => (
                      <motion.div key={index} variants={item}>
                        <Card className="border-border/50 bg-card/50 backdrop-blur-md overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10 border border-border">
                                  <AvatarImage
                                    src={`/placeholder.svg?height=40&width=40&text=${user.name.charAt(0)}`}
                                  />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-medium">{user.name}</h3>
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {user.address.substring(0, 6)}...{user.address.substring(user.address.length - 4)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={user.color}>
                                      {user.reputation}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">{user.transactions} transactions</p>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background">
                                  <span className="text-sm font-medium">{user.score}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
