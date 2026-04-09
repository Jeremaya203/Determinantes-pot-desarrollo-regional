import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initFirebase } from './firebase.js';
import resultadosRouter from './routes/resultados.js';
import postuladosRouter from './routes/postulados.js';
import sesionesRouter from './routes/sesiones.js';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (Postman, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origen no permitido → ${origin}`));
    },
    methods: ['GET', 'POST', 'PATCH'],
    allowedHeaders: ['Content-Type', 'x-admin-key'],
  })
);

app.use(express.json());

// Rutas
app.get('/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));
app.use('/api/resultados', resultadosRouter);
app.use('/api/postulados', postuladosRouter);
app.use('/api/sesiones', sesionesRouter);

// 404
app.use((_req, res) => res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada.' }));

// Error handler global
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ ok: false, mensaje: err.message || 'Error interno.' });
});

// Arrancar
initFirebase();
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
