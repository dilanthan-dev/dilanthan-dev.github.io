'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { site } from '@/data/site'
import { markReady, prefersReducedMotion } from '@/lib/ready'

const MIN_COUNT_MS = 1300

// Waits for the real things the first screen needs: the photo, the fonts and the page.
function trackAssets(onProgress) {
  const tasks = [
    new Promise((resolve) => {
      const img = new Image()
      img.onload = img.onerror = resolve
      img.src = '/me.webp'
    }),
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((resolve) => {
      if (document.readyState === 'complete') resolve()
      else window.addEventListener('load', resolve, { once: true })
    }),
  ]
  let done = 0
  tasks.forEach((t) => t.then(() => onProgress(++done / tasks.length)))
  return Promise.all(tasks)
}

export default function Loader() {
  const [show, setShow] = useState(true)
  const root = useRef(null)
  const pill = useRef(null)
  const count = useRef(null)
  const countWrap = useRef(null)
  const mark = useRef(null)
  const aka = useRef(null)
  const cover = useRef(null)

  useEffect(() => {
    // Plays on every page load, except for visitors who turn animations off.
    if (prefersReducedMotion()) {
      setShow(false)
      markReady()
      return
    }

    document.documentElement.classList.add('is-loading')
    let target = 0
    let shown = 0
    let raf = 0
    let finished = false
    const start = performance.now()

    // The counter eases toward the real progress and never runs ahead of it.
    const step = () => {
      const elapsed = performance.now() - start
      const cap = Math.min(1, elapsed / MIN_COUNT_MS)
      shown += (Math.min(target, cap) - shown) * 0.12
      if (target >= 1 && cap >= 1 && shown > 0.995) shown = 1
      if (count.current) count.current.textContent = `${Math.max(1, Math.round(shown * 100))}%`
      if (shown < 1) raf = requestAnimationFrame(step)
      else if (!finished) {
        finished = true
        reveal()
      }
    }

    trackAssets((p) => (target = p))
    raf = requestAnimationFrame(step)

    let tl
    function reveal() {
      const rests = mark.current.querySelectorAll('.mark-rest')
      const widths = Array.from(rests, (r) => r.scrollWidth)

      tl = gsap.timeline()
      tl.to(countWrap.current, { opacity: 0, y: -8, duration: 0.3, ease: 'power2.in' })
        .set(countWrap.current, { display: 'none' })
        .fromTo(mark.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' })
        .to({}, { duration: 0.35 })
        .to(mark.current, { columnGap: '0.32em', duration: 0.7, ease: 'expo.inOut' }, 'open')
        .to(rests, { width: (i) => widths[i], duration: 0.7, ease: 'expo.inOut', stagger: 0.06 }, 'open')
        .to(rests, { opacity: 1, duration: 0.4, stagger: 0.06 }, 'open+=0.25')
        .fromTo(aka.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45 }, '-=0.25')
        .to({}, { duration: 0.85 })
        .to([mark.current, aka.current], { opacity: 0, duration: 0.25 })
        .add(() => {
          const r = pill.current.getBoundingClientRect()
          const scale = (Math.max(window.innerWidth, window.innerHeight) * 2.6) / r.height
          gsap.set(cover.current, { left: r.left, top: r.top, width: r.width, height: r.height, opacity: 1 })
          gsap.to(cover.current, { scale, duration: 0.85, ease: 'expo.inOut' })
        })
        .to({}, { duration: 0.75 })
        .add(() => {
          markReady()
          document.documentElement.classList.remove('is-loading')
        })
        .to(root.current, { opacity: 0, duration: 0.45, ease: 'power1.out' })
        .add(() => setShow(false))
    }

    return () => {
      cancelAnimationFrame(raf)
      if (tl) tl.kill()
      document.documentElement.classList.remove('is-loading')
    }
  }, [])

  if (!show) return null

  const line = 'Software engineer • 3D web developer • '

  return (
    <div className="loader" ref={root} aria-live="polite" aria-label="Loading the site">
      <div className="loader-marquee" aria-hidden="true">
        <div className="loader-track">
          <span>{line.repeat(2)}</span>
          <span>{line.repeat(2)}</span>
        </div>
      </div>

      <div className="loader-center">
        <div className="pill" ref={pill}>
          <span className="pill-count" ref={countWrap}>
            Loading <b ref={count}>1%</b>
          </span>
          <span className="pill-mark" ref={mark} aria-label="Driven 4 Real Knowledge">
            {site.mark.map((w) => (
              <span key={w.lead} className={w.accent ? 'mark-word is-accent' : 'mark-word'} aria-hidden="true">
                {w.lead}
                {w.rest && <span className="mark-rest">{w.rest}</span>}
              </span>
            ))}
          </span>
        </div>
        <p className="loader-aka" ref={aka}>
          {site.name}, aka {site.nickname}
        </p>
      </div>

      <div className="loader-cover" ref={cover} />
    </div>
  )
}
