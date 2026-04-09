import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { getDb } from '../firebase.js';

const router = Router();

// Validaciones
const resultadoValidators = [
  body('tipo').optional().isIn(['escenario', 'postulado']),
  body('nombre').optional().trim().isLength({ max: 100 }),
  body('correo').optional().trim().isEmail().withMessage('Correo electrónico inválido').normalizeEmail(),
  body('escenario').trim().notEmpty().withMessage('El escenario o postulado es obligatorio'),
  body('respuesta').trim().notEmpty().withMessage('La respuesta es obligatoria'),
  body('justificacion').optional().trim().isLength({ max: 1000 }),
  body('puntaje').optional().isInt({ min: 0, max: 100 }),    body('sesion_id').optional().trim().isLength({ max: 100 }),];

// POST /api/resultados — Guardar resultado del caso práctico o postulado
router.post('/', resultadoValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ ok: false, errores: errors.array() });
  }

  try {
    const db = getDb();
    const { tipo = 'escenario', nombre = '', correo = '', escenario, respuesta, justificacion = '', puntaje = 0, sesion_id = '' } = req.body;

    // Solo los escenarios tienen lógica de correcto/incorrecto
    const respuestasCorrectas = {
      escenario_1: 'opcion_b',
      escenario_2: 'opcion_a',
      escenario_3: 'opcion_c',
    };
    const correcta = tipo === 'escenario' ? respuestasCorrectas[escenario] === respuesta : null;

    const docData = {
      tipo,
      nombre,
      correo,
      escenario,
      respuesta,
      ...(tipo === 'escenario' && { correcta }),
      justificacion,
      puntaje,
      sesion_id,
      timestamp: new Date().toISOString(),
      ip: req.ip,
    };

    const docRef = await db.collection('resultados').add(docData);

    if (tipo === 'postulado') {
      return res.status(201).json({ ok: true, id: docRef.id });
    }

    return res.status(201).json({
      ok: true,
      id: docRef.id,
      correcta,
      mensaje: correcta
        ? '¡Excelente! Tu respuesta es correcta.'
        : 'Tu respuesta no es la más adecuada. Revisa el fundamento normativo.',
    });
  } catch (err) {
    console.error('Error guardando resultado:', err);
    return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
  }
});

// GET /api/resultados — Obtener todos los resultados (solo para admin/debug)
router.get('/', async (req, res) => {
  // En producción protegerías esta ruta con un middleware de autenticación
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ ok: false, mensaje: 'No autorizado.' });
  }

  try {
    const db = getDb();
    const snapshot = await db
      .collection('resultados')
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();

    const resultados = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.json({ ok: true, total: resultados.length, resultados });
  } catch (err) {
    console.error('Error obteniendo resultados:', err);
    return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
  }
});

// GET /api/resultados/stats — Estadísticas generales (acepta ?sesion=id para filtrar)
router.get('/stats', async (req, res) => {
  try {
    const db = getDb();
    let query = db.collection('resultados');
    if (req.query.sesion) {
      query = query.where('sesion_id', '==', req.query.sesion);
    }
    const snapshot = await query.get();

    const total = snapshot.size;
    let correctas = 0;
    const porEscenario = {};

    snapshot.forEach((doc) => {
      const d = doc.data();
      if (d.correcta) correctas++;
      if (!porEscenario[d.escenario]) porEscenario[d.escenario] = { total: 0, correctas: 0 };
      porEscenario[d.escenario].total++;
      if (d.correcta) porEscenario[d.escenario].correctas++;
    });

    return res.json({
      ok: true,
      stats: {
        total,
        correctas,
        porcentajeAcierto: total > 0 ? Math.round((correctas / total) * 100) : 0,
        porEscenario,
      },
    });
  } catch (err) {
    console.error('Error calculando stats:', err);
    return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
  }
});

// GET /api/resultados/export?key=ADMIN_KEY — Descargar CSV con todos los resultados
router.get('/export', async (req, res) => {
  if (req.query.key !== process.env.ADMIN_KEY) {
    return res.status(401).json({ ok: false, mensaje: 'No autorizado.' });
  }

  try {
    const db = getDb();
    const snapshot = await db
      .collection('resultados')
      .orderBy('timestamp', 'desc')
      .get();

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = ['id', 'timestamp', 'tipo', 'nombre', 'correo', 'escenario', 'respuesta', 'correcta', 'puntaje', 'justificacion', 'ip'];
    const rows = snapshot.docs.map((doc) => {
      const d = doc.data();
      return headers.map((h) => escapeCsv(h === 'id' ? doc.id : d[h])).join(',');
    });

    const csv = [headers.join(','), ...rows].join('\r\n');
    const fecha = new Date().toISOString().slice(0, 10);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="resultados-${fecha}.csv"`);
    return res.send('\uFEFF' + csv); // BOM para que Excel lo abra con tildes correctas
  } catch (err) {
    console.error('Error exportando CSV:', err);
    return res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
  }
});

export default router;
