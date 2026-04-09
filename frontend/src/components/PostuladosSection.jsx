import { useState, useEffect, useRef } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { enviarPostulado, actualizarCambioOpinion, obtenerSesion } from '../services/api';

function AnimatedBlock({ children, delay = 0 }) {
  const ref = useScrollAnimation();
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const postulados = [
  {
    id: 'postulado_1',
    numero: '01',
    lugar: 'Sabana de Bogotá — Sopó, Cundinamarca',
    afirmacion:
      'Municipios como Sopó deben poder designar sus mejores suelos agrícolas clase II como suelo de expansión urbana para atraer industrias que generen empleo, porque el desarrollo económico local no puede quedar subordinado a una clasificación agronómica decidida en Bogotá.',
    replicas: {
      acuerdo: {
        titulo: 'El municipio tiene autonomía, pero las determinantes la encuadran',
        texto:
          'La autonomía municipal (Art. 287 CP) es real, pero opera dentro del marco legal. Los suelos de clases I, II y III de la Sabana de Bogotá son determinantes de Nivel 2 de la Ley 388/97: el municipio no puede sacrificarlos libremente. Sopó puede desarrollar suelo industrial en clases IV–VIII o en suelos ya degradados sin comprometer la seguridad alimentaria del país.',
        norma: 'Ley 388/97 Art. 10 · Decreto 3600 de 2007 · UPRA — clasificación agrológica',
      },
      desacuerdo: {
        titulo: 'Correcto — el desarrollo no requiere sacrificar los mejores suelos',
        texto:
          'Colombia tiene uno de los suelos agrícolas más productivos del planeta pero los está urbanizando a una tasa alarmante. Las determinantes de suelos productivos existen porque el municipio individual no puede valorar el impacto sobre la seguridad alimentaria nacional. El desarrollo industrial puede y debe ubicarse en suelos de menor vocación agrícola, como ya lo hacen los planes de ordenamiento de la región.',
        norma: 'Ley 388/97 Art. 10 · Política de Suelos Agrícolas · FAO-UPRA',
      },
    },
    cierre:
      'La Sabana de Bogotá perdió entre 1985 y 2020 más de 16.000 hectáreas de suelo agrícola clase I y II por expansión urbana e industrial. Las determinantes de Nivel 2 buscan frenar esa tendencia, no bloquear el desarrollo: Sopó puede crecer económicamente en terrenos de menor valor agrológico. El verdadero reto es que los POT municipales incorporen cartografía agrológica actualizada de la UPRA y zonifiquen el desarrollo donde el suelo tenga menor vocación productiva.',
  },
  {
    id: 'postulado_2',
    numero: '02',
    lugar: 'Catatumbo — Norte de Santander',
    afirmacion:
      'Las Zonas de Reserva Campesina del Catatumbo bloquean el desarrollo del territorio: al declarar esas tierras como zona especial, el Estado prohíbe la inversión privada en extracción de recursos y condena a las comunidades a una pobreza que ellas no eligieron.',
    replicas: {
      acuerdo: {
        titulo: 'La figura existe precisamente para proteger un proyecto de vida territorial',
        texto:
          'Las Zonas de Reserva Campesina (Ley 160 de 1994) son figuras de ordenamiento que protegen la economía campesina frente a la concentración de tierra y los monocultivos intensivos. No "bloquean" el desarrollo: lo dirigen hacia formas compatibles con la permanencia de las comunidades en el territorio. La extracción petrolera en el Catatumbo ha existido décadas y los indicadores de pobreza muestran que no generó el desarrollo prometido.',
        norma: 'Ley 160 de 1994 · Ley 388/97 Art. 10 · Decreto 747 de 2014',
      },
      desacuerdo: {
        titulo: 'Correcto — la autodeterminación campesina es una determinante legítima',
        texto:
          'Las ZRC son una forma de ordenamiento territorial reconocida constitucionalmente: las comunidades campesinas tienen el derecho a definir el modelo de desarrollo que quieren para su territorio. La Corte Constitucional ha reconocido que los derechos de las comunidades agrarias merecen protección especial frente a modelos extractivos que históricamente no han reducido la pobreza sino que la han exacerbado.',
        norma: 'Ley 160/1994 · T-462A de 2014 · Acuerdo de Paz · Reforma Rural Integral',
      },
    },
    cierre:
      'El Catatumbo ilustra el conflicto más profundo del ordenamiento colombiano: la superposición de figuras (ZRC, resguardos, áreas de reserva forestal, concesiones minero-energéticas) en un mismo territorio sin un marco de coordinación claro. Las determinantes existen para poner orden en esa superposición, pero su efectividad depende de que el Estado reconozca y respete las apuestas territoriales de las comunidades que habitan esos suelos, y no solo los intereses de los sectores extractivos.',
  },
  {
    id: 'postulado_3',
    numero: '03',
    lugar: 'Avalancha de Mocoa — Putumayo, 2017',
    afirmacion:
      'Después de la avalancha que mató a 370 personas en Mocoa por asentamientos en zonas de riesgo no mitigable, obligar a las familias sobrevivientes a abandonar sus barrios sin ofrecerles una alternativa habitacional digna equivale a criminalizar la pobreza con el lenguaje técnico del ordenamiento territorial.',
    replicas: {
      acuerdo: {
        titulo: 'La crítica al proceso es válida; la norma de riesgo, no',
        texto:
          'La Corte ha establecido que una orden de reubicación sin solución habitacional viola el derecho a la vivienda digna (Art. 51 CP) y puede impugnarse por tutela. Sin embargo, esto no invalida la determinante de riesgo no mitigable: invalida su implementación deficiente. Mocoa tenía mapas de amenaza desde los años 90. El problema fue que ningún POT actuó sobre esa información.',
        norma: 'Ley 388/97 Art. 10 · T-349 de 2012 · Ley 1523 de 2012 (Gestión del Riesgo)',
      },
      desacuerdo: {
        titulo: 'Correcto — salvar vidas exige reasentamiento efectivo, no solo decretos',
        texto:
          'Las zonas de riesgo no mitigable son la determinante más urgente del sistema: protegen la vida. La norma no puede quedarse en el papel. El Estado debe gestionar el riesgo con sus dos componentes: la restricción de uso del suelo y el reasentamiento digno. Una norma que declara zona de alto riesgo sin ofrecer alternativa habitacional no salva vidas: solo traslada la vulnerabilidad.',
        norma: 'Ley 388/97 Art. 10 · Ley 1523/2012 · Fondo Nacional de Calamidades',
      },
    },
    cierre:
      'Mocoa 2017 es el caso más doloroso del fracaso en aplicar las determinantes de gestión del riesgo en Colombia. Los mapas estaban, la norma era clara, pero el POT municipal no actuó. Esto revela un problema estructural: los municipios identifican zonas de riesgo pero no tienen los recursos ni el apoyo del nivel nacional para hacer efectivo el reasentamiento. Las determinantes solo funcionan cuando van acompañadas de capacidad institucional y financiamiento real.',
  },
  {
    id: 'postulado_4',
    numero: '04',
    lugar: 'Proyecto Hidroituango — Antioquia',
    afirmacion:
      'EPM tenía todos los permisos ambientales para Hidroituango. Si la CAR otorgó la licencia, el POT de los municipios ribereños debía adaptarse al proyecto y las comunidades desplazadas debían aceptar la indemnización: no puede cada vereda vetar una infraestructura estratégica para el país.',
    replicas: {
      acuerdo: {
        titulo: 'El argumento ignora la consulta previa y la jerarquía de licencias',
        texto:
          'Una licencia ambiental de Corantioquia no suspende el derecho a la consulta previa de comunidades étnicas ni el proceso de concertación ambiental del POT. La Corte ha establecido que la consulta previa es un derecho fundamental que no puede ser reemplazado por indemnizaciones. Además, la crisis de 2018 reveló que los estudios de riesgo fallaron, cuestionando la solidez de los permisos otorgados.',
        norma: 'Convenio 169 OIT · C-389 de 2016 · Ley 388/97 Art. 10 · Ley 99/93',
      },
      desacuerdo: {
        titulo: 'Correcto en el principio; los hechos revelan una falla sistémica',
        texto:
          'Hidroituango mostró que otorgar licencia no equivale a haber evaluado correctamente todos los riesgos. La crisis de 2018, con evacuaciones masivas, fue consecuencia de fallas en los estudios técnicos. Las comunidades y los POT locales no eran obstáculos irracionales: eran fuentes de conocimiento territorial que el proceso ignoró.',
        norma: 'Convención Americana sobre DDHH · T-766 de 2015 · Ley 1523/2012',
      },
    },
    cierre:
      'Hidroituango es el espejo donde el país debe mirarse para entender por qué las determinantes existen. La urgencia energética nacional no puede justificar saltarse los procesos de concertación comunitaria y la rigurosidad técnica de las licencias. El caso mostró que los POT locales y las comunidades tienen conocimiento territorial que los modelos de ingeniería a gran escala tienden a ignorar. Las determinantes no son burocracia: son garantías de que las decisiones incorporan todos los saberes y derechos en juego.',
  },
  {
    id: 'postulado_5',
    numero: '05',
    lugar: 'Barrio Moravia — Medellín, Antioquia',
    afirmacion:
      'La transformación del barrio Moravia en Medellín —construido sobre un basural— en parque urbano fue en realidad un proceso de desalojo disfrazado de parque ecológico: el Estado recuperó tierra valiosa desplazando a los más pobres con el argumento de la "gestión del riesgo".',
    replicas: {
      acuerdo: {
        titulo: 'La crítica es legítima cuando el proceso no garantizó reasentamiento digno',
        texto:
          'La Corte ha reconocido que la renovación urbana no puede ejecutarse sin garantizar los derechos de los residentes más vulnerables. Si las familias de Moravia no recibieron alternativas habitacionales equivalentes en el mismo sector, el proceso violó el derecho a la ciudad. La determinante de riesgo era válida —Moravia sí era zona de alto riesgo sanitario— pero no justifica desplazamiento sin reasentamiento digno.',
        norma: 'Art. 51 CP · T-530 de 2011 · Ley 388/97 Art. 58 · Función social de la propiedad',
      },
      desacuerdo: {
        titulo: 'Correcto en la crítica al proceso; no en la existencia de la norma',
        texto:
          'Moravia era literalmente un basurero activo sobre el que se construyó por décadas en condiciones de riesgo sanitario extremo. Recuperar ese suelo para uso público fue una decisión de ordenamiento válida. El problema no fue recuperar el basurero sino cómo se gestionó el desplazamiento. Medellín es reconocido por Moravia como urbanismo social —pero ese reconocimiento omite el costo humano del proceso.',
        norma: 'Ley 388/97 Art. 58 · Decreto 4002 de 2004 · Urbanismo social · Medellín',
      },
    },
    cierre:
      'Moravia es el caso que obliga a preguntarse quién se beneficia cuando el ordenamiento recupera suelo urbano. Los instrumentos de gestión del suelo —planes de renovación, declaratorias de riesgo— pueden usarse para redistribuir la tierra o para concentrarla. La diferencia está en si las comunidades más vulnerables permanecen en el territorio transformado, o si simplemente son removidas para darle paso a usos de mayor valor.',
  },
  {
    id: 'postulado_6',
    numero: '06',
    lugar: 'Santa Cruz de Mompox — Bolívar',
    afirmacion:
      'La declaratoria de Mompox como Patrimonio de la Humanidad UNESCO condena a sus habitantes a vivir en un museo: no pueden modificar sus casas, el turismo los desplaza y el Estado los obliga a conservar un patrimonio cuya carga económica ellos no pueden sostener.',
    replicas: {
      acuerdo: {
        titulo: 'La tensión es real y el sistema la reconoce',
        texto:
          'La Ley 1185 de 2008 exige que el PEMP incluya incentivos: exenciones tributarias, subsidios de restauración y transferencia de derechos de construcción. Sin estos mecanismos, la declaratoria es solo una restricción sin compensación. El Ministerio de Cultura reconoce que la declaratoria de BIC sin PEMP efectivo puede generar cargas desproporcionadas.',
        norma: 'Ley 1185 de 2008 · PEMP · Ley 388/97 Art. 10 · Art. 58 CP',
      },
      desacuerdo: {
        titulo: 'Correcto — el patrimonio no puede ser una trampa para quienes lo habitan',
        texto:
          'Mompox muestra que la presión del turismo internacional puede ser más dañina que beneficiosa si no hay política de distribución de sus beneficios. Las comunidades que dan vida al patrimonio no pueden ser desplazadas por el mercado que ese patrimonio genera. La conservación del centro histórico no puede ser un negocio para los inversores y una carga para los momposinos de a pie.',
        norma: 'Ley 1185/2008 · Declaración UNESCO 1995 · Función social de la propiedad',
      },
    },
    cierre:
      'Mompox ilustra la paradoja del patrimonio vivo: si se conserva solo la arquitectura pero se expulsa a la comunidad que le da sentido, lo que queda es un escenario vacío. Las determinantes culturales de Nivel 3 son un mandato de protección no solo de los inmuebles sino del tejido social que los hace patrimonio. La solución no es flexibilizar la norma sino construir PEMP con participación real, garantizar que los beneficios del turismo lleguen a quienes cargan el costo de la conservación, y aplicar los incentivos que la ley ya prevé.',
  },
];

// Estados: 'pendiente' | 'expandido' | 'posicion_elegida' | 'replica_mostrada' | 'contrareplica' | 'cerrado'
function TarjetaPostulado({ postulado, nombre, sesionId, onCompletado }) {
  const [fase, setFase] = useState('pendiente');
  const [posicion, setPosicion] = useState(null);
  const [argumento, setArgumento] = useState('');
  const [contrareplica, setContrareplica] = useState('');
  const [enviando, setEnviando] = useState(false);

  const replica = posicion ? postulado.replicas[posicion] : null;

  const enviar = async (posicionFinal, argumentoFinal) => {
    if (!nombre || !sesionId) return null;
    setEnviando(true);
    try {
      const res = await enviarPostulado({
        nombre,
        sesion_id: sesionId,
        postulado_id: postulado.id,
        posicion: posicionFinal,
        argumento: argumentoFinal,
      });
      return res.id || null;
    } catch (_e) {
      return null;
    } finally {
      setEnviando(false);
    }
  };

  const handleElegirPosicion = (p) => {
    setPosicion(p);
    setFase('posicion_elegida');
  };

  const handleEnviarArgumento = () => {
    if (argumento.trim().length < 20) return;
    setFase('replica_mostrada');
  };

  const handleEnviarContrareplica = async () => {
    if (contrareplica.trim().length < 20) return;
    const docId = await enviar(posicion, argumento);
    setFase('cerrado');
    onCompletado({ docId, posicion, argumento });
  };

  const handleVerConclusion = async () => {
    const docId = await enviar(posicion, argumento);
    setFase('cerrado');
    onCompletado({ docId, posicion, argumento });
  };

  const handleExpandir = () => {
    if (fase === 'pendiente') setFase('expandido');
  };

  const completado = fase === 'cerrado';

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: completado
          ? '1px solid rgba(94,164,94,0.4)'
          : fase !== 'pendiente'
          ? '1px solid rgba(201,169,110,0.3)'
          : '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Cabecera */}
      <button
        className="w-full text-left p-6 flex items-start justify-between gap-4"
        onClick={handleExpandir}
        disabled={fase !== 'pendiente'}
        style={{ cursor: fase === 'pendiente' ? 'pointer' : 'default' }}
      >
        <div className="flex items-start gap-4">
          <span
            className="text-2xl font-mono font-bold flex-shrink-0 mt-0.5"
            style={{ color: completado ? '#5ea45e' : 'rgba(201,169,110,0.4)' }}
          >
            {postulado.numero}
          </span>
          <div>
            {fase !== 'pendiente' && (
              <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: '#9a9080' }}>
                {postulado.lugar}
              </p>
            )}
            <p
              className="text-sm leading-relaxed"
              style={{
                color: fase === 'pendiente' ? '#9a9080' : '#c8bfaf',
                fontFamily: fase === 'pendiente' ? 'inherit' : '"Playfair Display", serif',
              }}
            >
              {fase === 'pendiente'
                ? `Caso ${postulado.numero} — ${postulado.lugar}`
                : postulado.afirmacion}
            </p>
          </div>
        </div>
        {completado && (
          <span
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mt-0.5"
            style={{ background: 'rgba(94,164,94,0.2)', color: '#5ea45e', border: '1px solid rgba(94,164,94,0.4)' }}
          >
            ✓
          </span>
        )}
        {fase === 'pendiente' && (
          <span className="flex-shrink-0 text-xs font-mono mt-0.5" style={{ color: '#c9a96e' }}>↓</span>
        )}
      </button>

      {/* Cuerpo expandido */}
      {fase !== 'pendiente' && !completado && (
        <div className="px-6 pb-6 space-y-5">

          {fase === 'expandido' && (
            <div className="space-y-3">
              <p className="font-mono text-xs tracking-widest uppercase" style={{ color: '#c9a96e' }}>
                Ronda 1 — Tu posición
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleElegirPosicion('acuerdo')}
                  className="flex-1 py-3 rounded-xl font-mono text-sm tracking-wider transition-all duration-200"
                  style={{ background: 'rgba(224,112,112,0.1)', border: '1px solid rgba(224,112,112,0.35)', color: '#e07070' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(224,112,112,0.2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(224,112,112,0.1)')}
                >
                  De acuerdo 👍
                </button>
                <button
                  onClick={() => handleElegirPosicion('desacuerdo')}
                  className="flex-1 py-3 rounded-xl font-mono text-sm tracking-wider transition-all duration-200"
                  style={{ background: 'rgba(94,164,94,0.1)', border: '1px solid rgba(94,164,94,0.35)', color: '#5ea45e' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(94,164,94,0.2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(94,164,94,0.1)')}
                >
                  En desacuerdo 👎
                </button>
              </div>
            </div>
          )}

          {fase === 'posicion_elegida' && (
            <div className="space-y-3">
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-2"
                style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.15)' }}
              >
                <span className="font-mono text-xs" style={{ color: '#c9a96e' }}>Tu posición:</span>
                <span className="font-mono text-xs font-bold" style={{ color: posicion === 'acuerdo' ? '#e07070' : '#5ea45e' }}>
                  {posicion === 'acuerdo' ? 'De acuerdo 👍' : 'En desacuerdo 👎'}
                </span>
              </div>
              <p className="font-mono text-xs tracking-widest uppercase" style={{ color: '#c9a96e' }}>Tu argumento</p>
              <textarea
                value={argumento}
                onChange={e => setArgumento(e.target.value)}
                placeholder="Explica tu razonamiento jurídico o conceptual..."
                rows={4}
                className="w-full rounded-xl p-4 text-sm leading-relaxed resize-none outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#e8e0d0',
                  fontFamily: 'inherit',
                }}
                onFocus={e => (e.target.style.border = '1px solid rgba(201,169,110,0.4)')}
                onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.1)')}
              />
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs" style={{ color: argumento.trim().length >= 20 ? '#5ea45e' : '#9a9080' }}>
                  {argumento.trim().length} / 20 mín.
                </span>
                <button
                  onClick={handleEnviarArgumento}
                  disabled={argumento.trim().length < 20}
                  className="px-5 py-2 rounded-xl font-mono text-xs tracking-wider uppercase transition-all duration-200"
                  style={{
                    background: argumento.trim().length >= 20 ? 'rgba(201,169,110,0.2)' : 'rgba(255,255,255,0.04)',
                    border: argumento.trim().length >= 20 ? '1px solid rgba(201,169,110,0.5)' : '1px solid rgba(255,255,255,0.1)',
                    color: argumento.trim().length >= 20 ? '#c9a96e' : '#9a9080',
                    cursor: argumento.trim().length >= 20 ? 'pointer' : 'not-allowed',
                  }}
                >
                  Enviar argumento →
                </button>
              </div>
            </div>
          )}

          {(fase === 'replica_mostrada' || fase === 'contrareplica') && replica && (
            <div className="space-y-4">
              <div
                className="rounded-xl p-5 space-y-3"
                style={{ background: 'rgba(201,169,110,0.07)', border: '1px solid rgba(201,169,110,0.2)' }}
              >
                <p className="font-mono text-xs tracking-widest uppercase" style={{ color: '#c9a96e' }}>Réplica jurídica</p>
                <h4
                  className="font-bold text-base leading-snug"
                  style={{ fontFamily: '"Playfair Display", serif', color: '#e8e0d0' }}
                >
                  {replica.titulo}
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: '#c8bfaf' }}>{replica.texto}</p>
                <p className="font-mono text-xs" style={{ color: '#c9a96e' }}>{replica.norma}</p>
              </div>

              {fase === 'replica_mostrada' && (
                <div className="space-y-3">
                  <p className="font-mono text-xs tracking-widest uppercase" style={{ color: '#c9a96e' }}>
                    Ronda 2 — Contrarréplica
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setFase('contrareplica')}
                      className="flex-1 py-3 rounded-xl font-mono text-sm tracking-wider transition-all duration-200"
                      style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.4)', color: '#c9a96e' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,169,110,0.22)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(201,169,110,0.12)')}
                    >
                      Quiero replicar
                    </button>
                    <button
                      onClick={handleVerConclusion}
                      disabled={enviando}
                      className="flex-1 py-3 rounded-xl font-mono text-sm tracking-wider transition-all duration-200"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#9a9080' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#c8bfaf')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#9a9080')}
                    >
                      {enviando ? 'Guardando...' : 'Ver conclusión →'}
                    </button>
                  </div>
                </div>
              )}

              {fase === 'contrareplica' && (
                <div className="space-y-3">
                  <textarea
                    value={contrareplica}
                    onChange={e => setContrareplica(e.target.value)}
                    placeholder="¿Qué responderías a esta réplica jurídica?"
                    rows={3}
                    className="w-full rounded-xl p-4 text-sm leading-relaxed resize-none outline-none transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#e8e0d0',
                      fontFamily: 'inherit',
                    }}
                    onFocus={e => (e.target.style.border = '1px solid rgba(201,169,110,0.4)')}
                    onBlur={e => (e.target.style.border = '1px solid rgba(255,255,255,0.1)')}
                  />
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs" style={{ color: contrareplica.trim().length >= 20 ? '#5ea45e' : '#9a9080' }}>
                      {contrareplica.trim().length} / 20 mín.
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleVerConclusion}
                        disabled={enviando}
                        className="px-4 py-2 rounded-xl font-mono text-xs tracking-wider transition-all duration-200"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#9a9080' }}
                      >
                        Saltar
                      </button>
                      <button
                        onClick={handleEnviarContrareplica}
                        disabled={contrareplica.trim().length < 20 || enviando}
                        className="px-5 py-2 rounded-xl font-mono text-xs tracking-wider uppercase transition-all duration-200"
                        style={{
                          background: contrareplica.trim().length >= 20 ? 'rgba(94,164,94,0.2)' : 'rgba(255,255,255,0.04)',
                          border: contrareplica.trim().length >= 20 ? '1px solid rgba(94,164,94,0.5)' : '1px solid rgba(255,255,255,0.1)',
                          color: contrareplica.trim().length >= 20 ? '#5ea45e' : '#9a9080',
                          cursor: contrareplica.trim().length >= 20 ? 'pointer' : 'not-allowed',
                        }}
                      >
                        {enviando ? 'Guardando...' : 'Enviar contrarréplica →'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {completado && (
        <div className="px-6 pb-6">
          <div
            className="rounded-xl p-5 space-y-2"
            style={{ background: 'rgba(94,164,94,0.06)', border: '1px solid rgba(94,164,94,0.2)' }}
          >
            <p className="font-mono text-xs tracking-widest uppercase" style={{ color: '#5ea45e' }}>
              Cierre jurídico
            </p>
            <p className="text-sm leading-relaxed" style={{ color: '#c8bfaf' }}>
              {postulado.cierre}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function SegundaVotacionBanner({ docIds, posicionesPrimeras, onCambioRegistrado }) {
  const [votos, setVotos] = useState({});

  const registrar = async (index, nuevaPosicion) => {
    if (votos[index] !== undefined) return;
    const docId = docIds[index];
    if (docId) {
      try { await actualizarCambioOpinion(docId, nuevaPosicion); } catch (_e) {}
    }
    const nextVotos = { ...votos, [index]: nuevaPosicion };
    setVotos(nextVotos);
    if (Object.keys(nextVotos).length >= postulados.length) {
      onCambioRegistrado?.();
    }
  };

  return (
    <div
      className="rounded-2xl p-6 space-y-4 mt-6"
      style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.35)' }}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">🔄</span>
        <div>
          <p className="font-mono text-xs tracking-widest uppercase" style={{ color: '#c9a96e' }}>
            Segunda votación — abierta por el docente
          </p>
          <p className="text-sm mt-1" style={{ color: '#9a9080' }}>
            Tras el debate en clase, ¿mantuviste tu posición o cambiaste de opinión?
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {postulados.map((p, i) => {
          const primera = posicionesPrimeras[i];
          const voted = votos[i];
          return (
            <div
              key={p.id}
              className="rounded-xl p-4"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <p className="font-mono text-xs mb-3" style={{ color: '#9a9080' }}>
                Caso {p.numero} — {p.lugar.split(' — ')[0]}
              </p>
              {voted !== undefined ? (
                <p className="font-mono text-xs" style={{ color: '#5ea45e' }}>
                  ✓ {voted === primera ? 'Mantuve mi posición' : `Cambié a ${voted === 'acuerdo' ? 'De acuerdo' : 'En desacuerdo'}`}
                </p>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => registrar(i, primera)}
                    className="flex-1 py-2 rounded-lg font-mono text-xs tracking-wider transition-all duration-200"
                    style={{ background: 'rgba(94,164,94,0.12)', border: '1px solid rgba(94,164,94,0.3)', color: '#5ea45e' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(94,164,94,0.22)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(94,164,94,0.12)')}
                  >
                    Mantuve mi posición
                  </button>
                  <button
                    onClick={() => registrar(i, primera === 'acuerdo' ? 'desacuerdo' : 'acuerdo')}
                    className="flex-1 py-2 rounded-lg font-mono text-xs tracking-wider transition-all duration-200"
                    style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,169,110,0.22)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(201,169,110,0.12)')}
                  >
                    Cambié de opinión
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PostuladosSection({ nombre = '', sesionId = '' }) {
  const [completados, setCompletados] = useState(0);
  const [docIds, setDocIds] = useState([]);
  const [posicionesPrimeras, setPosicionesPrimeras] = useState([]);
  const [sesionEstado, setSesionEstado] = useState(null);
  const [segundaVotacionCompleta, setSegundaVotacionCompleta] = useState(false);
  const pollingRef = useRef(null);
  const todos = postulados.length;

  const todosCompletados = completados === todos;

  const handleCompletado = (index, { docId, posicion }) => {
    setCompletados(prev => prev + 1);
    setDocIds(prev => { const next = [...prev]; next[index] = docId; return next; });
    setPosicionesPrimeras(prev => { const next = [...prev]; next[index] = posicion; return next; });
  };

  useEffect(() => {
    if (!sesionId || !todosCompletados) return;
    const poll = async () => {
      try {
        const data = await obtenerSesion(sesionId);
        setSesionEstado(data.estado);
      } catch (_e) {}
    };
    poll();
    pollingRef.current = setInterval(poll, 3000);
    return () => clearInterval(pollingRef.current);
  }, [sesionId, todosCompletados]);

  useEffect(() => {
    if (segundaVotacionCompleta && pollingRef.current) clearInterval(pollingRef.current);
  }, [segundaVotacionCompleta]);

  const mostrarSegundaVotacion =
    todosCompletados && sesionEstado === 'segunda_votacion_abierta' && !segundaVotacionCompleta;

  return (
    <section
      id="postulados"
      className="py-20"
      style={{ background: 'linear-gradient(to bottom, #0d1a0e, #0a0f0a)' }}
    >
      <div className="max-w-3xl mx-auto px-6">
        <AnimatedBlock>
          <p className="section-label">06 — Debate Jurídico</p>
        </AnimatedBlock>
        <AnimatedBlock delay={100}>
          <h2 className="section-title">Casos Controversiales</h2>
        </AnimatedBlock>
        <AnimatedBlock delay={150}>
          <div className="divider" />
          <p className="text-lg leading-relaxed mb-10" style={{ color: '#9a9080' }}>
            Seis casos reales de Colombia donde las determinantes de superior jerarquía generaron
            conflictos territoriales. Lee cada afirmación, toma posición y argumenta.
          </p>
        </AnimatedBlock>

        <div className="space-y-4">
          {postulados.map((p, i) => (
            <AnimatedBlock key={p.id} delay={i * 60}>
              <TarjetaPostulado
                postulado={p}
                nombre={nombre}
                sesionId={sesionId}
                onCompletado={(data) => handleCompletado(i, data)}
              />
            </AnimatedBlock>
          ))}
        </div>

        {mostrarSegundaVotacion && (
          <SegundaVotacionBanner
            docIds={docIds}
            posicionesPrimeras={posicionesPrimeras}
            onCambioRegistrado={() => setSegundaVotacionCompleta(true)}
          />
        )}

        {todosCompletados && !mostrarSegundaVotacion && (
          <AnimatedBlock delay={0}>
            <div
              className="mt-10 rounded-2xl p-8 text-center space-y-4"
              style={{ background: 'rgba(94,164,94,0.08)', border: '1px solid rgba(94,164,94,0.3)' }}
            >
              <p
                className="text-xl font-bold"
                style={{ fontFamily: '"Playfair Display", serif', color: '#5ea45e' }}
              >
                {segundaVotacionCompleta
                  ? 'Debates completados. Segunda votación registrada.'
                  : 'Has completado todos los debates.'}
              </p>
              <p className="text-sm" style={{ color: '#9a9080' }}>
                {sesionId && !segundaVotacionCompleta
                  ? 'El docente puede abrir una segunda ronda de votación en cualquier momento.'
                  : 'Ahora pon a prueba tu análisis en el caso práctico.'}
              </p>
              <a
                href="#actividad"
                className="inline-block px-6 py-3 rounded-xl font-mono text-sm tracking-wider uppercase transition-all duration-200"
                style={{
                  background: 'rgba(201,169,110,0.15)',
                  border: '1px solid rgba(201,169,110,0.4)',
                  color: '#c9a96e',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,169,110,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(201,169,110,0.15)')}
              >
                Ir al caso práctico ↓
              </a>
            </div>
          </AnimatedBlock>
        )}
      </div>
    </section>
  );
}
