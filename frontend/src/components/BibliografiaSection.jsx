import { useScrollAnimation } from '../hooks/useScrollAnimation';

function AnimatedBlock({ children, delay = 0 }) {
  const ref = useScrollAnimation();
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const referencias = [
  {
    id: 1,
    apa: [
      { texto: 'Asamblea Nacional Constituyente. (1991). ' },
      { texto: 'Constitución Política de Colombia', italica: true },
      { texto: '. Bogotá, Colombia.' },
    ],
  },
  {
    id: 2,
    apa: [
      { texto: 'Congreso de Colombia. (1997, 18 de julio). ' },
      { texto: 'Ley 388 de 1997. Por la cual se modifica la Ley 9 de 1989, y la Ley 2 de 1991 y se dictan otras disposiciones', italica: true },
      { texto: '. Diario Oficial No. 43.091.' },
    ],
  },
  {
    id: 3,
    apa: [
      { texto: 'Departamento Nacional de Planeación. (2023). ' },
      { texto: 'Plan Nacional de Desarrollo 2022-2026: Colombia, Potencia Mundial de la Vida', italica: true },
      { texto: '. Bogotá, Colombia: Imprenta Nacional de Colombia. ISBN: 978-958-5422-45-2.' },
    ],
  },
  {
    id: 4,
    apa: [
      { texto: 'Massiris Cabeza, Á. (s.f.). ' },
      { texto: 'Determinantes de los planes de ordenamiento territorial', italica: true },
      { texto: '. Tunja, Colombia: Universidad Pedagógica y Tecnológica de Colombia.' },
    ],
  },
  {
    id: 5,
    apa: [
      { texto: 'Ministerio de Ambiente y Desarrollo Sostenible. (2020). ' },
      { texto: 'Orientaciones para la definición y actualización de las determinantes ambientales por parte de las autoridades ambientales y su incorporación en los planes de ordenamiento territorial', italica: true },
      { texto: ' (2.ª ed.). Bogotá, D.C., Colombia.' },
    ],
  },
  {
    id: 6,
    apa: [
      { texto: 'Vásquez Santamaría, J. E. (2015). El paisaje como determinante de superior jerarquía para los planes de ordenamiento territorial. ' },
      { texto: 'Estudios de Derecho', italica: true },
      { texto: ', ' },
      { texto: '72', italica: true },
      { texto: '(160), 243-272. DOI: ' },
      {
        enlace: true,
        href: 'https://doi.org/10.17533/udea.esde.v72n160a10',
        texto: '10.17533/udea.esde.v72n160a10',
      },
    ],
  },
];

export default function BibliografiaSection() {
  return (
    <section
      id="bibliografia"
      className="py-20"
      style={{ background: 'linear-gradient(to bottom, #0a0f0a, #080d09)' }}
    >
      <div className="max-w-3xl mx-auto px-6">
        <AnimatedBlock>
          <p className="section-label">08 — Referencias</p>
        </AnimatedBlock>
        <AnimatedBlock delay={100}>
          <h2 className="section-title">Bibliografía</h2>
        </AnimatedBlock>
        <AnimatedBlock delay={150}>
          <div className="divider" />
          <p className="text-lg leading-relaxed mb-10" style={{ color: '#9a9080' }}>
            Fuentes normativas y académicas que fundamentan el contenido de esta presentación.
          </p>
        </AnimatedBlock>

        <div className="space-y-3">
          {referencias.map((ref, i) => (
            <AnimatedBlock key={ref.id} delay={i * 60}>
              <div
                className="rounded-xl p-5 flex gap-4"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <span
                  className="flex-shrink-0 font-mono text-xs font-bold mt-0.5"
                  style={{ color: 'rgba(201,169,110,0.5)', minWidth: '1.5rem' }}
                >
                  {String(ref.id).padStart(2, '0')}
                </span>
                <p className="text-sm leading-relaxed" style={{ color: '#c8bfaf' }}>
                  {ref.apa.map((segmento, j) => {
                    if (segmento.enlace) {
                      return (
                        <a
                          key={j}
                          href={segmento.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#c9a96e', textDecoration: 'underline' }}
                          onMouseEnter={e => (e.currentTarget.style.color = '#e8c98e')}
                          onMouseLeave={e => (e.currentTarget.style.color = '#c9a96e')}
                        >
                          {segmento.texto}
                        </a>
                      );
                    }
                    if (segmento.italica) {
                      return <em key={j}>{segmento.texto}</em>;
                    }
                    return <span key={j}>{segmento.texto}</span>;
                  })}
                </p>
              </div>
            </AnimatedBlock>
          ))}
        </div>
      </div>
    </section>
  );
}
