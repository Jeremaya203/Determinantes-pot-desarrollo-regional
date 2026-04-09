import { useState } from 'react';
import DashboardLogin from './DashboardLogin';
import DashboardHeader from './DashboardHeader';
import PostuladoPanel from './PostuladoPanel';
import CasoPracticoPanel from './CasoPracticoPanel';
import { useDashboardData } from './useDashboardData';
import { crearSesion } from '../services/api';

const POSTULADOS_IDS = [
  'postulado_1', 'postulado_2', 'postulado_3',
  'postulado_4', 'postulado_5', 'postulado_6',
];

export default function DashboardPage() {
  const [adminKey, setAdminKey] = useState('');
  const [sesionId, setSesionId] = useState('');
  const [iniciando, setIniciando] = useState(false);
  const [modoGlobal, setModoGlobal] = useState(false);

  // El ID que se pasa al hook: 'global' o el sesionId real
  const idConsulta = modoGlobal ? 'global' : sesionId;
  const { data, error, loading } = useDashboardData(idConsulta, adminKey);

  // Primer login: pedir contraseña, luego activar modo global por defecto
  const handleLogin = async (clave) => {
    setAdminKey(clave);
    setModoGlobal(true); // Mostrar todos los datos por defecto al entrar
    setIniciando(true);
    try {
      const res = await crearSesion(clave);
      setSesionId(res.sesion_id);
    } catch (e) {
      // No bloqueamos si falla crear sesión, igual se puede ver modo global
      console.warn('No se pudo crear sesión nueva:', e.message);
    } finally {
      setIniciando(false);
    }
  };

  if (!adminKey) {
    return <DashboardLogin onLogin={handleLogin} />;
  }

  if (iniciando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0e1510' }}>
        <p className="font-mono text-sm" style={{ color: '#c9a96e' }}>Iniciando sesión...</p>
      </div>
    );
  }

  const sesion = data?.sesion || {};
  const statsPostulados = data?.postulados || {};
  const casoPracticoRaw = data?.caso_practico || {};
  // Normaliza campos para CasoPracticoPanel
  const statsCaso = {
    total: casoPracticoRaw.total ?? 0,
    correcta: casoPracticoRaw.correctas ?? 0,
    porOpcion: casoPracticoRaw.por_opcion ?? {},
    justificaciones: casoPracticoRaw.justificaciones ?? [],
  };
  const participantes = data?.participantes ?? null;

  return (
    <div className="min-h-screen" style={{ background: '#0a0f0a', color: '#e8e0d0' }}>
      {/* Barra superior */}
      <div style={{ background: '#0e1510', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="px-6 py-3 flex items-center gap-3">
            <p className="font-mono text-xs tracking-widest uppercase" style={{ color: '#c9a96e' }}>
              Determinantes POT
            </p>
            <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
            <p className="font-mono text-xs" style={{ color: '#9a9080' }}>Panel de docente</p>
          </div>
          <DashboardHeader
            sesionId={sesionId}
            setSesionId={setSesionId}
            participantes={participantes}
            adminKey={adminKey}
          />
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading && !data && (
          <div className="text-center py-20">
            <p className="font-mono text-sm" style={{ color: '#9a9080' }}>Cargando datos...</p>
          </div>
        )}

        {error && (
          <div
            className="rounded-xl px-4 py-3 mb-6"
            style={{ background: 'rgba(224,112,112,0.1)', border: '1px solid rgba(224,112,112,0.3)' }}
          >
            <p className="font-mono text-xs" style={{ color: '#e07070' }}>{error}</p>
          </div>
        )}

        {data && (
          <div className="space-y-8">
            {/* Estado de sesión */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: modoGlobal ? '#c9a96e' : sesion.estado === 'segunda_votacion_abierta' ? '#c9a96e' : '#5ea45e',
                  }}
                />
                <p className="font-mono text-xs" style={{ color: '#9a9080' }}>
                  {modoGlobal ? 'Mostrando todos los datos (todas las sesiones)' : 'Estado: ' + ({
                    esperando: 'Esperando participantes',
                    primera_votacion: 'Primera votación',
                    segunda_votacion_abierta: 'Segunda votación abierta',
                    cerrado: 'Cerrado',
                  }[sesion.estado] || sesion.estado || 'Activa')}
                </p>
              </div>
              <button
                onClick={() => setModoGlobal(v => !v)}
                className="font-mono text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
                style={{
                  background: modoGlobal ? 'rgba(201,169,110,0.2)' : 'rgba(255,255,255,0.05)',
                  border: modoGlobal ? '1px solid rgba(201,169,110,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  color: modoGlobal ? '#c9a96e' : '#9a9080',
                }}
              >
                {modoGlobal ? '← Ver sesión activa' : 'Ver todos los datos'}
              </button>
            </div>

            {/* Grid de postulados */}
            <div>
              <h2
                className="text-lg font-bold mb-4"
                style={{ fontFamily: '"Playfair Display", serif', color: '#e8e0d0' }}
              >
                Debate jurídico
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {POSTULADOS_IDS.map(id => (
                  <PostuladoPanel
                    key={id}
                    postuladoId={id}
                    stats={statsPostulados[id]}
                    sesionId={sesionId}
                    sesionEstado={sesion.estado}
                    adminKey={adminKey}
                  />
                ))}
              </div>
            </div>

            {/* Caso práctico */}
            <div>
              <h2
                className="text-lg font-bold mb-4"
                style={{ fontFamily: '"Playfair Display", serif', color: '#e8e0d0' }}
              >
                Caso práctico
              </h2>
              <div className="max-w-lg">
                <CasoPracticoPanel
                  stats={statsCaso}
                  sesionId={sesionId}
                  sesionEstado={sesion.estado}
                  adminKey={adminKey}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
