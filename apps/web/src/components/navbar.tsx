"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Shield, Upload, Home, Users, Activity, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SiEthereum } from "react-icons/si"
import { useWallet } from "@/hooks/usewallet";

const navItems = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Verify Contract", href: "/upload", icon: Upload },
  { name: "Reputation", href: "/reputation", icon: Users },
  { name: "Transactions", href: "/transactions", icon: Activity },
];

export function Navbar() {
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState(pathname);

  const { address } = useWallet();
  console.log("address is ", address)
  if(!address){
    console.log("address is ", address)
    redirect("/signin")
  }


  const formatedAddress = useMemo(() => {
      let newAddress = address.slice(0,4);

      newAddress += address.slice(address.length - 4 , address.length)
      newAddress += "..."
      console.log(newAddress)
      return newAddress
  }, [address])


  return (
    <header className="sticky px-8 py-2 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 max-w-screen-2xl items-center px-4">
        <div className="flex gap-8 justify-between w-full">
          <Link href="/home" className="mr-6 flex items-center space-x-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Shield className="h-6 w-6 text-primary" />
            </motion.div>
            <motion.span
              className="hidden font-bold sm:inline-block"
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              BlockGuard
            </motion.span>
          </Link>
          <nav className="hidden md:flex items-center space-x-20 text-sm font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center space-x-1 text-sm font-medium transition-colors hover:text-foreground ${
                    pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                  onMouseOver={() => setHoveredPath(item.href)}
                  onMouseLeave={() => setHoveredPath(pathname)}
                >
                  <motion.span 
                  initial={{scale : 0.8, opacity : 0}}
                  animate={{scale : 1, opacity : 1}}
                  transition={{duration : 0.3}}
                  className="flex items-center justiy-center gap-1">
                    <Icon className="mr-1 h-4 w-4" />
                    <span>{item.name}</span>
                  </motion.span>
                  {pathname === item.href && (
                    <motion.span
                      className="absolute left-0 right-0 -bottom-[16px] h-[2px] bg-primary"
                      layoutId="navbar-indicator"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  {hoveredPath === item.href && pathname !== item.href && (
                    <motion.span
                      className="absolute left-0 right-0 -bottom-[16px] h-[2px] bg-primary/40"
                      layoutId="navbar-indicator-hover"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-end space-x-2">
           <div className="flex flex-col justify-center items-center">
           {!address ? <Avatar className="h-8 w-8">
              <AvatarImage
                src={`Name`}
                alt="User"
              /> 
              <AvatarFallback>U</AvatarFallback>
            </Avatar> : <SiEthereum />}
            <div>
              {address && formatedAddress}
            </div>
           </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="grid gap-6 p-8 text-lg font-medium">
                  <Link
                    href="/home"
                    className="flex items-center gap-2 text-foreground"
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  <Link
                    href="/upload"
                    className="flex items-center gap-2 text-foreground"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Verify Contract</span>
                  </Link>
                  <Link
                    href="/reputation"
                    className="flex items-center gap-2 text-foreground"
                  >
                    <Users className="h-5 w-5" />
                    <span>Reputation</span>
                  </Link>
                  <Link
                    href="/transactions"
                    className="flex items-center gap-2 text-foreground"
                  >
                    <Activity className="h-5 w-5" />
                    <span>Transactions</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
