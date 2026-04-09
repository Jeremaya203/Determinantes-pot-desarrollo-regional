import { useState } from 'react';
import { actualizarSesion } from '../services/api';
import JustificacionesCarousel from './JustificacionesCarousel';

export default function CasoPracticoPanel({ stats, sesionId, sesionEstado, adminKey }) {
  const [revelado, setRevelado] = useState(false);

  const { total = 0, porOpcion = {}, correcta = 0, justificaciones = [] } = stats || {};
  const pctCorrecta = total > 0 ? Math.round((correcta / total) * 100) : 0;
  // Las justificaciones del caso práctico son objetos {respuesta, texto} — extraer solo el texto
  const textos = justificaciones.map(j => typeof j === 'string' ? j : `[${j.respuesta}] ${j.texto}`);

  const revelarResultados = async () => {
    if (!sesionId) { setRevelado(true); return; }
    try {
      await actualizarSesion(sesionId, { resultados_visibles: true }, adminKey);
      setRevelado(true);
    } catch (e) {
      alert(e.message || 'Error.');
    }
  };

  const opciones = Object.entries(porOpcion).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-center justify-between">
        <p
          className="font-bold text-base"
          style={{ fontFamily: '"Playfair Display", serif', color: '#e8e0d0' }}
        >
          Caso Práctico
        </p>
        <span className="font-mono text-xs" style={{ color: '#9a9080' }}>
          {total} respuestas
        </span>
      </div>

      {total === 0 ? (
        <p className="font-mono text-xs" style={{ color: '#9a9080' }}>Sin respuestas aún.</p>
      ) : (
        <>
          {/* Distribución por opción */}
          <div className="space-y-2">
            {opciones.map(([opcion, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={opcion} className="space-y-1">
                  <div className="flex justify-between font-mono text-xs" style={{ color: '#9a9080' }}>
                    <span>{opcion.replace('opcion_', 'Opción ').toUpperCase()}</span>
                    <span>{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: 'rgba(201,169,110,0.5)' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* % correcto */}
          <div
            className="rounded-xl px-4 py-3 flex items-center justify-between"
            style={{ background: 'rgba(94,164,94,0.08)', border: '1px solid rgba(94,164,94,0.2)' }}
          >
            <p className="font-mono text-xs" style={{ color: '#5ea45e' }}>Respuestas correctas</p>
            <p className="font-mono text-2xl font-bold" style={{ color: '#5ea45e' }}>
              {pctCorrecta}%
            </p>
          </div>

          {/* Justificaciones */}
          {justificaciones.length > 0 && (
            <div>
              <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: '#9a9080' }}>
                Justificaciones
              </p>
              <JustificacionesCarousel textos={textos} />
            </div>
          )}
        </>
      )}

      {/* Revelar resultados */}
      {!revelado && sesionId && (
        <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <button
            onClick={revelarResultados}
            className="w-full py-2.5 rounded-xl font-mono text-xs tracking-wider uppercase"
            style={{
              background: 'rgba(94,164,94,0.12)',
              border: '1px solid rgba(94,164,94,0.3)',
              color: '#5ea45e',
              cursor: 'pointer',
            }}
          >
            Revelar resultados a estudiantes →
          </button>
        </div>
      )}
      {revelado && (
        <p className="font-mono text-xs text-center" style={{ color: '#5ea45e' }}>
          ✓ Resultados visibles para estudiantes
        </p>
      )}
    </div>
  );
}
