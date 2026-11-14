'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { site } from '@/data/site'
import { onReady, prefersReducedMotion } from '@/lib/ready'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const root = useRef(null)
  const inner = useRef(null)

  useEffect(() => {
    const el = root.current
    const off = onReady(() => el.classList.add('is-in'))
    if (prefersReducedMotion()) return off

    // The glow and the photo follow the cursor, eased so they drift rather than snap.
    const fine = window.matchMedia('(pointer: fine)').matches
    let tx = 0.5
    let ty = 0.4
    let x = tx
    let y = ty
    let raf = 0
    let running = true
    const move = (e) => {
      tx = e.clientX / window.innerWidth
      ty = e.clientY / window.innerHeight
    }
    const loop = () => {
      x += (tx - x) * 0.06
      y += (ty - y) * 0.06
      el.style.setProperty('--gx', `${(x * 100).toFixed(2)}%`)
      el.style.setProperty('--gy', `${(y * 100).toFixed(2)}%`)
      el.style.setProperty('--tilt-x', ((x - 0.5) * 2).toFixed(3))
      el.style.setProperty('--tilt-y', ((y - 0.5) * 2).toFixed(3))
      if (running) raf = requestAnimationFrame(loop)
    }
    if (fine) {
      window.addEventListener('pointermove', move, { passive: true })
      raf = requestAnimationFrame(loop)
    }

    // As the About panel rises, the hero sinks back and dims.
    const ctx = gsap.context(() => {
      gsap.to(inner.current, {
        scale: 0.9,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: document.getElementById('about'),
          start: 'top bottom',
          end: 'top top',
          scrub: true,
          // Stop the cursor loop while the hero is fully covered.
          onLeave: () => {
            running = false
          },
          onEnterBack: () => {
            if (!fine || running) return
            running = true
            raf = requestAnimationFrame(loop)
          },
        },
      })
    }, el)

    return () => {
      off()
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      ctx.revert()
    }
  }, [])

  const last = site.lastName.toUpperCase()

  return (
    <section className="hero" id="top" ref={root} aria-label="Introduction">
      <div className="hero-inner" ref={inner}>
        <div className="hero-glow" aria-hidden="true" />

        <h1 className="hero-title">
          <span className="sr-only">{site.name}</span>
          <span className="hero-first" aria-hidden="true">
            {site.firstName.toUpperCase()}
          </span>
        </h1>

        <div className="hero-last" aria-hidden="true">
          <div className="hero-last-track">
            {[0, 1, 2, 3].map((i) => (
              <span key={i}>{last}</span>
            ))}
          </div>
        </div>

        <div className="hero-photo-wrap">
          <img
            className="hero-photo"
            src="/me.webp"
            alt={`Portrait of ${site.name}`}
            width="1536"
            height="2304"
            fetchPriority="high"
          />
        </div>

        <span className="hero-first hero-first--outline" aria-hidden="true">
          {site.firstName.toUpperCase()}
        </span>

        <p className="hero-pitch">
          {site.role} {site.pitch}
        </p>

        <ul className="hero-social" aria-label="Elsewhere">
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
          <li>
            <a href={`mailto:${site.email}`}>Email</a>
          </li>
        </ul>

        <span className="hero-scroll" aria-hidden="true">
          Scroll
        </span>
      </div>
    </section>
  )
}
