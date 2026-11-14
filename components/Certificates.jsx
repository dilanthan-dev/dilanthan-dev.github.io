'use client'

import { useEffect, useRef, useState } from 'react'
import { certificates } from '@/data/site'

function wrap(i, n) {
  return ((i % n) + n) % n
}

// An arc of cards. The centre one faces you, follows the cursor and flips when clicked.
export default function Certificates() {
  const n = certificates.length
  const [active, setActive] = useState(Math.floor(n / 2))
  const [flipped, setFlipped] = useState(false)
  const stage = useRef(null)
  const drag = useRef(null)

  const go = (dir) => {
    setFlipped(false)
    setActive((a) => wrap(a + dir, n))
  }

  useEffect(() => {
    const el = stage.current
    const key = (e) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    el.addEventListener('keydown', key)
    return () => el.removeEventListener('keydown', key)
  })

  const down = (e) => {
    drag.current = { x: e.clientX, moved: false }
  }
  const up = (e) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    if (Math.abs(dx) > 40) {
      drag.current.moved = true
      go(dx < 0 ? 1 : -1)
    }
  }

  const tilt = (e, isActive) => {
    if (!isActive || e.pointerType !== 'mouse') return
    const card = e.currentTarget
    const r = card.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    card.style.setProperty('--tx', `${((py - 0.5) * -10).toFixed(2)}deg`)
    card.style.setProperty('--ty', `${((px - 0.5) * 14).toFixed(2)}deg`)
    card.style.setProperty('--glare-x', `${(px * 100).toFixed(1)}%`)
    card.style.setProperty('--glare-y', `${(py * 100).toFixed(1)}%`)
  }
  const untilt = (e) => {
    e.currentTarget.style.setProperty('--tx', '0deg')
    e.currentTarget.style.setProperty('--ty', '0deg')
  }

  return (
    <section className="certs" id="certificates" aria-labelledby="certs-title">
      <div className="certs-head">
        <h2 className="display certs-title" id="certs-title">
          Certifi<em>cates</em>
        </h2>
        <p className="certs-hint">Drag or use the arrows. Click the front card to see its details.</p>
      </div>

      <div
        className="certs-stage"
        ref={stage}
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="Certificates"
        onPointerDown={down}
        onPointerUp={up}
      >
        {certificates.map((c, i) => {
          let offset = i - active
          if (offset > n / 2) offset -= n
          if (offset < -n / 2) offset += n
          const isActive = offset === 0
          const hidden = Math.abs(offset) > 2
          return (
            <div
              key={i}
              className={`cert${isActive ? ' is-active' : ''}${isActive && flipped ? ' is-flipped' : ''}`}
              style={{ '--o': offset, '--abs': Math.abs(offset), visibility: hidden ? 'hidden' : 'visible' }}
              aria-hidden={!isActive}
              onPointerMove={(e) => tilt(e, isActive)}
              onPointerLeave={untilt}
              onClick={() => {
                if (drag.current?.moved) return
                if (isActive) setFlipped((f) => !f)
                else {
                  setFlipped(false)
                  setActive(i)
                }
              }}
            >
              <div className="cert-inner">
                <div className="cert-face cert-front">
                  {c.image ? (
                    <img src={c.image} alt={`${c.title}, ${c.issuer}`} loading="lazy" />
                  ) : (
                    <div className="cert-art">
                      <span className="cert-issuer">{c.issuer}</span>
                      <span className="cert-name">{c.title}</span>
                      <span className="cert-date">{c.date}</span>
                    </div>
                  )}
                  <span className="cert-glare" />
                </div>
                <div className="cert-face cert-back">
                  <dl>
                    <div>
                      <dt>Certificate</dt>
                      <dd>{c.title}</dd>
                    </div>
                    <div>
                      <dt>Issued by</dt>
                      <dd>{c.issuer}</dd>
                    </div>
                    <div>
                      <dt>Date</dt>
                      <dd>{c.date}</dd>
                    </div>
                  </dl>
                  {c.verify ? (
                    <a className="btn btn--accent" href={c.verify} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                      Verify certificate
                    </a>
                  ) : (
                    <span className="cert-noverify">No verify link yet</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="certs-nav">
        <button type="button" className="round-btn" onClick={() => go(-1)} aria-label="Previous certificate">
          ←
        </button>
        <span className="certs-count">
          {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </span>
        <button type="button" className="round-btn" onClick={() => go(1)} aria-label="Next certificate">
          →
        </button>
      </div>
    </section>
  )
}
