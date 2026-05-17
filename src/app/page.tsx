import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/sections/Hero'
import FeaturedDesserts from '@/sections/FeaturedDesserts'
import ImmersiveExperience from '@/sections/ImmersiveExperience'
import AboutChef from '@/sections/AboutChef'
import Gallery from '@/sections/Gallery'
import Testimonials from '@/sections/Testimonials'
import Contact from '@/sections/Contact'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeaturedDesserts />
      <ImmersiveExperience />
      <AboutChef />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}
