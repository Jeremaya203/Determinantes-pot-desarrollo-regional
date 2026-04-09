import { useState } from 'react';

const DASHBOARD_PASSWORD = import.meta.env.VITE_DASHBOARD_PASSWORD || '';

export default function DashboardLogin({ onLogin }) {
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (clave === DASHBOARD_PASSWORD && DASHBOARD_PASSWORD !== '') {
      onLogin(clave);
    } else {
      setError('Clave incorrecta.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: '#0e1510' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 space-y-6"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(201,169,110,0.25)',
        }}
      >
        <div className="space-y-1">
          <p
            className="font-mono text-xs tracking-widest uppercase"
            style={{ color: '#c9a96e' }}
          >
            Panel de docente
          </p>
          <h1
            className="text-2xl font-bold"
            style={{ fontFamily: '"Playfair Display", serif', color: '#e8e0d0' }}
          >
            Dashboard
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="dash-clave"
              className="block font-mono text-xs tracking-widest uppercase"
              style={{ color: '#9a9080' }}
            >
              Contraseña
            </label>
            <input
              id="dash-clave"
              type="password"
              value={clave}
              onChange={(e) => { setClave(e.target.value); setError(''); }}
              autoFocus
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#e8e0d0',
              }}
            />
          </div>

          {error && (
            <p className="font-mono text-xs" style={{ color: '#e07070' }}>{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-mono text-sm tracking-wider uppercase"
            style={{
              background: 'rgba(201,169,110,0.2)',
              border: '1px solid rgba(201,169,110,0.5)',
              color: '#c9a96e',
              cursor: 'pointer',
            }}
          >
            Acceder →
          </button>
        </form>
      </div>
    </div>
  );
}
