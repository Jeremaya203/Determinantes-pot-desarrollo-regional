export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 30% 50%, #1a2e1a 0%, #0a0f0a 60%)' }}
    >
      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(201,169,110,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.4) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-5"
        style={{ background: 'radial-gradient(circle, #c9a96e, transparent)' }} />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full opacity-5"
        style={{ background: 'radial-gradient(circle, #5ea45e, transparent)' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <p
          className="font-mono text-xs tracking-[0.3em] uppercase mb-8 opacity-70"
          style={{ color: '#c9a96e' }}
        >
          Derecho Urbanístico Colombiano · Ley 388 de 1997
        </p>

        {/* Main title */}
        <h1
          className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6"
          style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#e8e0d0' }}
        >
          Determinantes
          <br />
          <em className="italic" style={{ color: '#c9a96e' }}>de Superior</em>
          <br />
          Jerarquía
        </h1>

        <div className="w-16 h-px mx-auto my-8" style={{ background: 'linear-gradient(to right, #c9a96e, transparent)' }} />

        <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-4" style={{ color: '#9a9080' }}>
          Las normas nacionales y regionales que condicionan, limitan y orientan
          la potestad de los municipios para ordenar su territorio.
        </p>

        <p className="text-sm font-mono" style={{ color: '#c9a96e', opacity: 0.6 }}>
          Fabián López
        </p>

        {/* CTA */}
        <div className="mt-14 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#intro"
            className="px-8 py-3 rounded-full text-sm font-mono tracking-wider uppercase transition-all duration-300"
            style={{
              background: 'rgba(201,169,110,0.15)',
              border: '1px solid rgba(201,169,110,0.4)',
              color: '#c9a96e',
            }}
            onMouseEnter={e => { e.target.style.background = 'rgba(201,169,110,0.25)'; }}
            onMouseLeave={e => { e.target.style.background = 'rgba(201,169,110,0.15)'; }}
          >
            Explorar contenido
          </a>
          <a
            href="#actividad"
            className="px-8 py-3 rounded-full text-sm font-mono tracking-wider uppercase transition-all duration-300"
            style={{
              background: 'rgba(94,164,94,0.15)',
              border: '1px solid rgba(94,164,94,0.4)',
              color: '#5ea45e',
            }}
            onMouseEnter={e => { e.target.style.background = 'rgba(94,164,94,0.25)'; }}
            onMouseLeave={e => { e.target.style.background = 'rgba(94,164,94,0.15)'; }}
          >
            Ir a la actividad
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: '#9a9080' }}>Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-earth-500 to-transparent" />
      </div>
    </section>
  );
}
