import { useScrollAnimation } from '../hooks/useScrollAnimation';

function AnimatedBlock({ children, delay = 0 }) {
  const ref = useScrollAnimation();
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const instrumentos = [
  { sigla: 'POT', nombre: 'Plan de Ordenamiento Territorial', umbral: 'Más de 100.000 habitantes', color: '#c9a96e' },
  { sigla: 'PBOT', nombre: 'Plan Básico de Ordenamiento Territorial', umbral: 'Entre 30.000 y 100.000 habitantes', color: '#5ea45e' },
  { sigla: 'EOT', nombre: 'Esquema de Ordenamiento Territorial', umbral: 'Menos de 30.000 habitantes', color: '#9b8dc4' },
];

const consecuencias = [
  {
    tipo: 'Nulidad',
    icono: '⚠️',
    texto: 'El acto administrativo (Acuerdo Municipal) puede ser demandado ante la jurisdicción contencioso-administrativa.',
  },
  {
    tipo: 'Inoponibilidad',
    icono: '🚫',
    texto: 'Las normas locales que violen determinantes ambientales o de riesgo carecen de validez técnica y legal frente a las autoridades nacionales.',
  },
  {
    tipo: 'Facultad del Alcalde',
    icono: '🏛️',
    texto: 'Si el Concejo no aprueba el POT en 60 días tras la concertación, el Alcalde puede adoptarlo por decreto, asegurando la inclusión de las determinantes concertadas.',
  },
];

export default function PracticaSection() {
  return (
    <section id="practica" className="section-container">
      <AnimatedBlock>
        <p className="section-label">03 — Cómo Funcionan en la Práctica</p>
      </AnimatedBlock>
      <AnimatedBlock delay={100}>
        <h2 className="section-title">Incorporación y Control</h2>
      </AnimatedBlock>
      <AnimatedBlock delay={150}>
        <div className="divider" />
      </AnimatedBlock>

      {/* Instrumentos */}
      <AnimatedBlock delay={200}>
        <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: '"Playfair Display", serif', color: '#e8e0d0' }}>
          Instrumentos según población
        </h3>
        <div className="grid md:grid-cols-3 gap-4 mb-14">
          {instrumentos.map((inst, i) => (
            <div
              key={inst.sigla}
              className="rounded-2xl p-6 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.07)` }}
            >
              <div
                className="text-4xl font-bold font-mono mb-2"
                style={{ color: inst.color, fontFamily: '"JetBrains Mono", monospace' }}
              >
                {inst.sigla}
              </div>
              <p className="text-sm font-semibold mb-2" style={{ color: '#e8e0d0' }}>{inst.nombre}</p>
              <span
                className="inline-block text-xs font-mono px-3 py-1 rounded-full"
                style={{ background: `${inst.color}20`, color: inst.color, border: `1px solid ${inst.color}40` }}
              >
                {inst.umbral}
              </span>
            </div>
          ))}
        </div>
      </AnimatedBlock>

      {/* CAR role */}
      <AnimatedBlock delay={280}>
        <div className="card mb-14">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🌿</div>
            <div>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: '"Playfair Display", serif', color: '#e8e0d0' }}>
                El Papel de las Autoridades Ambientales (CAR)
              </h3>
              <p className="leading-relaxed mb-3" style={{ color: '#9a9080' }}>
                Las CAR actúan como entes de control técnico. Antes de que el POT llegue al Concejo Municipal,
                debe surtir un <strong style={{ color: '#c8bfaf' }}>proceso de concertación ambiental obligatoria</strong>.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div
                  className="rounded-full px-4 py-2 font-mono text-sm font-bold"
                  style={{ background: 'rgba(201,169,110,0.15)', color: '#c9a96e', border: '1px solid rgba(201,169,110,0.3)' }}
                >
                  30 días
                </div>
                <p className="text-sm" style={{ color: '#9a9080' }}>
                  tiene la CAR para revisar que el proyecto de plan respete las determinantes.
                  Si hay desacuerdo, el asunto puede elevarse al Ministerio de Ambiente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedBlock>

      {/* Consecuencias */}
      <AnimatedBlock delay={350}>
        <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: '"Playfair Display", serif', color: '#e8e0d0' }}>
          Consecuencias de la Contradicción
        </h3>
        <p className="mb-6" style={{ color: '#9a9080' }}>
          Si un municipio aprueba un POT que contradice una determinante de superior jerarquía:
        </p>
        <div className="space-y-4">
          {consecuencias.map((c, i) => (
            <AnimatedBlock key={c.tipo} delay={400 + i * 70}>
              <div className="card flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">{c.icono}</span>
                <div>
                  <h4 className="font-bold mb-1" style={{ color: '#e8e0d0' }}>{c.tipo}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#9a9080' }}>{c.texto}</p>
                </div>
              </div>
            </AnimatedBlock>
          ))}
        </div>
      </AnimatedBlock>
    </section>
  );
}
