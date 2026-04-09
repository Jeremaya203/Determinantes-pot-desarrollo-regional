import { useScrollAnimation } from '../hooks/useScrollAnimation';

function AnimatedBlock({ children, delay = 0 }) {
  const ref = useScrollAnimation();
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const principios = [
  {
    titulo: 'Autonomía Territorial',
    referencia: 'Art. 287 CP',
    descripcion: 'Los municipios tienen la función de reglamentar los usos del suelo (Art. 313 CP), pero esta no es una facultad absoluta.',
    color: '#c9a96e',
    lado: 'local',
  },
  {
    titulo: 'Unidad Nacional',
    referencia: 'C-138 de 2020',
    descripcion: 'La Corte Constitucional señala que la autonomía municipal debe ejercerse dentro de los límites de la ley y en armonía con las políticas nacionales.',
    color: '#5ea45e',
    lado: 'nacional',
  },
];

const reglas = [
  {
    titulo: 'Rigor Subsidiario',
    texto: 'Las normas ambientales locales pueden ser más rigurosas que las nacionales, pero nunca más flexibles.',
  },
  {
    titulo: 'Gradación Normativa',
    texto: 'Las entidades territoriales deben sujetarse a las normas de entes de jerarquía superior: Nación › Región › Departamento › Municipio.',
  },
  {
    titulo: 'Interés General',
    texto: 'Cuando hay conflicto entre un proyecto de desarrollo local y la preservación de un ecosistema estratégico, prevalece el interés general de la protección ambiental.',
  },
];

const glosario = [
  { termino: 'Determinante', definicion: 'Norma de obligatoria inclusión en el POT que limita la autonomía municipal.' },
  { termino: 'Concertación Ambiental', definicion: 'Instancia administrativa de validación del POT por parte de la CAR.' },
  { termino: 'Suelo de Protección', definicion: 'Zonas con restricciones de urbanización por valores ambientales, paisajísticos o de riesgo.' },
  { termino: 'Plusvalía', definicion: 'Incremento en el valor del suelo generado por acciones urbanísticas (como el cambio de rural a urbano), del cual el municipio tiene derecho a participar.' },
];

const retos = [
  {
    n: '01',
    titulo: 'Actualización de Información',
    texto: 'Muchos municipios carecen de cartografía detallada de riesgos o inventarios de patrimonio, dificultando la incorporación de determinantes.',
  },
  {
    n: '02',
    titulo: 'Coordinación Interinstitucional',
    texto: 'Persiste la dificultad para que las CAR, el Gobierno Nacional y los municipios hablen un mismo lenguaje técnico.',
  },
  {
    n: '03',
    titulo: 'Conflictos de Uso',
    texto: 'La presión por proyectos minero-energéticos o agroindustriales a menudo choca con las determinantes de conservación, requiriendo procesos de concertación cada vez más complejos.',
  },
];

export default function TensionSection() {
  return (
    <>
      {/* Sección 5 - Tensión */}
      <section id="tension" className="section-container">
        <AnimatedBlock>
          <p className="section-label">05 — Tensión con la Autonomía Municipal</p>
        </AnimatedBlock>
        <AnimatedBlock delay={100}>
          <h2 className="section-title">Autonomía vs. Unidad Nacional</h2>
        </AnimatedBlock>
        <AnimatedBlock delay={150}>
          <div className="divider" />
          <p className="text-lg leading-relaxed mb-10" style={{ color: '#9a9080' }}>
            El ordenamiento territorial en Colombia vive una tensión constante entre dos principios constitucionales.
          </p>
        </AnimatedBlock>

        {/* Tensión visual */}
        <AnimatedBlock delay={200}>
          <div className="grid md:grid-cols-2 gap-4 mb-14">
            {principios.map((p) => (
              <div
                key={p.titulo}
                className="rounded-2xl p-6"
                style={{ background: `${p.color}08`, border: `1px solid ${p.color}30` }}
              >
                <span
                  className="font-mono text-xs px-2 py-1 rounded-full tracking-wider uppercase mb-3 inline-block"
                  style={{ background: `${p.color}20`, color: p.color }}
                >
                  {p.referencia}
                </span>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ fontFamily: '"Playfair Display", serif', color: p.color }}
                >
                  {p.titulo}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#9a9080' }}>{p.descripcion}</p>
              </div>
            ))}
          </div>
        </AnimatedBlock>

        {/* Reglas de resolución */}
        <AnimatedBlock delay={280}>
          <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: '"Playfair Display", serif', color: '#e8e0d0' }}>
            Resolución de Conflictos
          </h3>
        </AnimatedBlock>
        <div className="space-y-4 mb-14">
          {reglas.map((r, i) => (
            <AnimatedBlock key={r.titulo} delay={330 + i * 60}>
              <div className="card">
                <h4 className="font-bold mb-1" style={{ color: '#c9a96e' }}>{r.titulo}</h4>
                <p className="text-sm leading-relaxed" style={{ color: '#9a9080' }}>{r.texto}</p>
              </div>
            </AnimatedBlock>
          ))}
        </div>

        {/* Conclusiones / Retos */}
        <AnimatedBlock delay={500}>
          <div
            className="rounded-2xl p-8 mb-10"
            style={{ background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.2)' }}
          >
            <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: '"Playfair Display", serif', color: '#e8e0d0' }}>
              Relevancia Actual
            </h3>
            <p className="leading-relaxed mb-0" style={{ color: '#9a9080' }}>
              En el contexto actual, donde muchos municipios enfrentan la{' '}
              <strong style={{ color: '#c8bfaf' }}>segunda generación de POT</strong> (tras cumplir la vigencia
              de 12 años de la primera generación), las determinantes cobran una relevancia crítica. El cambio
              climático y la presión por la expansión urbana exigen un cumplimiento estricto de las normas de
              riesgo y protección de fuentes hídricas.
            </p>
          </div>
        </AnimatedBlock>

        <AnimatedBlock delay={560}>
          <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: '"Playfair Display", serif', color: '#e8e0d0' }}>
            Retos Técnicos y Jurídicos
          </h3>
          <div className="grid md:grid-cols-3 gap-4 mb-16">
            {retos.map((r, i) => (
              <div key={r.n} className="card">
                <div className="font-mono text-3xl font-bold opacity-20 mb-3" style={{ color: '#c9a96e' }}>{r.n}</div>
                <h4 className="font-bold mb-2" style={{ color: '#e8e0d0', fontFamily: '"Playfair Display", serif' }}>{r.titulo}</h4>
                <p className="text-sm leading-relaxed" style={{ color: '#9a9080' }}>{r.texto}</p>
              </div>
            ))}
          </div>
        </AnimatedBlock>

        {/* Glosario */}
        <AnimatedBlock delay={620}>
          <div
            className="rounded-2xl p-8"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <h3 className="text-xl font-bold mb-6" style={{ fontFamily: '"Playfair Display", serif', color: '#e8e0d0' }}>
              Glosario Técnico
            </h3>
            <dl className="space-y-4">
              {glosario.map((g) => (
                <div key={g.termino} className="grid md:grid-cols-4 gap-2">
                  <dt className="font-bold font-mono text-sm" style={{ color: '#c9a96e' }}>{g.termino}</dt>
                  <dd className="md:col-span-3 text-sm leading-relaxed" style={{ color: '#9a9080' }}>{g.definicion}</dd>
                </div>
              ))}
            </dl>
          </div>
        </AnimatedBlock>
      </section>
    </>
  );
}
