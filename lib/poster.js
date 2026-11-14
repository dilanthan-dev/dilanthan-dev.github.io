// Draws the artwork that hangs in each frame.
// Each project gets its own abstract piece, so the gallery works
// before any real screenshots are added.

export const POSTER_W = 1280
export const POSTER_H = 800

const DISPLAY = '"Unbounded Variable", Arial, sans-serif'
const TEXT = '"Geist Variable", Arial, sans-serif'

function seeded(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function glow(ctx, x, y, r, color) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r)
  g.addColorStop(0, color)
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(x - r, y - r, r * 2, r * 2)
}

function rounded(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawAura(ctx, w, h) {
  ctx.fillStyle = '#041416'
  ctx.fillRect(0, 0, w, h)
  ctx.globalCompositeOperation = 'lighter'
  glow(ctx, w * 0.28, h * 0.3, w * 0.55, 'rgba(70,205,185,0.55)')
  glow(ctx, w * 0.8, h * 0.62, w * 0.5, 'rgba(105,95,255,0.42)')
  glow(ctx, w * 0.58, h * 0.12, w * 0.35, 'rgba(170,255,215,0.25)')
  ctx.globalCompositeOperation = 'source-over'

  const rand = seeded(7)
  for (let i = 0; i < 170; i++) {
    const s = rand() * 2.2 + 0.4
    ctx.fillStyle = `rgba(235,255,250,${0.2 + rand() * 0.6})`
    ctx.beginPath()
    ctx.arc(rand() * w, rand() * h, s, 0, Math.PI * 2)
    ctx.fill()
  }

  ctx.save()
  ctx.translate(w * 0.64, h * 0.44)
  ctx.rotate(-0.38)
  for (let i = 0; i < 7; i++) {
    const rx = 70 + i * 50
    ctx.strokeStyle = `rgba(255,255,255,${0.5 - i * 0.055})`
    ctx.lineWidth = i === 0 ? 5 : 2.5
    ctx.beginPath()
    ctx.ellipse(0, 0, rx, rx * 0.6, 0, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.restore()
}

function drawGenz(ctx, w, h) {
  ctx.fillStyle = '#1a0b06'
  ctx.fillRect(0, 0, w, h)
  ctx.globalCompositeOperation = 'lighter'
  glow(ctx, w * 0.85, h * 0.85, w * 0.6, 'rgba(255,120,50,0.4)')
  glow(ctx, w * 0.1, h * 0.05, w * 0.45, 'rgba(255,70,110,0.22)')
  ctx.globalCompositeOperation = 'source-over'

  const rand = seeded(21)
  const cols = 4
  const rows = 3
  const gap = 26
  const x0 = w * 0.34
  const y0 = h * 0.1
  const cw = (w * 0.6 - gap * (cols - 1)) / cols
  const ch = cw * 0.6
  const fills = [
    ['#ffb36b', '#ff5a3c'],
    ['#ffd98a', '#ff9a3d'],
    ['#ff7d9c', '#b5305a'],
    ['#3a1c12', '#28120b'],
  ]
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = x0 + c * (cw + gap)
      const y = y0 + r * (ch + gap + 14)
      const pair = fills[Math.floor(rand() * fills.length)]
      const g = ctx.createLinearGradient(x, y, x + cw, y + ch)
      g.addColorStop(0, pair[0])
      g.addColorStop(1, pair[1])
      ctx.fillStyle = g
      rounded(ctx, x, y, cw, ch, 10)
      ctx.fill()
      ctx.fillStyle = 'rgba(255,225,200,0.5)'
      ctx.fillRect(x + cw * 0.38, y + ch + 5, cw * 0.24, 4)
    }
  }
}

function drawDevtrack(ctx, w, h) {
  ctx.fillStyle = '#090f1f'
  ctx.fillRect(0, 0, w, h)
  ctx.globalCompositeOperation = 'lighter'
  glow(ctx, w * 0.7, h * 0.25, w * 0.55, 'rgba(110,140,255,0.4)')
  glow(ctx, w * 0.2, h * 0.9, w * 0.4, 'rgba(90,220,255,0.16)')
  ctx.globalCompositeOperation = 'source-over'

  const tables = [
    { x: w * 0.4, y: h * 0.1, rows: 4 },
    { x: w * 0.7, y: h * 0.2, rows: 5 },
    { x: w * 0.5, y: h * 0.5, rows: 3 },
  ]
  const tw = w * 0.22
  const rh = 34

  ctx.strokeStyle = 'rgba(190,205,255,0.75)'
  ctx.lineWidth = 3
  const link = (a, b) => {
    const ax = a.x + tw
    const ay = a.y + rh * 1.5
    const bx = b.x
    const by = b.y + rh * 1.5
    ctx.beginPath()
    ctx.moveTo(ax, ay)
    ctx.bezierCurveTo(ax + 60, ay, bx - 60, by, bx, by)
    ctx.stroke()
    ctx.fillStyle = '#dfe6ff'
    ctx.beginPath()
    ctx.arc(bx, by, 7, 0, Math.PI * 2)
    ctx.fill()
  }
  link(tables[0], tables[1])
  ctx.beginPath()
  ctx.moveTo(tables[2].x + tw * 0.5, tables[2].y)
  ctx.lineTo(tables[2].x + tw * 0.5, tables[0].y + rh * 5)
  ctx.stroke()

  tables.forEach((t) => {
    const th = rh * (t.rows + 1)
    ctx.fillStyle = 'rgba(18,28,58,0.95)'
    rounded(ctx, t.x, t.y, tw, th, 10)
    ctx.fill()
    ctx.strokeStyle = 'rgba(170,190,255,0.7)'
    ctx.lineWidth = 2.5
    ctx.stroke()
    ctx.fillStyle = 'rgba(150,175,255,0.9)'
    rounded(ctx, t.x, t.y, tw, rh, 10)
    ctx.fill()
    for (let i = 0; i < t.rows; i++) {
      const y = t.y + rh * (i + 1) + rh / 2
      ctx.fillStyle = 'rgba(200,212,255,0.55)'
      ctx.fillRect(t.x + 16, y - 4, tw * (0.3 + ((i * 37) % 30) / 100), 8)
      ctx.fillStyle = 'rgba(200,212,255,0.25)'
      ctx.fillRect(t.x + tw * 0.7, y - 4, tw * 0.2, 8)
    }
  })
}

const ART = { aura: drawAura, genz: drawGenz, devtrack: drawDevtrack }

export function drawPoster(ctx, project, opts = {}, w = POSTER_W, h = POSTER_H) {
  ctx.save()
  ctx.clearRect(0, 0, w, h)
  ;(ART[project.art] || drawAura)(ctx, w, h)

  // Darken the lower left so the title always reads.
  const shade = ctx.createLinearGradient(0, h, w * 0.55, h * 0.3)
  shade.addColorStop(0, 'rgba(0,0,0,0.78)')
  shade.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = shade
  ctx.fillRect(0, 0, w, h)

  if (opts.text === false) {
    ctx.restore()
    return
  }
  ctx.fillStyle = '#f4eee2'
  ctx.textBaseline = 'alphabetic'
  ctx.font = `600 ${Math.round(h * 0.13)}px ${DISPLAY}`
  ctx.fillText(project.title, w * 0.055, h * 0.84)
  ctx.font = `400 ${Math.round(h * 0.042)}px ${TEXT}`
  ctx.fillStyle = 'rgba(244,238,226,0.8)'
  ctx.fillText(project.kind, w * 0.058, h * 0.915)
  ctx.restore()
}

// Resolves once the page fonts can be used inside a canvas.
export function postersFontsReady() {
  if (typeof document === 'undefined' || !document.fonts) return Promise.resolve()
  return Promise.all([
    document.fonts.load('600 80px "Unbounded Variable"'),
    document.fonts.load('400 30px "Geist Variable"'),
  ])
    .catch(() => {})
    .then(() => {})
}
