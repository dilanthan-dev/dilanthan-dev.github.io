'use client'

import { useRef, useState } from 'react'
import { projects } from '@/data/site'
import Poster from '@/components/Poster'

function Card({ project, wide, onOpen }) {
  const ref = useRef(null)

  // A small 3D tilt toward the cursor.
  const move = (e) => {
    if (e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--rx', `${(((e.clientY - r.top) / r.height - 0.5) * -6).toFixed(2)}deg`)
    ref.current.style.setProperty('--ry', `${(((e.clientX - r.left) / r.width - 0.5) * 8).toFixed(2)}deg`)
  }
  const leave = () => {
    ref.current.style.setProperty('--rx', '0deg')
    ref.current.style.setProperty('--ry', '0deg')
  }

  return (
    <button
      ref={ref}
      type="button"
      className={wide ? 'work-card is-wide' : 'work-card'}
      onPointerMove={move}
      onPointerLeave={leave}
      onClick={() => onOpen(project)}
      style={{ '--hue': project.hue }}
    >
      <span className="work-media">
        <Poster project={project} />
      </span>
      <span className="work-meta">
        <span className="work-title">{project.title}</span>
        <span className="work-kind">
          {project.kind} · {project.year}
        </span>
        <span className="work-role">{project.role}</span>
      </span>
      <span className="work-open">Details</span>
    </button>
  )
}

export default function Work() {
  const dialog = useRef(null)
  const [open, setOpen] = useState(null)

  const show = (p) => {
    setOpen(p)
    dialog.current.showModal()
    window.__lenis?.stop()
  }
  const close = () => {
    dialog.current.close()
  }

  return (
    <section className="work" id="work" aria-labelledby="work-title">
      <h2 className="display work-heading" id="work-title">
        Selected <em>work</em>
      </h2>

      <div className="work-grid">
        {projects.map((p, i) => (
          <Card key={p.id} project={p} wide={i === 0} onOpen={show} />
        ))}
      </div>

      <dialog
        ref={dialog}
        className="work-dialog"
        onClose={() => {
          setOpen(null)
          window.__lenis?.start()
        }}
        onClick={(e) => {
          if (e.target === dialog.current) close()
        }}
        aria-labelledby="work-dialog-title"
      >
        {open && (
          <div className="work-dialog-body">
            <button type="button" className="work-dialog-close" onClick={close}>
              Close
            </button>
            <p className="work-dialog-kind">
              {open.kind} · {open.year}
            </p>
            <h3 className="display work-dialog-title" id="work-dialog-title">
              {open.title}
            </h3>
            <p className="work-dialog-role">{open.role}</p>
            <p>{open.description}</p>
            <ul>
              {open.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
            <p className="work-dialog-tech">
              <span>Built with</span> {open.builtWith}
            </p>
            {open.links.map((l) => (
              <a key={l.href} className="btn btn--accent" href={l.href} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            ))}
          </div>
        )}
      </dialog>
    </section>
  )
}
