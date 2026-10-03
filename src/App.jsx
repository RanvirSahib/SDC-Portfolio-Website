import { useState, useCallback } from 'react';
import Loader           from './components/Loader';
import ScrollProgress   from './components/ScrollProgress';
import Navbar           from './components/Navbar';
import Hero             from './components/Hero';
import MarqueeBanner    from './components/MarqueeBanner';
import Services         from './components/Services';
import SignatureDeck    from './components/SignatureDeck';
import About            from './components/About';
import PlanEvent        from './components/PlanEvent';
import Contact          from './components/Contact';
import Footer           from './components/Footer';
import MobileActionDock from './components/MobileActionDock';

export default function App() {
  // `ready` triggers hero entrance animations once loader exits
  const [ready, setReady] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);

  const handleLoaderDone = useCallback(() => {
    setLoaderDone(true);
    // Tiny delay so DOM is stable before animating
    setTimeout(() => setReady(true), 50);
  }, []);

  return (
    <>
      {/* Loader — fullscreen, exits after ~1.8s */}
      {!loaderDone && <Loader onDone={handleLoaderDone} />}

      {/* Scroll progress bar — thin coral line at very top */}
      <ScrollProgress />

      {/* Sticky glass navbar */}
      <Navbar />

      {/* Page content */}
      <main>
        <Hero ready={ready} />
        <MarqueeBanner />
        <Services />
        <SignatureDeck />
        <About />
        <PlanEvent />
        <Contact />
        <Footer />
      </main>

      {/* Mobile fixed bottom dock — hidden on md+ */}
      <MobileActionDock />
    </>
  );
}
