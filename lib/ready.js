// The loader calls markReady() when it hands the screen over.
// Anything that should wait for that moment calls onReady().

export function markReady() {
  if (typeof window === 'undefined' || window.__siteReady) return
  window.__siteReady = true
  window.dispatchEvent(new Event('site:ready'))
}

export function onReady(fn) {
  if (typeof window === 'undefined') return () => {}
  if (window.__siteReady) {
    fn()
    return () => {}
  }
  window.addEventListener('site:ready', fn, { once: true })
  return () => window.removeEventListener('site:ready', fn)
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Smooth-scrolls when Lenis is running, jumps otherwise.
export function scrollToTarget(target, opts = {}) {
  const lenis = typeof window !== 'undefined' ? window.__lenis : null
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4, ...opts })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : null
  if (el) el.scrollIntoView()
  else window.scrollTo(0, typeof target === 'number' ? target : 0)
}
