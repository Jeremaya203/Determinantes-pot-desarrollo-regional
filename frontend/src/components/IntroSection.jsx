import { useScrollAnimation } from '../hooks/useScrollAnimation';

function AnimatedBlock({ children, delay = 0 }) {
  const ref = useScrollAnimation();
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function IntroSection() {
  const razones = [
    {
      icon: '⚖️',
      titulo: 'Interés General',
      texto: 'Protegen bienes públicos como el equilibrio ecológico y el patrimonio nacional, valores que trascienden la escala municipal.',
    },
    {
      icon: '🏛️',
      titulo: 'Unidad del Estado',
      texto: 'Aseguran que el modelo de desarrollo territorial sea armónico entre los niveles nacional, regional y local.',
    },
    {
      icon: '📜',
      titulo: 'Seguridad Jurídica',
      texto: 'Establecen un piso mínimo de protección que no puede ser desconocido por los Concejos Municipales.',
    },
  ];

  return (
    <section id="intro" className="section-container">
      {/* Label */}
      <AnimatedBlock>
        <p className="section-label">01 — Introducción y Marco Normativo</p>
      </AnimatedBlock>

      {/* Title */}
      <AnimatedBlock delay={100}>
        <h2 className="section-title">¿Qué son las determinantes?</h2>
      </AnimatedBlock>

      {/* Divider */}
      <AnimatedBlock delay={150}>
        <div className="divider" />
      </AnimatedBlock>

      {/* Definition block */}
      <AnimatedBlock delay={200}>
        <blockquote
          className="relative pl-6 mb-10 text-lg leading-relaxed"
          style={{ color: '#c9a9a9', borderLeft: '3px solid rgba(201,169,110,0.5)' }}
        >
          <p style={{ color: '#c8bfaf' }}>
            En el marco del derecho urbanístico colombiano, las{' '}
            <strong style={{ color: '#c9a96e' }}>determinantes de superior jerarquía</strong>{' '}
            se definen como un conjunto de directrices, normas y regulaciones de carácter
            nacional y regional que condicionan, limitan y orientan la potestad de los
            municipios para ordenar su territorio.
          </p>
        </blockquote>
      </AnimatedBlock>

      {/* Normative origin */}
      <AnimatedBlock delay={250}>
        <div className="card mb-10">
          <h3
            className="text-xl font-bold mb-4"
            style={{ fontFamily: '"Playfair Display", serif', color: '#e8e0d0' }}
          >
            Origen Normativo
          </h3>
          <p className="leading-relaxed mb-3" style={{ color: '#9a9080' }}>
            El fundamento principal se encuentra en la{' '}
            <span
              className="font-mono text-sm px-2 py-0.5 rounded"
              style={{ background: 'rgba(201,169,110,0.15)', color: '#c9a96e' }}
            >
              Ley 388 de 1997 — Art. 10
            </span>
            , la cual establece que los Planes de Ordenamiento Territorial (POT) deben
            sujetarse a normas de mayor jerarquía.
          </p>
          <p className="leading-relaxed" style={{ color: '#9a9080' }}>
            Este marco ha sido actualizado por el{' '}
            <span
              className="font-mono text-sm px-2 py-0.5 rounded"
              style={{ background: 'rgba(94,164,94,0.15)', color: '#5ea45e' }}
            >
              Art. 32 — Ley 2294 de 2023 (PND)
            </span>
            , que reafirma la prevalencia de ciertos criterios sobre la autonomía local.
          </p>
        </div>
      </AnimatedBlock>

      {/* Why superior hierarchy */}
      <AnimatedBlock delay={300}>
        <h3
          className="text-2xl font-bold mb-6"
          style={{ fontFamily: '"Playfair Display", serif', color: '#e8e0d0' }}
        >
          ¿Por qué se consideran de "superior jerarquía"?
        </h3>
      </AnimatedBlock>

      <div className="grid md:grid-cols-3 gap-5">
        {razones.map((r, i) => (
          <AnimatedBlock key={r.titulo} delay={350 + i * 80}>
            <div className="card h-full">
              <div className="text-3xl mb-4">{r.icon}</div>
              <h4
                className="font-bold text-lg mb-2"
                style={{ fontFamily: '"Playfair Display", serif', color: '#e8e0d0' }}
              >
                {r.titulo}
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: '#9a9080' }}>
                {r.texto}
              </p>
            </div>
          </AnimatedBlock>
        ))}
      </div>
    </section>
  );
}
