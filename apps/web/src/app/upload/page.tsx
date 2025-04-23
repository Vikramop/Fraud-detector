"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { Upload, FileCode, AlertTriangle, CheckCircle } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function UploadPage() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [contractCode, setContractCode] = useState("")

  const [file, setFile] = useState<File>()
  const [activeTab, setActiveTab] = useState("upload")

  const inputFile = useRef(null)

  const handleUpload = async() => {
    if (!contractCode.trim()) return;

    setIsUploading(true);
  
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: contractCode }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Navigate to a summary page or display the result
        // For example, you can set the result in state and display it
        console.log('Analysis Result:', data.result);
        router.push('/summary'); // If you have a summary page
      } else {
        console.error('Analysis Error:', data.error);
      }
    } catch (error) {
      console.error('Request Error:', error);
    } finally {
      setIsUploading(false);
    }
  }

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
            className="mx-auto max-w-4xl"
          >
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold">Verify Smart Contract</h1>
              <p className="mt-2 text-muted-foreground">
                Upload your smart contract code for AI-powered security analysis
              </p>
            </div>

            <Tabs defaultValue="upload" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload">Upload Contract</TabsTrigger>
                <TabsTrigger value="spam">Spam Contracts</TabsTrigger>
                <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <motion.div variants={container} initial="hidden" animate="show" className="mt-6">
                  <Card className="border-border/50 bg-card/50 backdrop-blur-md">
                    <CardHeader>
                      <CardTitle>Upload Smart Contract</CardTitle>
                      <CardDescription>Paste your smart contract code below or upload a file</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <motion.div variants={item} className="space-y-4">
                        <Textarea
                          placeholder="Paste your smart contract code here..."
                          className="min-h-[300px] font-mono text-sm"
                          value={contractCode}
                          onChange={(e) => setContractCode(e.target.value)}
                        />
                        <div className="flex flex-col sm:flex-row gap-4">
                        <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={async(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          //@ts-ignore
                          const file = e.target.files[0];
                          setFile(file)
                          
                          const response = await fetch('/api/analyze', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ code: file }),
                          });

                          const data = await response.json();
  
                          if (response.ok) {
                            console.log('Analysis Result:', data.result);
                            router.push('/summary'); 
                          } else {
                            console.error('Analysis Error:', data.error);
                          }



                        }}/>
                          <Button variant="outline" className="flex-1" onClick={() => {
                            if(inputFile.current){
                              //@ts-ignore
                              inputFile.current.click()
                            }
                          }}>
                            <FileCode className="mr-2 h-4 w-4" />
                            Browse Files
                          </Button>
                          <Button
                            className="flex-1"
                            onClick={handleUpload}
                            disabled={isUploading || !contractCode.trim()}
                          >
                            {isUploading ? (
                              <>Processing...</>
                            ) : (
                              <>
                                <Upload className="mr-2 h-4 w-4" />
                                Verify Contract
                              </>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="spam">
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate={activeTab === "spam" ? "show" : "hidden"}
                  className="mt-6 space-y-6"
                >
                  <Card className="border-border/50 bg-card/50 backdrop-blur-md">
                    <CardHeader>
                      <CardTitle>Known Spam Contracts</CardTitle>
                      <CardDescription>Database of identified malicious contracts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                          <motion.div
                            key={i}
                            variants={item}
                            className="flex items-center gap-4 border-b border-border/50 pb-4 last:border-0 last:pb-0"
                          >
                            <AlertTriangle className="h-8 w-8 text-destructive shrink-0" />
                            <div className="flex-1">
                              <p className="font-medium">Malicious Contract #{i + 1}</p>
                              <p className="text-sm text-muted-foreground">
                                0x{Math.random().toString(16).substring(2, 10)}...
                                {Math.random().toString(16).substring(2, 10)}
                              </p>
                              <p className="text-xs text-destructive mt-1">
                                Identified: Rug Pull, Unauthorized Fund Transfer
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="guidelines">
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate={activeTab === "guidelines" ? "show" : "hidden"}
                  className="mt-6"
                >
                  <Card className="border-border/50 bg-card/50 backdrop-blur-md">
                    <CardHeader>
                      <CardTitle>Security Guidelines</CardTitle>
                      <CardDescription>Best practices for secure smart contract development</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <motion.div variants={item} className="space-y-4">
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                          <div>
                            <p className="font-medium">Use Secure Dependencies</p>
                            <p className="text-sm text-muted-foreground">
                              Always use audited and well-maintained libraries
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                          <div>
                            <p className="font-medium">Implement Access Controls</p>
                            <p className="text-sm text-muted-foreground">
                              Properly restrict access to sensitive functions
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                          <div>
                            <p className="font-medium">Validate All Inputs</p>
                            <p className="text-sm text-muted-foreground">
                              Never trust external inputs without validation
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                          <div>
                            <p className="font-medium">Avoid Common Vulnerabilities</p>
                            <p className="text-sm text-muted-foreground">
                              Be aware of reentrancy, overflow/underflow, and front-running attacks
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                          <div>
                            <p className="font-medium">Get Professional Audits</p>
                            <p className="text-sm text-muted-foreground">
                              Always have your code audited by security professionals
                            </p>
                          </div>
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
