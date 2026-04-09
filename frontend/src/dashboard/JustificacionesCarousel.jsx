import { useState, useEffect, useRef } from 'react';

export default function JustificacionesCarousel({ textos }) {
  const [idx, setIdx] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!textos || textos.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setIdx(prev => (prev + 1) % textos.length);
    }, 6000);
    return () => clearInterval(intervalRef.current);
  }, [textos]);

  if (!textos || textos.length === 0) {
    return (
      <p className="font-mono text-xs italic" style={{ color: '#9a9080' }}>
        Sin argumentos aún.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className="rounded-xl p-4"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', minHeight: '72px' }}
      >
        <p className="text-sm leading-relaxed" style={{ color: '#c8bfaf' }}>
          "{textos[idx]}"
        </p>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs" style={{ color: '#9a9080' }}>
          {idx + 1} / {textos.length}
        </span>
        <div className="flex gap-1">
          {textos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="w-2 h-2 rounded-full transition-all duration-200"
              style={{
                background: i === idx ? '#c9a96e' : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
