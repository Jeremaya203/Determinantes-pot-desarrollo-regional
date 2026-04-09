import { useEffect, useRef } from 'react';

export function useScrollAnimation() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('aos-visible');
          el.classList.remove('aos-hidden');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    el.classList.add('aos-hidden');
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return ref;
}
