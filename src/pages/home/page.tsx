import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Stats from './components/Stats';
import Screenshots from './components/Screenshots';
import Testimonials from './components/Testimonials';

import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Stats />
        <Screenshots />
        <Testimonials />

        <FAQ />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
