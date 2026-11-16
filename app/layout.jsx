import '@fontsource-variable/unbounded'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource-variable/geist'
import '@fontsource-variable/geist-mono'
import './globals.css'
import { site } from '@/data/site'


export const metadata = {
  openGraph: {
    title: 'D4RK | Developer Portfolio',
    description: 'Software Engineering student building digital experiences.',
    images: ['/og-image.png'],
    type: 'website',
  },
}

export const viewport = {
  themeColor: '#0b0b0d',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
