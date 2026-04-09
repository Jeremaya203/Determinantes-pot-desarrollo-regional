import { useState, useEffect, useRef } from 'react';
import { obtenerDashboard } from '../services/api';

export function useDashboardData(sesionId, adminKey) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const pollingRef = useRef(null);

  useEffect(() => {
    if (!sesionId || !adminKey) return;

    const poll = async () => {
      try {
        const res = await obtenerDashboard(sesionId, adminKey);
        setData(res);
        setError('');
      } catch (e) {
        setError(e.message || 'Error al obtener datos.');
      } finally {
        setLoading(false);
      }
    };

    poll();
    pollingRef.current = setInterval(poll, 2000);
    return () => clearInterval(pollingRef.current);
  }, [sesionId, adminKey]);

  return { data, error, loading };
}
