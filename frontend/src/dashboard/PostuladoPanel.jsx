import { actualizarSesion } from '../services/api';
import JustificacionesCarousel from './JustificacionesCarousel';

const POSTULADO_LABELS = {
  postulado_1: 'Sopó',
  postulado_2: 'Catatumbo',
  postulado_3: 'Mocoa',
  postulado_4: 'Hidroituango',
  postulado_5: 'Moravia',
  postulado_6: 'Mompox',
};

function BarraVotos({ acuerdo = 0, desacuerdo = 0 }) {
  const total = acuerdo + desacuerdo;
  if (total === 0) return (
    <p className="font-mono text-xs" style={{ color: '#9a9080' }}>Sin votos aún.</p>
  );
  const pctAcuerdo = Math.round((acuerdo / total) * 100);
  const pctDesacuerdo = 100 - pctAcuerdo;

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-stretch h-8 rounded-lg overflow-hidden">
        {acuerdo > 0 && (
          <div
            className="flex items-center justify-center font-mono text-xs font-bold"
            style={{
              width: `${pctAcuerdo}%`,
              background: 'rgba(224,112,112,0.3)',
              color: '#e07070',
              minWidth: '32px',
            }}
          >
            {pctAcuerdo}%
          </div>
        )}
        {desacuerdo > 0 && (
          <div
            className="flex items-center justify-center font-mono text-xs font-bold"
            style={{
              width: `${pctDesacuerdo}%`,
              background: 'rgba(94,164,94,0.3)',
              color: '#5ea45e',
              minWidth: '32px',
            }}
          >
            {pctDesacuerdo}%
          </div>
        )}
      </div>
      <div className="flex justify-between font-mono text-xs" style={{ color: '#9a9080' }}>
        <span>👍 De acuerdo: {acuerdo}</span>
        <span>👎 En desacuerdo: {desacuerdo}</span>
      </div>
    </div>
  );
}

export default function PostuladoPanel({ postuladoId, stats, sesionId, sesionEstado, adminKey }) {
  const label = POSTULADO_LABELS[postuladoId] || postuladoId;
  const { acuerdo = 0, desacuerdo = 0, cambios = 0, justificaciones = [], justificaciones_cambio = [] } = stats || {};
  const segunda = { acuerdo: 0, desacuerdo: 0, cambios };

  const abrirSegundaVotacion = async () => {
    try {
      await actualizarSesion(sesionId, {
        estado: 'segunda_votacion_abierta',
        postulado_activo: postuladoId,
      }, adminKey);
    } catch (e) {
      alert(e.message || 'Error al abrir segunda votación.');
    }
  };

  const cerrarVotacion = async () => {
    try {
      await actualizarSesion(sesionId, {
        estado: 'esperando',
        postulado_activo: null,
      }, adminKey);
    } catch (e) {
      alert(e.message || 'Error.');
    }
  };

  const isActive = sesionEstado === 'segunda_votacion_abierta';

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
          {label}
        </p>
        <span className="font-mono text-xs" style={{ color: '#9a9080' }}>
          {(acuerdo + desacuerdo)} votos
        </span>
      </div>

      <div>
        <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: '#9a9080' }}>
          Primera ronda
        </p>
        <BarraVotos acuerdo={acuerdo} desacuerdo={desacuerdo} />
      </div>

      {/* Segunda ronda (si hay datos) */}
      {(segunda.acuerdo > 0 || segunda.desacuerdo > 0) && (
        <div>
          <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: '#c9a96e' }}>
            Segunda ronda
          </p>
          <BarraVotos acuerdo={segunda.acuerdo || 0} desacuerdo={segunda.desacuerdo || 0} />
          {segunda.cambios > 0 && (
            <p className="font-mono text-xs mt-1" style={{ color: '#c9a96e' }}>
              {segunda.cambios} {segunda.cambios === 1 ? 'persona cambió' : 'personas cambiaron'} de opinión
            </p>
          )}
        </div>
      )}

      {/* Argumentos */}
      {justificaciones.length > 0 && (
        <div>
          <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: '#9a9080' }}>
            Argumentos
          </p>
          <JustificacionesCarousel textos={justificaciones} />
        </div>
      )}

      {/* Control de segunda votación */}
      {sesionId && (
        <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {!isActive ? (
            <button
              onClick={abrirSegundaVotacion}
              className="w-full py-2.5 rounded-xl font-mono text-xs tracking-wider uppercase"
              style={{
                background: 'rgba(201,169,110,0.12)',
                border: '1px solid rgba(201,169,110,0.3)',
                color: '#c9a96e',
                cursor: 'pointer',
              }}
            >
              Abrir segunda votación →
            </button>
          ) : (
            <button
              onClick={cerrarVotacion}
              className="w-full py-2.5 rounded-xl font-mono text-xs tracking-wider uppercase"
              style={{
                background: 'rgba(224,112,112,0.12)',
                border: '1px solid rgba(224,112,112,0.3)',
                color: '#e07070',
                cursor: 'pointer',
              }}
            >
              Cerrar segunda votación
            </button>
          )}
        </div>
      )}
    </div>
  );
}
