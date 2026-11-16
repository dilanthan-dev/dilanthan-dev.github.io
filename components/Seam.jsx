'use client'

import { useEffect, useRef } from 'react'
import { ticker } from '@/data/site'
import { prefersReducedMotion } from '@/lib/ready'

const SPEED = 45 // pixels per second at rest

// The tilted strip on the diagonal between the light panel and the dark work section.
// It drifts on its own and speeds up while the page is scrolling.
export default function Seam() {
  const track = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = track.current
    let anim = null

    // The browser's own animation engine runs the drift, so it keeps going on every device.
    const start = () => {
      if (anim) anim.cancel()
      const half = el.scrollWidth / 2
      anim = el.animate([{ transform: 'translate3d(0,0,0)' }, { transform: `translate3d(${-half}px,0,0)` }], {
        duration: (half / SPEED) * 1000,
        iterations: Infinity,
      })
    }
    start()
    // Phones fire resize when the address bar hides, so restart only when the width changes.
    let width = window.innerWidth
    const onResize = () => {
      if (window.innerWidth === width) return
      width = window.innerWidth
      start()
    }
    window.addEventListener('resize', onResize)

    // Scrolling speeds the strip up, then it eases back to its resting pace.
    let lastY = window.scrollY
    let lastT = performance.now()
    let boost = 1
    let raf = 0
    const settle = () => {
      boost += (1 - boost) * 0.06
      if (anim) anim.playbackRate = boost
      if (boost > 1.01) raf = requestAnimationFrame(settle)
      else {
        boost = 1
        if (anim) anim.playbackRate = 1
        raf = 0
      }
    }
    const onScroll = () => {
      const now = performance.now()
      const v = Math.abs(window.scrollY - lastY) / Math.max(1, now - lastT) // px per ms
      lastY = window.scrollY
      lastT = now
      boost = Math.max(boost, 1 + Math.min(v, 6) * 1.5)
      if (!raf) raf = requestAnimationFrame(settle)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      if (anim) anim.cancel()
    }
  }, [])

  const items = [...ticker, ...ticker]

  return (
    <div className="seam" aria-hidden="true">
      <div className="seam-strip">
        <div className="seam-track" ref={track}>
          {[0, 1].map((copy) => (
            <span className="seam-group" key={copy}>
              {items.map((word, i) => (
                <span key={i}>
                  {word}
                  <i className="seam-dot" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
