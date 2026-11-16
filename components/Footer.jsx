'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { site } from '@/data/site'
import { prefersReducedMotion, scrollToTarget } from '@/lib/ready'

function useClock(timeZone) {
  const [now, setNow] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-CA', { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    const tick = () => setNow(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [timeZone])
  return now
}

// Sits fixed under the page. The last section lifts away to show it.
export default function Footer() {
  const ref = useRef(null)
  const cover = useRef(null)
  const time = useClock(site.timezone)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const el = ref.current
    const main = document.querySelector('main')

    const size = () => {
      main.style.marginBottom = `${el.offsetHeight}px`
    }
    size()
    const ro = new ResizeObserver(size)
    ro.observe(el)

    // The outlined headline fills with crimson as the footer comes into view.
    const fill = () => {
      const h = el.offsetHeight
      const left = document.documentElement.scrollHeight - (window.scrollY + window.innerHeight)
      const p = Math.min(1, Math.max(0, 1 - left / h))
      el.style.setProperty('--fill', `${(p * 100).toFixed(1)}%`)
    }
    fill()
    window.addEventListener('scroll', fill, { passive: true })
    window.addEventListener('resize', fill)
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', fill)
      window.removeEventListener('resize', fill)
    }
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${site.email}`
    }
  }

  // The loader's expanding pill, played the other way: it covers the screen, the page jumps to the top, then it shrinks away.
  const toTop = (e) => {
    if (prefersReducedMotion()) {
      window.scrollTo(0, 0)
      return
    }
    const r = e.currentTarget.getBoundingClientRect()
    const scale = (Math.max(window.innerWidth, window.innerHeight) * 2.6) / r.height
    const c = cover.current
    gsap
      .timeline()
      .set(c, { left: r.left, top: r.top, width: r.width, height: r.height, scale: 1, opacity: 1, display: 'block' })
      .to(c, { scale, duration: 0.7, ease: 'expo.in' })
      .add(() => scrollToTarget(0, { immediate: true }))
      .to(c, { opacity: 0, duration: 0.5, ease: 'power1.out' }, '+=0.1')
      .set(c, { display: 'none' })
  }

  return (
    <>
    <footer className="footer" id="contact" ref={ref}>
      <div className="footer-glow" aria-hidden="true" />
      <p className="footer-kicker">Open for internships</p>
      <h2 className="footer-headline">
        <span>Got a</span>
        <span>project?</span>
        <span className="footer-fill">
          Let&apos;s <em>talk.</em>
        </span>
      </h2>

      <div className="footer-row">
        <button type="button" className="footer-email" onClick={copy}>
          <span>
            {/* Lets a long address wrap after the @ instead of mid-word. */}
            {site.email.split('@')[0]}@<wbr />
            {site.email.split('@')[1]}
          </span>
          <small>{copied ? 'Copied' : 'Click to copy'}</small>
        </button>

        <ul className="footer-links">
          <li>
            <a href={site.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={site.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
        </ul>
      </div>

      <div className="footer-base">
        <span className="footer-mark">
          D<b>4</b>RK
        </span>
        <span className="footer-clock">
          {site.city} <time suppressHydrationWarning>{time}</time>
        </span>
        <span className="footer-copy">© {new Date().getFullYear()} {site.name}</span>
        <button type="button" className="pill-btn" onClick={toTop}>
          Back to top
        </button>
      </div>
    </footer>
    <div className="top-cover" ref={cover} aria-hidden="true" />
    </>
  )
}
