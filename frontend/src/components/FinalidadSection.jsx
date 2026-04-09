import { useScrollAnimation } from '../hooks/useScrollAnimation';

function AnimatedBlock({ children, delay = 0 }) {
  const ref = useScrollAnimation();
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const finalidades = [
  {
    icon: '🌱',
    titulo: 'Sostenibilidad Ambiental',
    objetivo: 'Garantizar el desarrollo sostenible, la conservación y restauración de recursos naturales renovables.',
    color: '#5ea45e',
  },
  {
    icon: '🛡️',
    titulo: 'Gestión del Riesgo',
    objetivo: 'Proteger la vida humana mediante la reubicación de asentamientos en zonas críticas y la prevención de desastres naturales.',
    color: '#e07070',
  },
  {
    icon: '🌾',
    titulo: 'Seguridad Alimentaria',
    objetivo: 'Evitar la urbanización de los suelos más productivos del país y fomentar la economía campesina.',
    color: '#c9a96e',
  },
  {
    icon: '🏛️',
    titulo: 'Preservación Cultural',
    objetivo: 'Defender la identidad nacional mediante la protección de centros históricos y rasgos arqueológicos.',
    color: '#9b8dc4',
  },
  {
    icon: '🗺️',
    titulo: 'Articulación Estatal',
    objetivo: 'Crear un modelo de ocupación del suelo que responda a realidades regionales: cuencas, movilidad, energía.',
    color: '#6ab4c4',
  },
];

export default function FinalidadSection() {
  return (
    <section
      id="finalidad"
      className="py-20"
      style={{ background: 'linear-gradient(to bottom, #0a0f0a, #0e1510, #0a0f0a)' }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedBlock>
          <p className="section-label">04 — Finalidad y Objetivos</p>
        </AnimatedBlock>
        <AnimatedBlock delay={100}>
          <h2 className="section-title">Objetivos Estratégicos</h2>
        </AnimatedBlock>
        <AnimatedBlock delay={150}>
          <div className="divider" />
          <p className="text-lg leading-relaxed mb-12" style={{ color: '#9a9080' }}>
            El sistema de determinantes persigue objetivos estratégicos para el Estado Social de Derecho.
          </p>
        </AnimatedBlock>

        {/* Grid de finalidades */}
        <div className="grid md:grid-cols-2 gap-5">
          {finalidades.map((f, i) => (
            <AnimatedBlock key={f.titulo} delay={200 + i * 80}>
              <div
                className="rounded-2xl p-6 h-full transition-all duration-300 group cursor-default"
                style={{
                  background: `${f.color}08`,
                  border: `1px solid ${f.color}25`,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = `${f.color}55`; e.currentTarget.style.background = `${f.color}12`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${f.color}25`; e.currentTarget.style.background = `${f.color}08`; }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{f.icon}</span>
                  <h3
                    className="font-bold text-lg"
                    style={{ fontFamily: '"Playfair Display", serif', color: f.color }}
                  >
                    {f.titulo}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#9a9080' }}>
                  {f.objetivo}
                </p>
              </div>
            </AnimatedBlock>
          ))}

          {/* Último item centrado si hay número impar */}
          {finalidades.length % 2 !== 0 && <div className="hidden md:block" />}
        </div>
      </div>
    </section>
  );
}
