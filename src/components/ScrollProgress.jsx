import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let rafId;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setWidth(Math.min(progress, 100));

    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    // Universal reveal observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const observeAll = () => {
      document.querySelectorAll('.rv, .rv-left, .rv-right, .rv-scale').forEach((el) => {
        observer.observe(el);
      });
    };

    observeAll();

    // Re-check for any lazy-loaded or deferred DOM elements
    const timer1 = setTimeout(observeAll, 300);
    const timer2 = setTimeout(observeAll, 1200);

    // MutationObserver to catch any newly inserted reveal elements
    const mutObserver = new MutationObserver(() => {
      observeAll();
    });
    mutObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
      clearTimeout(timer1);
      clearTimeout(timer2);
      observer.disconnect();
      mutObserver.disconnect();
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[100] h-[3px] pointer-events-none transition-all duration-75"
      style={{
        width: `${width}%`,
        background: 'linear-gradient(90deg, #e0575c, #fb6b6e, #fdbb74)',
        boxShadow: '0 0 10px rgba(224, 87, 92, 0.7), 0 0 20px rgba(251, 107, 110, 0.5)',
      }}
      role="progressbar"
      aria-valuenow={Math.round(width)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    />
  );
}
