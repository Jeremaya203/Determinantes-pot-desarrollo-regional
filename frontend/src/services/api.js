const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function enviarResultado(payload) {
  const res = await fetch(`${API_URL}/api/resultados`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.mensaje || 'Error al enviar el resultado.');
  }

  return data;
}

export async function obtenerStats() {
  const res = await fetch(`${API_URL}/api/resultados/stats`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || 'Error al obtener estadísticas.');
  return data.stats;
}

export async function enviarPostulado(payload) {
  const res = await fetch(`${API_URL}/api/postulados`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || 'Error al enviar el postulado.');
  return data;
}

export async function actualizarCambioOpinion(id, segunda_posicion) {
  const res = await fetch(`${API_URL}/api/postulados/${id}/cambio`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ segunda_posicion }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || 'Error al registrar cambio de opinión.');
  return data;
}

export async function crearSesion(adminKey) {
  const res = await fetch(`${API_URL}/api/sesiones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || 'Error al crear sesión.');
  return data;
}

export async function obtenerSesion(sesionId) {
  const res = await fetch(`${API_URL}/api/sesiones/${sesionId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || 'Error al obtener sesión.');
  return data;
}

export async function actualizarSesion(sesionId, updates, adminKey) {
  const res = await fetch(`${API_URL}/api/sesiones/${sesionId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || 'Error al actualizar sesión.');
  return data;
}

export async function obtenerDashboard(sesionId, adminKey) {
  const res = await fetch(`${API_URL}/api/sesiones/${sesionId}/dashboard`, {
    headers: { 'x-admin-key': adminKey },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensaje || 'Error al obtener datos del dashboard.');
  return data;
}

