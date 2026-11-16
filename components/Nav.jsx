'use client'

import { scrollToTarget } from '@/lib/ready'

const links = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  // { href: '#certificates', label: 'Certificates' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav() {
  const jump = (e, href) => {
    e.preventDefault()
    // The footer is fixed underneath, so "Contact" means the very bottom.
    if (href === '#contact') scrollToTarget(document.documentElement.scrollHeight)
    else scrollToTarget(href)
  }

  return (
    <header className="nav">
      <a className="nav-mark" href="#top" onClick={(e) => jump(e, 0)} aria-label="Back to the top">
        D<b>4</b>RK
      </a>
      <nav aria-label="Sections">
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={(e) => jump(e, l.href)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
