import { useState } from 'react';

// Lee el sesion_id de la URL (?sesion=xxx) o genera uno aleatorio por sesión
function getSesionId() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('sesion');
  if (fromUrl) return fromUrl;
  return crypto.randomUUID();
}

// Valor calculado una sola vez al cargar la app
export const sesionId = getSesionId();

export function useRegistro() {
  const [nombre, setNombre] = useState('');
  const [registrado, setRegistrado] = useState(false);

  const registrar = (nuevoNombre) => {
    const trimmed = nuevoNombre.trim();
    if (trimmed.length >= 2) {
      setNombre(trimmed);
      setRegistrado(true);
    }
  };

  return { nombre, registrado, registrar };
}
