"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Search, AlertTriangle, CheckCircle, ArrowUpRight, ArrowDownRight, Filter } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")

  const transactions = [
    {
      hash: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      from: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
      to: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
      value: "0.5 ETH",
      status: "genuine",
      time: "2 minutes ago",
      type: "transfer",
    },
    {
      hash: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      from: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
      to: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      value: "1.2 ETH",
      status: "fraud",
      time: "15 minutes ago",
      type: "contract",
    },
    {
      hash: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      from: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
      to: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
      value: "0.05 ETH",
      status: "genuine",
      time: "45 minutes ago",
      type: "transfer",
    },
    {
      hash: "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
      from: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
      to: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
      value: "3.7 ETH",
      status: "suspicious",
      time: "1 hour ago",
      type: "contract",
    },
    {
      hash: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
      from: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      to: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
      value: "0.8 ETH",
      status: "genuine",
      time: "2 hours ago",
      type: "transfer",
    },
  ]

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchQuery.toLowerCase())

    if (filter === "all") return matchesSearch
    if (filter === "genuine") return matchesSearch && tx.status === "genuine"
    if (filter === "fraud") return matchesSearch && (tx.status === "fraud" || tx.status === "suspicious")
    if (filter === "transfers") return matchesSearch && tx.type === "transfer"
    if (filter === "contracts") return matchesSearch && tx.type === "contract"

    return matchesSearch
  })

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
        <div className="container py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-6xl"
          >
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold">Arbitrum Transactions</h1>
              <p className="mt-2 text-muted-foreground">
                Monitor and analyze blockchain transactions with AI-powered fraud detection
              </p>
            </div>

            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by transaction hash or address..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="genuine">Genuine Only</SelectItem>
                  <SelectItem value="fraud">Suspicious/Fraud</SelectItem>
                  <SelectItem value="transfers">Transfers</SelectItem>
                  <SelectItem value="contracts">Contract Calls</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
              {filteredTransactions.map((tx, index) => (
                <motion.div key={index} variants={item}>
                  <Card className="border-border/50 bg-card/50 backdrop-blur-md overflow-hidden">
                    <CardContent className="px-8 py-2">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border">
                              {tx.type === "transfer" ? (
                                <ArrowUpRight className="h-4 w-4" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{tx.type === "transfer" ? "Transfer" : "Contract Call"}</p>
                              <p className="text-xs text-muted-foreground">{tx.time}</p>
                            </div>
                          </div>
                          <div>
                            {tx.status === "genuine" ? (
                              <Badge variant="outline" className="bg-success text-success-foreground">
                                <CheckCircle className="mr-1 h-3 w-3" /> Genuine
                              </Badge>
                            ) : tx.status === "fraud" ? (
                              <Badge variant="outline" className="bg-destructive text-destructive-foreground">
                                <AlertTriangle className="mr-1 h-3 w-3" /> Fraud
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-[oklch(0.7_0.2_80)] text-[oklch(0.98_0_0)]">
                                <AlertTriangle className="mr-1 h-3 w-3" /> Suspicious
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid gap-2 text-sm mb-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1 border-b border-border/50">
                            <span className="text-muted-foreground">Transaction Hash</span>
                            <span className="font-mono">
                              {tx.hash.substring(0, 10)}...{tx.hash.substring(tx.hash.length - 8)}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1 border-b border-border/50">
                            <span className="text-muted-foreground">From</span>
                            <span className="font-mono">
                              {tx.from.substring(0, 10)}...{tx.from.substring(tx.from.length - 8)}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1 border-b border-border/50">
                            <span className="text-muted-foreground">To</span>
                            <span className="font-mono">
                              {tx.to.substring(0, 10)}...{tx.to.substring(tx.to.length - 8)}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1">
                            <span className="text-muted-foreground">Value</span>
                            <span className="font-medium">{tx.value}</span>
                          </div>
                        </div>

                        <div className="flex justify-start">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
