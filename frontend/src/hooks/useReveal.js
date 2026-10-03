import { useCallback, useEffect, useRef, useState } from "react";

export function useReveal({ staggerChildren = false, staggerMs = 70 } = {}) {
  const ref = useRef(null);
  const setRef = useCallback((element) => {
    ref.current = element;
  }, []);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const reveal = () => {
      if (staggerChildren) {
        element.querySelectorAll(":scope > .reveal-item").forEach((child, index) => {
          child.style.setProperty("--reveal-delay", `${index * staggerMs}ms`);
        });
      }
      element.classList.add("is-revealed");
      setIsRevealed(true);
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) {
      reveal();
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        reveal();
        observer.unobserve(element);
      },
      { threshold: 0.12 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [staggerChildren, staggerMs]);

  return { setNode: setRef, isRevealed };
}
