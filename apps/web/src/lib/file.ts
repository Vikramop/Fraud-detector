"use client"

import { useEffect, useState } from "react"
import { useMotionValue, useSpring, useTransform } from "motion/react"

// Custom hook for cursor effects
export function useCursorEffect() {
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 700 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    window.addEventListener("mousemove", moveCursor)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
    }
  }, [cursorX, cursorY])

  return { cursorXSpring, cursorYSpring }
}

// Custom hook for scroll-triggered animations
export function useScrollAnimation() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return { scrollY }
}

// Custom hook for hover animations
export function useHoverAnimation() {
  const [isHovered, setIsHovered] = useState(false)

  const scale = useTransform(useMotionValue(isHovered ? 1 : 0), [0, 1], [1, 1.05])

  const brightness = useTransform(useMotionValue(isHovered ? 1 : 0), [0, 1], [1, 1.1])

  const handleHoverStart = () => setIsHovered(true)
  const handleHoverEnd = () => setIsHovered(false)

  return {
    scale,
    brightness,
    handleHoverStart,
    handleHoverEnd,
  }
}
