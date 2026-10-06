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
import CateringMenuModal from './components/CateringMenuModal';

export default function App() {
  // `ready` triggers hero entrance animations once loader exits
  const [ready, setReady] = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const [isCateringMenuOpen, setIsCateringMenuOpen] = useState(false);

  const handleLoaderDone = useCallback(() => {
    setLoaderDone(true);
    // Tiny delay so DOM is stable before animating
    setTimeout(() => setReady(true), 50);
  }, []);

  const openCateringMenu = useCallback(() => {
    setIsCateringMenuOpen(true);
  }, []);

  const closeCateringMenu = useCallback(() => {
    setIsCateringMenuOpen(false);
  }, []);

  const handlePlanEventFromMenu = useCallback(() => {
    setIsCateringMenuOpen(false);
    const planEl = document.getElementById('plan');
    if (planEl) {
      planEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <>
      {/* Loader — fullscreen, exits after ~1.8s */}
      {!loaderDone && <Loader onDone={handleLoaderDone} />}

      {/* Scroll progress bar — thin coral line at very top */}
      <ScrollProgress />

      {/* Sticky glass navbar */}
      <Navbar onOpenCateringMenu={openCateringMenu} />

      {/* Page content */}
      <main>
        <Hero ready={ready} />
        <MarqueeBanner />
        <Services onOpenCateringMenu={openCateringMenu} />
        <SignatureDeck onOpenCateringMenu={openCateringMenu} />
        <About />
        <PlanEvent onOpenCateringMenu={openCateringMenu} />
        <Contact />
        <Footer />
      </main>

      {/* Mobile fixed bottom dock — hidden on md+ */}
      <MobileActionDock />

      {/* 300+ Authentic Dishes Royal Catering Menu Modal */}
      <CateringMenuModal
        isOpen={isCateringMenuOpen}
        onClose={closeCateringMenu}
        onOpenPlanEvent={handlePlanEventFromMenu}
      />
    </>
  );
}
