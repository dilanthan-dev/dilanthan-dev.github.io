'use client'

import { useEffect, useRef } from 'react'
import { ticker } from '@/data/site'
import { prefersReducedMotion } from '@/lib/ready'

// The tilted strip on the diagonal between the light panel and the dark work section.
// It drifts on its own and speeds up with the scroll.
export default function Seam() {
  const track = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = track.current
    let x = 0
    let raf = 0
    let visible = false
    let last = performance.now()

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    })
    io.observe(el)

    function loop(now) {
      const dt = Math.min(64, now - last)
      last = now
      const v = Math.abs(window.__lenis?.velocity || 0)
      x -= (0.045 + Math.min(v, 60) * 0.012) * dt
      const half = el.scrollWidth / 2
      if (-x >= half) x += half
      el.style.transform = `translate3d(${x}px,0,0)`
      if (visible) raf = requestAnimationFrame(loop)
    }

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
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
