'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onReady, prefersReducedMotion } from '@/lib/ready'

gsap.registerPlugin(ScrollTrigger)

// Weighted scrolling for the whole page, kept in step with GSAP.
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 })
    window.__lenis = lenis
    if (!window.__siteReady) lenis.stop()

    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const off = onReady(() => lenis.start())

    return () => {
      off()
      gsap.ticker.remove(tick)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  return null
}
