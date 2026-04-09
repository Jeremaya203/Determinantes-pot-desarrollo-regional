import { crearSesion } from '../services/api';
import { useState } from 'react';

export default function DashboardHeader({ sesionId, setSesionId, participantes, adminKey }) {
  const [creando, setCreando] = useState(false);

  const handleNuevaSesion = async () => {
    if (!window.confirm('¿Crear una nueva sesión? La URL de la sesión anterior quedará inactiva.')) return;
    setCreando(true);
    try {
      const res = await crearSesion(adminKey);
      setSesionId(res.id);
    } catch (e) {
      alert(e.message || 'Error al crear sesión.');
    } finally {
      setCreando(false);
    }
  };

  const base = window.location.origin + window.location.pathname;
  const urlEstudiante = sesionId ? `${base}?sesion=${sesionId}` : '';

  const copiarUrl = () => {
    if (urlEstudiante) {
      navigator.clipboard.writeText(urlEstudiante).catch(() => {});
    }
  };

  return (
    <div
      className="px-6 py-4 flex flex-wrap items-center justify-between gap-4"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="flex items-center gap-4">
        <div>
          <p className="font-mono text-xs tracking-widest uppercase" style={{ color: '#9a9080' }}>
            Sesión activa
          </p>
          <p className="font-mono text-sm font-bold" style={{ color: '#e8e0d0' }}>
            {sesionId || '—'}
          </p>
        </div>
        <div
          className="w-px h-8"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        />
        <div>
          <p className="font-mono text-xs tracking-widest uppercase" style={{ color: '#9a9080' }}>
            Participantes
          </p>
          <p className="font-mono text-2xl font-bold" style={{ color: '#c9a96e' }}>
            {participantes ?? '—'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {urlEstudiante && (
          <button
            onClick={copiarUrl}
            className="px-4 py-2 rounded-xl font-mono text-xs tracking-wider uppercase"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#9a9080',
              cursor: 'pointer',
            }}
            title={urlEstudiante}
          >
            Copiar URL estudiantes
          </button>
        )}
        <button
          onClick={handleNuevaSesion}
          disabled={creando}
          className="px-4 py-2 rounded-xl font-mono text-xs tracking-wider uppercase"
          style={{
            background: 'rgba(201,169,110,0.15)',
            border: '1px solid rgba(201,169,110,0.4)',
            color: '#c9a96e',
            cursor: creando ? 'not-allowed' : 'pointer',
          }}
        >
          {creando ? 'Creando...' : '+ Nueva sesión'}
        </button>
      </div>
    </div>
  );
}
