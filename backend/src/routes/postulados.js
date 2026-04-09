import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { getDb } from '../firebase.js';

const router = Router();

const POSTULADOS_VALIDOS = [
  'postulado_1', 'postulado_2', 'postulado_3',
  'postulado_4', 'postulado_5', 'postulado_6',
];

// POST /api/postulados — guardar respuesta de un postulado
router.post(
  '/',
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio').isLength({ min: 2, max: 100 }),
    body('postulado_id').trim().isIn(POSTULADOS_VALIDOS).withMessage('postulado_id inválido'),
    body('posicion').isIn(['acuerdo', 'desacuerdo']).withMessage('posicion debe ser acuerdo o desacuerdo'),
    body('argumento').trim().isLength({ min: 20, max: 2000 }).withMessage('El argumento debe tener mínimo 20 caracteres'),
    body('contrareplica').optional().trim().isLength({ max: 2000 }),
    body('cambio_opinion').optional().isBoolean(),
    body('segunda_posicion').optional({ nullable: true }).isIn(['acuerdo', 'desacuerdo', null]),
    body('sesion_id').optional().trim().isLength({ max: 100 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ ok: false, errores: errors.array() });
    }

    try {
      const db = getDb();
      const {
        nombre,
        postulado_id,
        posicion,
        argumento,
        contrareplica = '',
        cambio_opinion = false,
        segunda_posicion = null,
        sesion_id = '',
      } = req.body;

      const docData = {
        nombre,
        postulado_id,
        posicion,
        argumento,
        contrareplica,
        cambio_opinion,
        segunda_posicion,
        sesion_id,
        timestamp: new Date().toISOString(),
        ip: req.ip,
      };

      const docRef = await db.collection('postulados').add(docData);
      return res.status(201).json({ ok: true, id: docRef.id });
    } catch (err) {
      console.error('Error guardando postulado:', err);
      return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
    }
  }
);

// PATCH /api/postulados/:id/cambio — registrar cambio de opinión en segunda votación
router.patch(
  '/:id/cambio',
  [
    param('id').trim().notEmpty(),
    body('segunda_posicion').isIn(['acuerdo', 'desacuerdo']).withMessage('segunda_posicion inválida'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ ok: false, errores: errors.array() });
    }

    try {
      const db = getDb();
      const { id } = req.params;
      const { segunda_posicion } = req.body;

      const docRef = db.collection('postulados').doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(404).json({ ok: false, mensaje: 'Documento no encontrado.' });
      }

      const cambio_opinion = doc.data().posicion !== segunda_posicion;
      await docRef.update({ cambio_opinion, segunda_posicion });

      return res.json({ ok: true, cambio_opinion });
    } catch (err) {
      console.error('Error actualizando cambio de opinión:', err);
      return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
    }
  }
);

// GET /api/postulados/sesion/:sesionId — todos los postulados de una sesión (requiere admin key)
router.get('/sesion/:sesionId', async (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ ok: false, mensaje: 'No autorizado.' });
  }

  try {
    const db = getDb();
    const { sesionId } = req.params;

    const snapshot = await db
      .collection('postulados')
      .where('sesion_id', '==', sesionId)
      .orderBy('timestamp', 'asc')
      .get();

    const postulados = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.json({ ok: true, total: postulados.length, postulados });
  } catch (err) {
    console.error('Error obteniendo postulados de sesión:', err);
    return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
  }
});

// GET /api/postulados/stats/:sesionId — estadísticas de postulados para dashboard
router.get('/stats/:sesionId', async (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ ok: false, mensaje: 'No autorizado.' });
  }

  try {
    const db = getDb();
    const { sesionId } = req.params;

    const snapshot = await db
      .collection('postulados')
      .where('sesion_id', '==', sesionId)
      .get();

    const stats = {};
    POSTULADOS_VALIDOS.forEach((id) => {
      stats[id] = {
        acuerdo: 0,
        desacuerdo: 0,
        total: 0,
        cambios: 0,
        justificaciones: [],
        justificaciones_cambio: [],
      };
    });

    snapshot.forEach((doc) => {
      const d = doc.data();
      if (!stats[d.postulado_id]) return;
      stats[d.postulado_id].total++;
      stats[d.postulado_id][d.posicion]++;
      if (d.cambio_opinion) {
        stats[d.postulado_id].cambios++;
        if (d.contrareplica) {
          stats[d.postulado_id].justificaciones_cambio.push(d.contrareplica);
        }
      }
      if (d.argumento) {
        stats[d.postulado_id].justificaciones.push(d.argumento);
      }
    });

    return res.json({ ok: true, stats });
  } catch (err) {
    console.error('Error calculando stats de postulados:', err);
    return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
  }
});

export default router;
