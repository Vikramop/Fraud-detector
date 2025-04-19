"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { AlertTriangle, CheckCircle, ArrowRight, Wrench } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SummaryPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("summary")

  const issues = [
    {
      id: 1,
      name: "getAuthFunction",
      type: "spam",
      description: "Function exposes private key in plaintext",
      lineNumber: 1,
      code: `getAuthFunction () {
  const function = get()privateKey xxx
  
  const function = get()publicKey
}`,
      fix: `getAuthFunction () {
  // Use secure authentication methods
  const function = get()publicKey
}`,
    },
    {
      id: 2,
      name: "getWallet",
      type: "security",
      description: "Insecure wallet access method",
      lineNumber: 12,
      code: `getWallet() {
  return {
    address: this.address,
    privateKey: this.privateKey // Exposing private key
  }
}`,
      fix: `getWallet() {
  return {
    address: this.address,
    // Don't expose private key
  }
}`,
    },
  ]

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
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Smart Contract Analysis</h1>
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Issues Found</span>
                </div>
              </div>
              <p className="mt-2 text-muted-foreground">
                AI-powered analysis detected potential security issues in your smart contract
              </p>
            </div>

            <Tabs defaultValue="summary" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="fix">Fix Issues</TabsTrigger>
              </TabsList>

              <TabsContent value="summary">
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate={activeTab === "summary" ? "show" : "hidden"}
                  className="mt-6"
                >
                  <Card className="border-border/50 bg-card/50 backdrop-blur-md">
                    <CardHeader>
                      <CardTitle>Summary Page</CardTitle>
                      <CardDescription>Overview of detected issues in your smart contract</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <motion.div variants={item} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card className="border-destructive/50">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold text-destructive">2</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">Warnings</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold text-amber-500">3</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium">Passed Checks</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold text-success">5</div>
                            </CardContent>
                          </Card>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-medium">Critical Issues</h3>

                          {issues.map((issue) => (
                            <div key={issue.id} className="border border-border/50 rounded-lg overflow-hidden">
                              <div className="bg-card/70 p-4 flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                                  <div>
                                    <p className="font-medium">
                                      {issue.id}. {issue.name} - {issue.type}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{issue.description}</p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setActiveTab("fix")}>
                                  Fix <ArrowRight className="ml-1 h-4 w-4" />
                                </Button>
                              </div>
                              <div className="bg-background/50 p-4 font-mono text-sm overflow-x-auto">
                                <pre className="whitespace-pre-wrap">
                                  <code className="code-highlight">{issue.code}</code>
                                </pre>
                              </div>
                            </div>
                          ))}

                          <div className="flex justify-end mt-6">
                            <Button onClick={() => setActiveTab("fix")}>
                              Fix All Issues <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="fix">
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate={activeTab === "fix" ? "show" : "hidden"}
                  className="mt-6"
                >
                  <Card className="border-border/50 bg-card/50 backdrop-blur-md">
                    <CardHeader>
                      <CardTitle>Improvised Smart Contract</CardTitle>
                      <CardDescription>Suggested fixes for the detected issues</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <motion.div variants={item} className="space-y-6">
                        {issues.map((issue) => (
                          <div key={issue.id} className="space-y-4">
                            <div className="flex items-start gap-3">
                              <Wrench className="h-5 w-5 text-primary mt-0.5" />
                              <div>
                                <p className="font-medium">
                                  {issue.id}. {issue.name}
                                </p>
                                <p className="text-sm text-muted-foreground">{issue.description}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div className="border border-border/50 rounded-lg overflow-hidden">
                                <div className="bg-card/70 p-2 text-sm font-medium">Original Code</div>
                                <div className="bg-background/50 p-4 font-mono text-sm overflow-x-auto">
                                  <pre className="whitespace-pre-wrap">
                                    <code className="code-highlight">{issue.code}</code>
                                  </pre>
                                </div>
                              </div>

                              <div className="border border-border/50 rounded-lg overflow-hidden">
                                <div className="bg-card/70 p-2 text-sm font-medium">Fixed Code</div>
                                <div className="bg-background/50 p-4 font-mono text-sm overflow-x-auto">
                                  <pre className="whitespace-pre-wrap">
                                    <code className="code-fixed">{issue.fix}</code>
                                  </pre>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="flex justify-end mt-6">
                          <Button>
                            Do These Changes <CheckCircle className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
