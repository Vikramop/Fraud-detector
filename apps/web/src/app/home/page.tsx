"use client"

import { motion } from "motion/react"
import { Shield, AlertTriangle, CheckCircle, TrendingUp, FileCode } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const stats = [
    {
      title: "Contracts Scanned",
      value: "1,234",
      description: "Last 30 days",
      icon: FileCode,
      color: "text-primary",
    },
    {
      title: "Fraud Detected",
      value: "56",
      description: "Last 30 days",
      icon: AlertTriangle,
      color: "text-destructive",
    },
    {
      title: "Verified Safe",
      value: "1,178",
      description: "Last 30 days",
      icon: CheckCircle,
      color: "text-success",
    },
    {
      title: "Reputation Score",
      value: "98.2%",
      description: "Platform average",
      icon: TrendingUp,
      color: "text-primary",
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
      <main className="flex-1 px-8 gradient-bg">
        <section className="container py-8 md:py-24 lg:py-32">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto flex max-w-[58rem] flex-col items-center justify-center text-center"
          >
            <Shield className="h-16 w-16 text-primary mb-4" />
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
              AI-Powered Blockchain Fraud Detection
            </h1>
            <p className="mt-4 max-w-[42rem] text-muted-foreground sm:text-xl">
              Detect fraudulent transactions on Ethereum and Arbitrum with our advanced AI/ML models. Build a safer
              blockchain ecosystem with open-source scam pattern detection.
            </p>
          </motion.div>
        </section>

        <section className="container mb-8 md:py-24">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div key={index} variants={item}>
                  <Card className="border-border/50 bg-card/50 backdrop-blur-md h-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-2xl font-medium">{stat.title}</CardTitle>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </section>

        <section className="container py-8 md:py-24">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >

                <div className="flex justify-center font-bold text-4xl items-center mb-8">
                    <h1>
                        Recent Activities On Chain
                    </h1>
                </div>
              <Card className="border-border/50 bg-card/50 backdrop-blur-md overflow-hidden">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest blockchain transactions and contract verifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i + 0.5, duration: 0.3 }}
                        className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4">
                          {i % 3 === 0 ? (
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                          ) : (
                            <CheckCircle className="h-8 w-8 text-success" />
                          )}
                          <div>
                            <p className="font-medium">
                              {i % 3 === 0 ? "Suspicious Contract" : "Verified Transaction"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              0x{Math.random().toString(16).substring(2, 10)}...
                              {Math.random().toString(16).substring(2, 10)}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">{Math.floor(Math.random() * 60)} min ago</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}
