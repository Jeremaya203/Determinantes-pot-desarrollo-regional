import { useState } from 'react';

export default function RegistroModal({ onRegistrar }) {
  const [nombre, setNombre] = useState('');

  const valido = nombre.trim().length >= 2;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (valido) onRegistrar(nombre.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: 'rgba(8,13,9,0.92)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 space-y-6"
        style={{
          background: '#0e1510',
          border: '1px solid rgba(201,169,110,0.3)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}
      >
        {/* Encabezado */}
        <div className="space-y-2">
          <p className="font-mono text-xs tracking-widest uppercase" style={{ color: '#c9a96e' }}>
            Actividades interactivas
          </p>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: '"Playfair Display", serif', color: '#e8e0d0' }}
          >
            Antes de comenzar
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#9a9080' }}>
            Las actividades registran tu participación. Solo necesitamos tu nombre.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="registro-nombre"
              className="block font-mono text-xs tracking-widest uppercase"
              style={{ color: '#9a9080' }}
            >
              Tu nombre
            </label>
            <input
              id="registro-nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: María González"
              autoFocus
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#e8e0d0',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => (e.target.style.border = '1px solid rgba(201,169,110,0.5)')}
              onBlur={(e) => (e.target.style.border = '1px solid rgba(255,255,255,0.1)')}
            />
          </div>

          <button
            type="submit"
            disabled={!valido}
            className="w-full py-3.5 rounded-xl font-mono text-sm tracking-wider uppercase transition-all duration-200"
            style={{
              background: valido ? 'rgba(201,169,110,0.2)' : 'rgba(255,255,255,0.04)',
              border: valido ? '1px solid rgba(201,169,110,0.5)' : '1px solid rgba(255,255,255,0.1)',
              color: valido ? '#c9a96e' : '#9a9080',
              cursor: valido ? 'pointer' : 'not-allowed',
            }}
          >
            Comenzar actividades →
          </button>
        </form>
      </div>
    </div>
  );
}
