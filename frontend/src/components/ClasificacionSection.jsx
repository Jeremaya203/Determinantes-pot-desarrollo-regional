import { useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

function AnimatedBlock({ children, delay = 0 }) {
  const ref = useScrollAnimation();
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const niveles = [
  {
    numero: '01',
    titulo: 'Determinantes Ambientales y de Gestión del Riesgo',
    subtitulo: 'Mayor peso — primeras a incorporar',
    color: '#5ea45e',
    colorBg: 'rgba(94,164,94,0.08)',
    colorBorder: 'rgba(94,164,94,0.3)',
    entidades: ['Ministerio de Ambiente (MADS)', 'Corporaciones Autónomas Regionales (CAR)', 'Parques Nacionales Naturales (PNN)'],
    restricciones: [
      'Zonificación de áreas protegidas (Parques Nacionales, Reservas Forestales)',
      'Ordenación de cuencas hidrográficas (POMCA)',
      'Prohibición de asentamientos en zonas de riesgo no mitigable',
      'Protección del paisaje como recurso natural renovable',
    ],
  },
  {
    numero: '02',
    titulo: 'Áreas de Protección para la Producción de Alimentos y Desarrollo Rural',
    subtitulo: 'Seguridad alimentaria y comunidades agrarias',
    color: '#c9a96e',
    colorBg: 'rgba(201,169,110,0.08)',
    colorBorder: 'rgba(201,169,110,0.3)',
    entidades: ['Ministerio de Agricultura', 'Agencia Nacional de Tierras (ANT)', 'INCORA (en liquidación/transición)'],
    restricciones: [
      'Uso preferencial del suelo para actividades silvoagropecuarias',
      'Limitaciones a la expansión urbana sobre suelos agrológicos I, II y III',
      'Reconocimiento de propiedad colectiva en resguardos indígenas y tierras de comunidades negras (Ley 70/1993)',
    ],
  },
  {
    numero: '03',
    titulo: 'Infraestructura, Patrimonio y Determinantes Sectoriales',
    subtitulo: 'Conectividad del país y memoria histórica',
    color: '#9b8dc4',
    colorBg: 'rgba(155,141,196,0.08)',
    colorBorder: 'rgba(155,141,196,0.3)',
    entidades: ['Ministerio de Transporte', 'Ministerio de Cultura', 'ANI', 'Áreas metropolitanas'],
    restricciones: [
      'Zonas de influencia de aeropuertos, puertos y redes viales nacionales/regionales',
      'Protección de Bienes de Interés Cultural (BIC) y sus áreas de influencia',
      'Respeto a directrices de los Planes Integrales de Desarrollo Metropolitano',
    ],
  },
];

export default function ClasificacionSection() {
  const [activeNivel, setActiveNivel] = useState(0);

  return (
    <section
      id="clasificacion"
      className="py-20"
      style={{ background: 'linear-gradient(to bottom, #0a0f0a, #0e1510, #0a0f0a)' }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedBlock>
          <p className="section-label">02 — Clasificación y Tipos</p>
        </AnimatedBlock>
        <AnimatedBlock delay={100}>
          <h2 className="section-title">Niveles de Prevalencia</h2>
        </AnimatedBlock>
        <AnimatedBlock delay={150}>
          <div className="divider" />
          <p className="text-lg leading-relaxed mb-12" style={{ color: '#9a9080' }}>
            El ordenamiento territorial colombiano organiza las determinantes
            según su naturaleza y el impacto que tienen sobre el uso del suelo.
          </p>
        </AnimatedBlock>

        {/* Tab selectors */}
        <AnimatedBlock delay={200}>
          <div className="flex gap-3 mb-8 flex-wrap">
            {niveles.map((n, i) => (
              <button
                key={n.numero}
                onClick={() => setActiveNivel(i)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono tracking-wider uppercase transition-all duration-300"
                style={{
                  background: activeNivel === i ? n.colorBg : 'transparent',
                  border: `1px solid ${activeNivel === i ? n.color : 'rgba(160,140,100,0.2)'}`,
                  color: activeNivel === i ? n.color : '#9a9080',
                }}
              >
                <span>{n.numero}</span>
              </button>
            ))}
          </div>
        </AnimatedBlock>

        {/* Active nivel content */}
        <AnimatedBlock delay={250}>
          {niveles.map((nivel, i) => (
            <div
              key={nivel.numero}
              className={`transition-all duration-500 ${i === activeNivel ? 'block' : 'hidden'}`}
            >
              <div
                className="rounded-2xl p-8"
                style={{ background: nivel.colorBg, border: `1px solid ${nivel.colorBorder}` }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <span
                    className="font-mono text-5xl font-bold opacity-20 leading-none"
                    style={{ color: nivel.color }}
                  >
                    {nivel.numero}
                  </span>
                  <div>
                    <h3
                      className="text-2xl font-bold mb-1"
                      style={{ fontFamily: '"Playfair Display", serif', color: '#e8e0d0' }}
                    >
                      {nivel.titulo}
                    </h3>
                    <p className="font-mono text-xs tracking-wider uppercase" style={{ color: nivel.color, opacity: 0.8 }}>
                      {nivel.subtitulo}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Entidades */}
                  <div>
                    <h4 className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: nivel.color, opacity: 0.7 }}>
                      Entidades responsables
                    </h4>
                    <ul className="space-y-2">
                      {nivel.entidades.map((e) => (
                        <li key={e} className="flex items-start gap-2 text-sm" style={{ color: '#c8bfaf' }}>
                          <span style={{ color: nivel.color, marginTop: '3px' }}>▸</span>
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Restricciones */}
                  <div>
                    <h4 className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: nivel.color, opacity: 0.7 }}>
                      Restricciones principales
                    </h4>
                    <ul className="space-y-2">
                      {nivel.restricciones.map((r) => (
                        <li key={r} className="flex items-start gap-2 text-sm" style={{ color: '#c8bfaf' }}>
                          <span style={{ color: nivel.color, marginTop: '3px', flexShrink: 0 }}>▸</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </AnimatedBlock>
      </div>
    </section>
  );
}
