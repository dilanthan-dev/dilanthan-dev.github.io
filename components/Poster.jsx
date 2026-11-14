'use client'

import { useEffect, useRef } from 'react'
import { drawPoster, postersFontsReady, POSTER_W, POSTER_H } from '@/lib/poster'

// The same artwork that hangs in the 3D gallery, shown flat in the work list.
export default function Poster({ project }) {
  const ref = useRef(null)

  useEffect(() => {
    if (project.image) return
    let cancelled = false
    postersFontsReady().then(() => {
      if (cancelled || !ref.current) return
      drawPoster(ref.current.getContext("2d"), project, { text: false })
    })
    return () => {
      cancelled = true
    }
  }, [project])

  if (project.image) {
    return <img className="poster" src={project.image} alt={`Screenshot of ${project.title}`} loading="lazy" />
  }

  return (
    <canvas
      ref={ref}
      className="poster"
      width={POSTER_W}
      height={POSTER_H}
      role="img"
      aria-label={`Artwork for ${project.title}`}
    />
  )
}
