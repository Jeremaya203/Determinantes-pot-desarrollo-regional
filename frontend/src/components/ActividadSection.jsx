import { useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { enviarResultado } from '../services/api';

function AnimatedBlock({ children, delay = 0 }) {
  const ref = useScrollAnimation();
  return <div ref={ref} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const escenario = {
  id: 'escenario_1',
  titulo: 'Caso Práctico: El Municipio de Río Verde',
  contexto: `El municipio de Río Verde (45.000 habitantes) está elaborando su nuevo PBOT.
El Concejo Municipal propone reclasificar como "suelo de expansión urbana" una zona de 200 hectáreas
ubicada en la ronda hídrica del río principal y en área de amortiguación de una Reserva Forestal
declarada por la CAR regional. El argumento del Concejo es que el municipio necesita suelo
para un proyecto de vivienda de interés social (VIS) de 1.800 unidades, dada la alta demanda habitacional.`,
  pregunta: '¿Puede el municipio proceder con esta reclasificación? ¿Cuál es la actuación correcta?',
  opciones: [
    {
      id: 'opcion_a',
      texto: 'Sí puede proceder, porque la autonomía municipal (Art. 287 CP) le permite tomar decisiones sobre su territorio sin restricciones externas.',
    },
    {
      id: 'opcion_b',
      texto: 'No puede proceder directamente. Las rondas hídricas y las áreas de amortiguación de reservas forestales son determinantes ambientales de Nivel 1 (Ley 388/97, Art. 10). El municipio debe concertar con la CAR y, si hay conflicto, el área protegida prevalece sobre la expansión urbana.',
    },
    {
      id: 'opcion_c',
      texto: 'Puede proceder si el proyecto es de VIS, porque la seguridad alimentaria y la vivienda social tienen igual jerarquía que las determinantes ambientales.',
    },
  ],
  respuestaCorrecta: 'opcion_b',
  explicacion: {
    opcion_a: {
      titulo: 'Incorrecto — La autonomía no es absoluta',
      texto: 'El Art. 287 CP reconoce la autonomía territorial, pero esta se ejerce "dentro de los límites de la Constitución y la ley". La Corte Constitucional (C-138/2020) ha sido clara: la autonomía municipal cede ante las determinantes de superior jerarquía cuando están en juego bienes colectivos como el agua o los ecosistemas estratégicos.',
    },
    opcion_b: {
      titulo: '✓ Correcto — Determinantes Ambientales de Nivel 1',
      texto: 'La ronda hídrica es suelo de protección y la amortiguación de la Reserva Forestal es una determinante ambiental. Ambas deben ser concertadas con la CAR (30 días). Si hay desacuerdo, el asunto sube al Ministerio de Ambiente. El municipio puede buscar suelo alternativo que no afecte estas determinantes para el proyecto VIS.',
    },
    opcion_c: {
      titulo: 'Incorrecto — Jerarquía normativa clara',
      texto: 'El sistema de determinantes establece una gradación normativa clara: las determinantes ambientales (Nivel 1) prevalecen sobre las decisiones de uso del suelo local. La vivienda social es un objetivo legítimo, pero debe encontrar solución en suelos que no estén protegidos por determinantes de mayor jerarquía.',
    },
  },
};

const estadoInicial = {
  nombre: '',
  correo: '',
  opcionSeleccionada: '',
  justificacion: '',
};

export default function ActividadSection({ nombre: nombreProp = '', sesionId = '' }) {
  const [form, setForm] = useState({ ...estadoInicial, nombre: nombreProp });
  const [fase, setFase] = useState('lectura'); // lectura | respuesta | enviando | resultado
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  // Pre-fill nombre when RegistroModal sets it after mount
  useEffect(() => {
    if (nombreProp && fase === 'lectura') {
      setForm(prev => ({ ...prev, nombre: prev.nombre || nombreProp }));
    }
  }, [nombreProp]);

  const handleSubmit = async () => {
    if (!form.nombre.trim() || !form.correo.trim() || !form.opcionSeleccionada) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.correo)) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }
    setError('');
    setFase('enviando');
    try {
      const data = await enviarResultado({
        nombre: form.nombre,
        correo: form.correo,
        escenario: escenario.id,
        respuesta: form.opcionSeleccionada,
        justificacion: form.justificacion,
        puntaje: form.opcionSeleccionada === escenario.respuestaCorrecta ? 100 : 0,
        sesion_id: sesionId,
      });
      setResultado(data);
      setFase('resultado');
    } catch (err) {
      setError(err.message || 'Error al enviar. Verifica tu conexión.');
      setFase('respuesta');
    }
  };

  const reiniciar = () => {
    setForm(estadoInicial);
    setFase('lectura');
    setResultado(null);
    setError('');
  };

  const explicacionActual = resultado
    ? escenario.explicacion[form.opcionSeleccionada]
    : null;

  return (
    <section
      id="actividad"
      className="py-20"
      style={{ background: 'linear-gradient(to bottom, #0a0f0a, #0d1a0e)' }}
    >
      <div className="max-w-3xl mx-auto px-6">
        <AnimatedBlock>
          <p className="section-label">07 — Actividad Interactiva</p>
        </AnimatedBlock>
        <AnimatedBlock delay={100}>
          <h2 className="section-title">Caso Práctico</h2>
        </AnimatedBlock>
        <AnimatedBlock delay={150}>
          <div className="divider" />
          <p className="text-lg leading-relaxed mb-10" style={{ color: '#9a9080' }}>
            Aplica lo aprendido. Lee el escenario y decide cuál es la actuación jurídicamente correcta.
          </p>
        </AnimatedBlock>

        {/* Escenario */}
        <AnimatedBlock delay={200}>
          <div
            className="rounded-2xl p-8 mb-8"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,169,110,0.2)' }}
          >
            <h3
              className="text-xl font-bold mb-4"
              style={{ fontFamily: '"Playfair Display", serif', color: '#c9a96e' }}
            >
              {escenario.titulo}
            </h3>
            <p className="leading-relaxed mb-6 text-sm whitespace-pre-line" style={{ color: '#c8bfaf' }}>
              {escenario.contexto}
            </p>
            <div
              className="rounded-xl p-4"
              style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}
            >
              <p className="font-semibold text-sm" style={{ color: '#e8e0d0' }}>
                🤔 {escenario.pregunta}
              </p>
            </div>
          </div>
        </AnimatedBlock>

        {/* Fase: Lectura → pasar a responder */}
        {fase === 'lectura' && (
          <AnimatedBlock delay={280}>
            <button
              onClick={() => setFase('respuesta')}
              className="w-full py-4 rounded-2xl font-mono text-sm tracking-wider uppercase transition-all duration-300"
              style={{
                background: 'rgba(94,164,94,0.15)',
                border: '1px solid rgba(94,164,94,0.4)',
                color: '#5ea45e',
              }}
              onMouseEnter={e => { e.target.style.background = 'rgba(94,164,94,0.25)'; }}
              onMouseLeave={e => { e.target.style.background = 'rgba(94,164,94,0.15)'; }}
            >
              He leído el escenario → Responder ahora
            </button>
          </AnimatedBlock>
        )}

        {/* Fase: Respuesta */}
        {(fase === 'respuesta' || fase === 'enviando') && (
          <AnimatedBlock delay={0}>
            {/* Opciones */}
            <div className="space-y-3 mb-8">
              {escenario.opciones.map((op) => (
                <button
                  key={op.id}
                  onClick={() => setForm(f => ({ ...f, opcionSeleccionada: op.id }))}
                  className="w-full text-left p-5 rounded-2xl transition-all duration-300"
                  style={{
                    background: form.opcionSeleccionada === op.id
                      ? 'rgba(201,169,110,0.15)'
                      : 'rgba(255,255,255,0.02)',
                    border: form.opcionSeleccionada === op.id
                      ? '1px solid rgba(201,169,110,0.5)'
                      : '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono mt-0.5"
                      style={{
                        borderColor: form.opcionSeleccionada === op.id ? '#c9a96e' : 'rgba(255,255,255,0.2)',
                        background: form.opcionSeleccionada === op.id ? 'rgba(201,169,110,0.3)' : 'transparent',
                        color: form.opcionSeleccionada === op.id ? '#c9a96e' : '#9a9080',
                      }}
                    >
                      {op.id === 'opcion_a' ? 'A' : op.id === 'opcion_b' ? 'B' : 'C'}
                    </span>
                    <p className="text-sm leading-relaxed" style={{ color: '#c8bfaf' }}>{op.texto}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Justificación */}
            <div className="mb-6">
              <label className="block font-mono text-xs tracking-widest uppercase mb-2" style={{ color: '#9a9080' }}>
                Justificación (opcional)
              </label>
              <textarea
                value={form.justificacion}
                onChange={e => setForm(f => ({ ...f, justificacion: e.target.value }))}
                rows={3}
                placeholder="Explica brevemente por qué elegiste esa opción..."
                className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none focus:ring-1"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#c8bfaf',
                  caretColor: '#c9a96e',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(201,169,110,0.4)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
            </div>

            {/* Datos personales */}
            <div
              className="rounded-2xl p-6 mb-6"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: '#9a9080' }}>
                Tus datos para registrar la actividad
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#9a9080' }}>Nombre completo *</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                    placeholder="Tu nombre"
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#c8bfaf',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(201,169,110,0.4)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#9a9080' }}>Correo electrónico *</label>
                  <input
                    type="email"
                    value={form.correo}
                    onChange={e => setForm(f => ({ ...f, correo: e.target.value }))}
                    placeholder="tu@correo.com"
                    className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#c8bfaf',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(201,169,110,0.4)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm mb-4 text-center font-mono" style={{ color: '#e07070' }}>{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={fase === 'enviando'}
              className="w-full py-4 rounded-2xl font-mono text-sm tracking-wider uppercase transition-all duration-300 disabled:opacity-50"
              style={{
                background: 'rgba(94,164,94,0.2)',
                border: '1px solid rgba(94,164,94,0.5)',
                color: '#5ea45e',
              }}
            >
              {fase === 'enviando' ? 'Enviando...' : 'Enviar respuesta →'}
            </button>
          </AnimatedBlock>
        )}

        {/* Fase: Resultado */}
        {fase === 'resultado' && resultado && (
          <AnimatedBlock delay={0}>
            <div
              className="rounded-2xl p-8 mb-6"
              style={{
                background: resultado.correcta ? 'rgba(94,164,94,0.1)' : 'rgba(224,112,112,0.1)',
                border: `1px solid ${resultado.correcta ? 'rgba(94,164,94,0.4)' : 'rgba(224,112,112,0.4)'}`,
              }}
            >
              <div className="text-4xl mb-4">{resultado.correcta ? '✅' : '❌'}</div>
              <h3
                className="text-2xl font-bold mb-3"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  color: resultado.correcta ? '#5ea45e' : '#e07070',
                }}
              >
                {explicacionActual?.titulo}
              </h3>
              <p className="leading-relaxed text-sm" style={{ color: '#c8bfaf' }}>
                {explicacionActual?.texto}
              </p>
            </div>

            {/* Mostrar la respuesta correcta si erró */}
            {!resultado.correcta && (
              <div
                className="rounded-2xl p-6 mb-6"
                style={{ background: 'rgba(94,164,94,0.08)', border: '1px solid rgba(94,164,94,0.3)' }}
              >
                <p className="font-mono text-xs uppercase tracking-widest mb-2" style={{ color: '#5ea45e' }}>
                  Respuesta correcta
                </p>
                <p className="text-sm leading-relaxed" style={{ color: '#c8bfaf' }}>
                  {escenario.opciones.find(o => o.id === escenario.respuestaCorrecta)?.texto}
                </p>
              </div>
            )}

            <p className="text-center text-xs font-mono mb-6" style={{ color: '#9a9080' }}>
              Tu respuesta fue guardada correctamente. ¡Gracias, {resultado && form.nombre}!
            </p>

            <button
              onClick={reiniciar}
              className="w-full py-3 rounded-2xl font-mono text-xs tracking-wider uppercase transition-all duration-300"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#9a9080',
              }}
            >
              Volver a intentarlo
            </button>
          </AnimatedBlock>
        )}
      </div>
    </section>
  );
}
