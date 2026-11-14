'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshReflectorMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { drawPoster, postersFontsReady, POSTER_W, POSTER_H } from '@/lib/poster'

// Frame size in scene units (16:10).
const FRAME_W = 2.6
const FRAME_H = 1.625

const FOV = 38
const TAN = Math.tan(THREE.MathUtils.degToRad(FOV / 2))

// Where the three frames hang. Index 0 is the centre piece.
const ROW = [
  [0, 0.45, 0],
  [-3.3, 0.45, 0],
  [3.3, 0.45, 0],
]
const COLUMN = [
  [0, 1.7, 0],
  [0, 0, 0],
  [0, -1.7, 0],
]

const WALL = '#3a2a47'
const FLOOR = '#6f6678'
const TUNGSTEN = '#ffd9a6'

function usePosterTextures(projects) {
  const [textures, setTextures] = useState(null)

  useEffect(() => {
    let cancelled = false
    const made = []
    const loader = new THREE.TextureLoader()

    postersFontsReady().then(() => {
      if (cancelled) return
      projects.forEach((project) => {
        let texture
        if (project.image) {
          texture = loader.load(project.image)
        } else {
          const canvas = document.createElement('canvas')
          canvas.width = POSTER_W
          canvas.height = POSTER_H
          drawPoster(canvas.getContext('2d'), project)
          texture = new THREE.CanvasTexture(canvas)
        }
        texture.colorSpace = THREE.SRGBColorSpace
        texture.anisotropy = 8
        made.push(texture)
      })
      setTextures(made)
    })

    return () => {
      cancelled = true
      made.forEach((t) => t.dispose())
    }
  }, [projects])

  return textures
}

function Frame({ position, scale, texture, lightRef, artRef }) {
  const target = useMemo(() => new THREE.Object3D(), [])

  return (
    <group position={position} scale={scale}>
      <primitive object={target} position={[0, 0, 0]} />
      <spotLight
        ref={lightRef}
        target={target}
        position={[0, 3.4, 2.7]}
        color={TUNGSTEN}
        angle={0.5}
        penumbra={0.9}
        decay={1.6}
        distance={14}
        intensity={0}
      />
      {/* Outer frame */}
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[FRAME_W + 0.14, FRAME_H + 0.14, 0.07]} />
        <meshStandardMaterial color="#c2a063" roughness={0.42} metalness={0.25} />
      </mesh>
      {/* Artwork */}
      <mesh position={[0, 0, 0.07]}>
        <planeGeometry args={[FRAME_W, FRAME_H]} />
        <meshStandardMaterial
          ref={artRef}
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={0.02}
          roughness={0.65}
        />
      </mesh>
    </group>
  )
}

function Hall({ projects, pointerRef, dimRef, onActive, onGreet, autoGreet, reducedMotion }) {
  const { camera, size } = useThree()
  const aspect = size.width / size.height
  const portrait = aspect < 0.9
  const slots = portrait ? COLUMN : ROW
  const frameScale = portrait ? 0.8 : 1

  // Pull the camera back until every frame fits on screen.
  const view = useMemo(() => {
    if (portrait) {
      const byHeight = 4.3 / TAN
      const byWidth = (FRAME_W * 0.4 + 0.4) / (TAN * aspect)
      return { dist: Math.max(byHeight, byWidth), lookY: -0.6, floorY: -2.95 }
    }
    const byWidth = 5.5 / (TAN * aspect)
    return { dist: Math.max(8.6, byWidth), lookY: 0.05, floorY: -1.2 }
  }, [portrait, aspect])

  const textures = usePosterTextures(projects)

  const lights = useRef([])
  const arts = useRef([])
  const cursorLight = useRef()
  const floorLight = useRef()
  const cursorTarget = useMemo(() => new THREE.Object3D(), [])

  const tools = useMemo(
    () => ({
      ray: new THREE.Raycaster(),
      ndc: new THREE.Vector2(),
      plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.08),
      hit: new THREE.Vector3(),
      smooth: new THREE.Vector3(0, 0.4, 0.08),
    }),
    []
  )

  const state = useRef({ levels: [0, 0, 0], dwellFrom: -1, greetedAt: -1, active: -1 })

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05)
    const t = clock.elapsedTime
    const s = state.current
    const ptr = pointerRef.current

    // With no recent pointer, the light drifts slowly on its own.
    const idle = !ptr.has || performance.now() - ptr.last > 4500
    let nx = ptr.x
    let ny = ptr.y
    if (idle) {
      nx = reducedMotion ? 0 : Math.sin(t * 0.33) * 0.6
      ny = reducedMotion ? 0.1 : 0.12 + Math.sin(t * 0.47 + 1) * 0.22
    }

    tools.ndc.set(nx, ny)
    tools.ray.setFromCamera(tools.ndc, camera)
    if (!tools.ray.ray.intersectPlane(tools.plane, tools.hit)) tools.hit.set(0, 0, 0.08)
    tools.smooth.lerp(tools.hit, 1 - Math.exp(-dt * 7))
    cursorTarget.position.copy(tools.smooth)

    // Which frame is the visitor pointing at?
    let active = -1
    if (!idle) {
      slots.forEach((pos, i) => {
        const dx = Math.abs(tools.hit.x - pos[0])
        const dy = Math.abs(tools.hit.y - pos[1])
        if (dx < (FRAME_W * frameScale) / 2 + 0.2 && dy < (FRAME_H * frameScale) / 2 + 0.2) active = i
      })
    }
    if (active !== s.active) {
      s.active = active
      onActive(active)
    }

    // The greeting: rest the light on the centre piece and the room wakes up.
    if (s.greetedAt < 0) {
      const onCentre = portrait ? active >= 0 : active === 0
      if (!onCentre) s.dwellFrom = -1
      else if (s.dwellFrom < 0) s.dwellFrom = t
      const dwelt = s.dwellFrom >= 0 && t - s.dwellFrom > 0.55
      if (dwelt || reducedMotion || (autoGreet && t > 1.4)) {
        s.greetedAt = t
        onGreet()
      }
    }

    const dim = 1 - THREE.MathUtils.clamp(dimRef.current, 0, 1)
    slots.forEach((pos, i) => {
      const d = Math.hypot(tools.smooth.x - pos[0], (tools.smooth.y - pos[1]) * 1.15)
      let target = THREE.MathUtils.smoothstep(2.7 - d, 0, 1.7)
      if (s.greetedAt >= 0 && t - s.greetedAt > i * 0.32) {
        target = Math.max(0.72, target)
      }
      if (i === active) target = 1
      s.levels[i] += (target - s.levels[i]) * (1 - Math.exp(-dt * 3.6))

      const light = lights.current[i]
      const art = arts.current[i]
      if (light) light.intensity = s.levels[i] * 34 * dim
      if (art) art.emissiveIntensity = (0.025 + s.levels[i] * 0.62) * dim
    })

    if (cursorLight.current) cursorLight.current.intensity = 46 * dim
    if (floorLight.current) floorLight.current.intensity = 2.6 * dim

    // A little parallax, so the room has depth.
    const k = 1 - Math.exp(-dt * 2.5)
    const px = reducedMotion ? 0 : nx * 0.55
    const py = reducedMotion ? 0 : ny * 0.22
    camera.position.x += (px - camera.position.x) * k
    camera.position.y += (view.lookY + 0.25 + py - camera.position.y) * k
    camera.position.z += (view.dist - camera.position.z) * k
    camera.lookAt(0, view.lookY, 0)
  })

  return (
    <>
      <ambientLight intensity={0.14} color="#b9a6d9" />

      {/* Shines straight down, so it lights the floor and its reflections but not the wall. */}
      <directionalLight ref={floorLight} position={[0, 10, 0]} intensity={0} />

      <primitive object={cursorTarget} />
      <spotLight
        ref={cursorLight}
        target={cursorTarget}
        position={[0, 1.2, 7.5]}
        color={TUNGSTEN}
        angle={0.2}
        penumbra={1}
        decay={1.5}
        distance={22}
        intensity={0}
      />

      {/* Wall */}
      <mesh position={[0, 2, 0]}>
        <planeGeometry args={[60, 16]} />
        <meshStandardMaterial color={WALL} roughness={0.95} />
      </mesh>

      {/* Floor */}
      <mesh position={[0, view.floorY, 8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 16]} />
        <MeshReflectorMaterial
          color={FLOOR}
          resolution={portrait ? 256 : 512}
          blur={[320, 90]}
          mixBlur={1}
          mixStrength={3}
          mirror={1}
          roughness={0.7}
          metalness={0.35}
        />
      </mesh>

      {textures &&
        projects.map((project, i) => (
          <Frame
            key={project.id}
            position={slots[i]}
            scale={frameScale}
            texture={textures[i]}
            lightRef={(el) => (lights.current[i] = el)}
            artRef={(el) => (arts.current[i] = el)}
          />
        ))}
    </>
  )
}

export default function GalleryScene({ paused, ...props }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop={paused ? 'never' : 'always'}
      camera={{ fov: FOV, position: [0, 0.3, 12], near: 0.1, far: 80 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#0d0912']} />
      <Hall {...props} />
    </Canvas>
  )
}
