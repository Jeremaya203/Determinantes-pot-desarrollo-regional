import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { getDb } from '../firebase.js';

const router = Router();

// POST /api/sesiones — crear nueva sesión
router.post('/', async (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ ok: false, mensaje: 'No autorizado.' });
  }

  try {
    const db = getDb();
    const sesionId = crypto.randomUUID();

    const docData = {
      sesion_id: sesionId,
      creada_en: new Date().toISOString(),
      postulado_activo: null,
      estado: 'esperando',
      resultados_visibles: false,
    };

    await db.collection('sesiones').doc(sesionId).set(docData);
    return res.status(201).json({ ok: true, sesion_id: sesionId });
  } catch (err) {
    console.error('Error creando sesión:', err);
    return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
  }
});

// GET /api/sesiones/:id — leer estado actual de la sesión (público, lo leen los estudiantes)
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;

    const doc = await db.collection('sesiones').doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ ok: false, mensaje: 'Sesión no encontrada.' });
    }

    const { postulado_activo, estado, resultados_visibles } = doc.data();
    return res.json({ ok: true, postulado_activo, estado, resultados_visibles });
  } catch (err) {
    console.error('Error leyendo sesión:', err);
    return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
  }
});

// PATCH /api/sesiones/:id — actualizar estado de la sesión (docente)
router.patch(
  '/:id',
  [
    param('id').trim().notEmpty(),
    body('postulado_activo').optional({ nullable: true }),
    body('estado').optional().isIn(['esperando', 'primera_votacion', 'segunda_votacion_abierta', 'cerrado']),
    body('resultados_visibles').optional().isBoolean(),
  ],
  async (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ ok: false, mensaje: 'No autorizado.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ ok: false, errores: errors.array() });
    }

    try {
      const db = getDb();
      const { id } = req.params;

      const docRef = db.collection('sesiones').doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(404).json({ ok: false, mensaje: 'Sesión no encontrada.' });
      }

      const updates = {};
      if (req.body.postulado_activo !== undefined) updates.postulado_activo = req.body.postulado_activo;
      if (req.body.estado !== undefined) updates.estado = req.body.estado;
      if (req.body.resultados_visibles !== undefined) updates.resultados_visibles = req.body.resultados_visibles;

      await docRef.update(updates);
      return res.json({ ok: true });
    } catch (err) {
      console.error('Error actualizando sesión:', err);
      return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
    }
  }
);

// GET /api/sesiones/:id/dashboard — datos completos para el dashboard (requiere admin key)
// Usar id='global' para ver todos los datos sin filtro de sesión
router.get('/:id/dashboard', async (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ ok: false, mensaje: 'No autorizado.' });
  }

  try {
    const db = getDb();
    const { id } = req.params;
    const isGlobal = id === 'global';

    const postuladosQuery = isGlobal
      ? db.collection('postulados').get()
      : db.collection('postulados').where('sesion_id', '==', id).get();

    const resultadosQuery = isGlobal
      ? db.collection('resultados').get()
      : db.collection('resultados').where('sesion_id', '==', id).get();

    const sesionPromise = isGlobal ? Promise.resolve(null) : db.collection('sesiones').doc(id).get();

    const [sesionDoc, postuladosSnap, resultadosSnap] = await Promise.all([
      sesionPromise,
      postuladosQuery,
      resultadosQuery,
    ]);

    if (!isGlobal && !sesionDoc.exists) {
      return res.status(404).json({ ok: false, mensaje: 'Sesión no encontrada.' });
    }

    const sesion = isGlobal ? { estado: 'global', resultados_visibles: true } : sesionDoc.data();

    // Estadísticas de postulados
    const POSTULADOS_VALIDOS = [
      'postulado_1', 'postulado_2', 'postulado_3',
      'postulado_4', 'postulado_5', 'postulado_6',
    ];
    const statsPostulados = {};
    POSTULADOS_VALIDOS.forEach((pid) => {
      statsPostulados[pid] = { acuerdo: 0, desacuerdo: 0, total: 0, cambios: 0, justificaciones: [], justificaciones_cambio: [] };
    });

    postuladosSnap.forEach((doc) => {
      const d = doc.data();
      if (!statsPostulados[d.postulado_id]) return;
      statsPostulados[d.postulado_id].total++;
      statsPostulados[d.postulado_id][d.posicion]++;
      if (d.cambio_opinion) statsPostulados[d.postulado_id].cambios++;
      if (d.argumento) statsPostulados[d.postulado_id].justificaciones.push(d.argumento);
      if (d.cambio_opinion && d.contrareplica) statsPostulados[d.postulado_id].justificaciones_cambio.push(d.contrareplica);
    });

    // Estadísticas del caso práctico
    let totalResultados = 0;
    let correctas = 0;
    const porOpcion = { opcion_a: 0, opcion_b: 0, opcion_c: 0 };
    const justificacionesCaso = [];

    resultadosSnap.forEach((doc) => {
      const d = doc.data();
      if (d.tipo !== 'escenario') return;
      totalResultados++;
      if (d.correcta) correctas++;
      if (porOpcion[d.respuesta] !== undefined) porOpcion[d.respuesta]++;
      if (d.justificacion) justificacionesCaso.push({ respuesta: d.respuesta, texto: d.justificacion });
    });

    const participantes = new Set([
      ...postuladosSnap.docs.map((d) => d.data().nombre),
      ...resultadosSnap.docs.map((d) => d.data().nombre),
    ]).size;

    return res.json({
      ok: true,
      sesion,
      participantes,
      postulados: statsPostulados,
      caso_practico: {
        total: totalResultados,
        correctas,
        por_opcion: porOpcion,
        justificaciones: justificacionesCaso,
      },
    });
  } catch (err) {
    console.error('Error obteniendo datos del dashboard:', err);
    return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
  }
});

export default router;
