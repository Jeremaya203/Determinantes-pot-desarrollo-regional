# CLAUDE.md — Determinantes de Superior Jerarquía (POT Colombia)

## Contexto del proyecto

Página web educativa e interactiva sobre las **determinantes de superior jerarquía** en el ordenamiento territorial colombiano (Ley 388 de 1997, Art. 10). Incluye una presentación por secciones y un caso práctico final donde el usuario responde, ingresa su nombre/correo, y el resultado se guarda en Firebase Firestore.

El desarrollador principal maneja Python como lenguaje principal y está aprendiendo JavaScript. Priorizar explicaciones claras cuando se hagan cambios.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express (ES Modules) |
| Base de datos | Firebase Firestore (plan Spark gratuito) |
| Deploy frontend | GitHub Pages (via gh-pages + GitHub Actions) |
| Deploy backend | Railway o Render (gratuito) |

---

## Estructura del proyecto

```
determinantes-pot/
├── CLAUDE.md                          ← este archivo
├── README.md
├── .gitignore
├── .github/
│   └── workflows/
│       └── deploy.yml                 ← CI/CD automático a GitHub Pages
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js                 ← base: '/determinantes-pot/' (nombre del repo)
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── .env.example                   ← copiar a .env
│   └── src/
│       ├── main.jsx                   ← entrada React
│       ├── App.jsx                    ← composición de secciones
│       ├── index.css                  ← variables CSS + Tailwind
│       ├── hooks/
│       │   └── useScrollAnimation.js  ← IntersectionObserver para animaciones
│       ├── services/
│       │   └── api.js                 ← fetch al backend
│       └── components/
│           ├── Navbar.jsx
│           ├── Hero.jsx
│           ├── IntroSection.jsx       ← Sección 1: introducción y marco normativo
│           ├── ClasificacionSection.jsx ← Sección 2: niveles 1, 2 y 3
│           ├── PracticaSection.jsx    ← Sección 3: instrumentos y CAR
│           ├── FinalidadSection.jsx   ← Sección 4: objetivos estratégicos
│           ├── TensionSection.jsx     ← Sección 5: autonomía vs unidad + glosario
│           ├── ActividadSection.jsx   ← Sección 6: caso práctico interactivo
│           └── Footer.jsx
│
└── backend/
    ├── package.json
    ├── .env.example                   ← copiar a .env
    ├── .gitignore
    └── src/
        ├── index.js                   ← servidor Express
        ├── firebase.js                ← inicialización Firebase Admin SDK
        └── routes/
            └── resultados.js          ← POST /api/resultados, GET /api/resultados/stats
```

---

## Setup inicial (hacer una sola vez)

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/TU_USUARIO/determinantes-pot.git
cd determinantes-pot

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configurar Firebase

1. Ir a [console.firebase.google.com](https://console.firebase.google.com)
2. Crear proyecto → nombre libre (ej: `determinantes-pot`)
3. En el proyecto: **Firestore Database** → Crear base de datos → Modo producción → Ubicación `us-east1`
4. **Configuración del proyecto** (ícono ⚙️) → **Cuentas de servicio** → **Generar nueva clave privada**
5. Guardar el JSON descargado como `backend/firebase-service-account.json`
6. ⚠️ Este archivo está en `.gitignore` — nunca subirlo a GitHub

### 3. Configurar variables de entorno

```bash
# Backend
cd backend
cp .env.example .env
```

Editar `backend/.env`:
```
PORT=3001
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
FIREBASE_PROJECT_ID=tu-project-id-de-firebase
ALLOWED_ORIGINS=http://localhost:5173
ADMIN_KEY=una-clave-secreta-cualquiera
```

```bash
# Frontend
cd frontend
cp .env.example .env
```

Editar `frontend/.env`:
```
VITE_API_URL=http://localhost:3001
```

---

## Comandos de desarrollo

```bash
# Levantar backend (desde /backend)
npm run dev        # nodemon, recarga automática

# Levantar frontend (desde /frontend)
npm run dev        # Vite, abre en http://localhost:5173

# Build del frontend
npm run build

# Deploy manual a GitHub Pages (desde /frontend)
npm run deploy
```

---

## API del backend

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Verificar que el servidor está activo |
| POST | `/api/resultados` | Guardar resultado del caso práctico |
| GET | `/api/resultados` | Listar resultados (requiere header `x-admin-key`) |
| GET | `/api/resultados/stats` | Estadísticas de aciertos por escenario |

### Body del POST `/api/resultados`
```json
{
  "nombre": "Ana García",
  "correo": "ana@ejemplo.com",
  "escenario": "escenario_1",
  "respuesta": "opcion_b",
  "justificacion": "Porque las rondas hídricas son determinantes de Nivel 1...",
  "puntaje": 100
}
```

### Respuesta
```json
{
  "ok": true,
  "id": "abc123",
  "correcta": true,
  "mensaje": "¡Excelente! Tu respuesta es correcta."
}
```

---

## Deploy a producción

### Frontend → GitHub Pages

1. En `frontend/vite.config.js`, verificar que `base` coincide con el nombre del repo:
   ```js
   base: '/determinantes-pot/',
   ```
2. En GitHub → repo → **Settings → Pages → Source: Deploy from branch → gh-pages**
3. En GitHub → repo → **Settings → Secrets → Actions**, agregar:
   - `VITE_API_URL` = URL del backend en producción (ej: `https://mi-backend.up.railway.app`)
4. Cada `git push` a `main` que toque `/frontend` dispara el workflow automáticamente.

### Backend → Railway

1. Ir a [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
2. Seleccionar el repo → en **Settings → Root Directory** poner `backend`
3. En **Variables**, agregar todas las del `.env` de producción:
   - `FIREBASE_SERVICE_ACCOUNT_JSON` = pegar el contenido completo del JSON (como string)
   - `FIREBASE_PROJECT_ID`
   - `ALLOWED_ORIGINS` = `https://TU_USUARIO.github.io`
   - `ADMIN_KEY`
4. Railway asigna automáticamente una URL pública.

---

## Colección Firestore: `resultados`

```
resultados/
└── {auto-id}/
    ├── nombre: string
    ├── correo: string
    ├── escenario: string       ("escenario_1")
    ├── respuesta: string       ("opcion_a" | "opcion_b" | "opcion_c")
    ├── correcta: boolean
    ├── justificacion: string
    ├── puntaje: number         (0–100)
    ├── timestamp: string       (ISO 8601)
    └── ip: string
```

---

## Contenido del documento fuente

El documento de Fabián López cubre exactamente estos 6 temas (uno por sección):

1. **Introducción y Marco Normativo** — definición, Ley 388/97, Ley 2294/23, justificación de la jerarquía
2. **Clasificación y Tipos** — Nivel 1 (ambiental/riesgo), Nivel 2 (alimentario/rural), Nivel 3 (infraestructura/patrimonio)
3. **Cómo Funcionan en la Práctica** — POT/PBOT/EOT, rol de las CAR, 30 días de concertación, consecuencias de contradicción
4. **Finalidad y Objetivos** — tabla: sostenibilidad, gestión del riesgo, seguridad alimentaria, preservación cultural, articulación estatal
5. **Tensión con la Autonomía Municipal** — Art. 287 CP, C-138/2020, rigor subsidiario, gradación normativa, retos actuales
6. **Glosario** — determinante, concertación ambiental, suelo de protección, plusvalía

No agregar contenido externo al documento. Todo lo que se muestra en la web debe venir de allí.

---

## Tareas pendientes

- [ ] Verificar que `vite.config.js` tenga el nombre correcto del repo en `base`
- [ ] Crear proyecto Firebase y descargar credenciales
- [ ] Completar `backend/.env` con datos reales
- [ ] Probar flujo completo local: frontend → backend → Firestore
- [ ] Subir repo a GitHub y activar GitHub Pages
- [ ] Deploy del backend en Railway
- [ ] Agregar secret `VITE_API_URL` en GitHub para el workflow
- [ ] Verificar que el caso práctico guarda correctamente en Firestore

---

## Notas para Claude Code

- El desarrollador viene de Python: cuando expliques patrones JS, haz analogías con Python si aplica.
- No agregar librerías nuevas sin justificación. El proyecto ya tiene todo lo necesario.
- El estilo visual está definido por variables CSS en `src/index.css`. No cambiar la paleta sin confirmación.
- La respuesta correcta del caso práctico es `opcion_b`. Está hardcodeada en `backend/src/routes/resultados.js` en el objeto `respuestasCorrectas`.
- Si se agregan más escenarios, hacerlo en `ActividadSection.jsx` (frontend) y en `respuestasCorrectas` (backend).
