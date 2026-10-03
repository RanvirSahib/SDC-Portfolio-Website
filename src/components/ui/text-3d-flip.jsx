import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Text3DFlip:
 * A 100% reliable 3D character flip component.
 * Uses pure CSS 3D perspective transforms on hover and tap.
 * Ensures words and spaces are completely preserved without overlap.
 */
export default function Text3DFlip({
  text = '',
  className = '',
  letterClassName = '',
  staggerDelay = 28, // ms per letter
  autoFlipInterval = 0, // optional auto-flip interval in ms
}) {
  const [flipped, setFlipped] = useState(false);
  const timerRef = useRef(null);
  const words = text.split(' ');

  // Compute total letters to calculate flip duration
  const totalLetters = text.replace(/\s+/g, '').length;
  const flipDuration = totalLetters * staggerDelay + 750;

  const triggerTapFlip = useCallback(() => {
    setFlipped(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setFlipped(false);
    }, flipDuration);
  }, [flipDuration]);

  // Optional periodic auto-flip
  useEffect(() => {
    if (autoFlipInterval > 0) {
      const interval = setInterval(() => {
        triggerTapFlip();
      }, autoFlipInterval);
      return () => clearInterval(interval);
    }
  }, [autoFlipInterval, triggerTapFlip]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  let globalCharIndex = 0;

  return (
    <span
      className={`text-3d-flip-wrap ${flipped ? 'is-flipped' : ''} ${className}`}
      onClick={triggerTapFlip}
      onTouchStart={triggerTapFlip}
      role="button"
      tabIndex={0}
      aria-label={text}
    >
      {words.map((word, wordIdx) => {
        const letters = Array.from(word);
        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap">
            {letters.map((char, charIdx) => {
              const currentDelay = globalCharIndex * staggerDelay;
              globalCharIndex++;

              return (
                <span
                  key={charIdx}
                  className={`text-3d-flip-char ${letterClassName}`}
                  style={{
                    transitionDelay: `${currentDelay}ms`,
                  }}
                >
                  {char}
                </span>
              );
            })}
            {/* Real space between words */}
            {wordIdx < words.length - 1 && (
              <span className="inline-block" style={{ width: '0.28em' }}>
                &nbsp;
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
