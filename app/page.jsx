import Loader from '@/components/Loader'
import SmoothScroll from '@/components/SmoothScroll'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Seam from '@/components/Seam'
import Work from '@/components/Work'
import Certificates from '@/components/Certificates'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Loader />
      <SmoothScroll />
      <Nav />
      <main>
        {/* The hero stays put while the About panel rises over it. */}
        <div className="stage">
          <Hero />
          <About />
        </div>
        <Seam />
        <Work />
        {/*<Certificates />*/}
      </main>
      <Footer />
    </>
  )
}
