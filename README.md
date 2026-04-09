# Determinantes de Superior Jerarquía — POT Colombia

Página web educativa e interactiva sobre las determinantes de superior jerarquía en el ordenamiento territorial colombiano (Ley 388 de 1997, Art. 10). Desarrollada como herramienta pedagógica con contenido normativo, debates jurídicos y un caso práctico evaluado.

---

## Arquitectura general

```
Usuario (navegador)
        │
        │  HTTP / fetch
        ▼
┌───────────────────┐        ┌──────────────────────┐
│   FRONTEND        │        │   BACKEND            │
│   React + Vite    │───────▶│   Node.js + Express  │
│   GitHub Pages    │        │   Railway            │
└───────────────────┘        └──────────┬───────────┘
                                        │ Firebase Admin SDK
                                        ▼
                             ┌──────────────────────┐
                             │   Firebase Firestore  │
                             │   (nube, plan Spark)  │
                             └──────────────────────┘
```

El frontend es un sitio estático (HTML + JS compilado). No tiene servidor propio — solo hace peticiones HTTP al backend cuando el usuario envía el caso práctico. Los postulados de debate se resuelven completamente en el navegador, sin llamadas al backend.

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React | 18.x |
| Bundler | Vite | 5.x |
| Estilos | Tailwind CSS | 3.x |
| Backend | Node.js + Express | Express 4.x |
| Base de datos | Firebase Firestore | Admin SDK 12.x |
| Deploy frontend | GitHub Pages (via gh-pages) | — |
| Deploy backend | Railway | — |
| CI/CD | GitHub Actions | — |

---

## Estructura del proyecto

```
determinantes-pot/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← CI/CD automático a GitHub Pages
├── frontend/
│   ├── package.json
│   ├── vite.config.js          ← base: '/determinantes-pot/'
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx             ← composición de secciones
│       ├── index.css           ← variables CSS + Tailwind
│       ├── hooks/
│       │   └── useScrollAnimation.js
│       ├── services/
│       │   └── api.js          ← fetch al backend
│       └── components/
│           ├── Navbar.jsx
│           ├── Hero.jsx
│           ├── IntroSection.jsx
│           ├── ClasificacionSection.jsx
│           ├── PracticaSection.jsx
│           ├── FinalidadSection.jsx
│           ├── TensionSection.jsx
│           ├── PostuladosSection.jsx   ← 6 postulados de debate (sin backend)
│           ├── ActividadSection.jsx    ← caso práctico evaluado (guarda en Firebase)
│           ├── BibliografiaSection.jsx ← referencias APA
│           └── Footer.jsx
└── backend/
    ├── package.json
    ├── .env.example
    ├── .gitignore
    └── src/
        ├── index.js            ← servidor Express, CORS, rutas
        ├── firebase.js         ← inicialización Firebase Admin SDK
        └── routes/
            └── resultados.js   ← todos los endpoints de la API
```

---

## Secciones del sitio

| # | Sección | Componente | Descripción |
|---|---------|-----------|-------------|
| — | Hero | `Hero.jsx` | Portada con título y bajada |
| 01 | Introducción | `IntroSection.jsx` | Definición, Ley 388/97, justificación de la jerarquía |
| 02 | Clasificación | `ClasificacionSection.jsx` | Niveles 1, 2 y 3 de determinantes |
| 03 | Práctica | `PracticaSection.jsx` | POT/PBOT/EOT, rol de las CAR, concertación |
| 04 | Finalidad | `FinalidadSection.jsx` | Objetivos estratégicos del sistema |
| 05 | Tensión | `TensionSection.jsx` | Autonomía municipal vs. unidad nacional, glosario |
| 06 | Debate | `PostuladosSection.jsx` | 6 postulados controversiales, dos rondas de debate |
| 07 | Actividad | `ActividadSection.jsx` | Caso práctico evaluado, guarda resultado en Firebase |
| 08 | Bibliografía | `BibliografiaSection.jsx` | 6 referencias en formato APA |

---

## Cómo funciona cada sección interactiva

### PostuladosSection — Debate jurídico (sin backend)

Toda la lógica ocurre en el navegador. Cada tarjeta tiene su propia máquina de estados:

```
pendiente → expandido → posicion_elegida → replica_mostrada → contrareplica → cerrado
```

- **Ronda 1:** el usuario elige "De acuerdo" o "En desacuerdo", escribe un argumento (mínimo 20 caracteres) y recibe una réplica jurídica hardcodeada según su posición.
- **Ronda 2:** puede escribir una contraréplica o saltar directamente a la conclusión. Al terminar se revela el cierre jurídico y la tarjeta se marca con ✓.
- Al completar los 6 postulados aparece un banner con enlace al caso práctico.
- **No se guarda nada en Firebase.** Es una actividad de reflexión, no de evaluación.

### ActividadSection — Caso práctico (con backend)

El usuario lee el escenario del municipio de Río Verde, selecciona una opción (A/B/C), escribe una justificación e ingresa nombre y correo. Al enviar:

1. El frontend llama a `POST /api/resultados` con los datos.
2. El backend valida, evalúa si la respuesta es correcta y guarda el documento en Firestore.
3. El frontend muestra retroalimentación inmediata con la explicación jurídica.

La respuesta correcta es `opcion_b` (hardcodeada en `backend/src/routes/resultados.js`).

---

## API del backend

Base URL local: `http://localhost:3001`
Base URL producción: `https://tu-backend.up.railway.app`

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/health` | — | Estado del servidor |
| POST | `/api/resultados` | — | Guardar resultado del caso práctico |
| GET | `/api/resultados` | Header `x-admin-key` | Listar todos los resultados (JSON) |
| GET | `/api/resultados/stats` | — | Estadísticas de aciertos por escenario |
| GET | `/api/resultados/export?key=ADMIN_KEY` | Query param | Descargar todos los resultados en CSV |

### POST `/api/resultados` — body

```json
{
  "tipo": "escenario",
  "nombre": "Ana García",
  "correo": "ana@ejemplo.com",
  "escenario": "escenario_1",
  "respuesta": "opcion_b",
  "justificacion": "Porque las rondas hídricas son determinantes de Nivel 1...",
  "puntaje": 100
}
```

El campo `tipo` puede ser `"escenario"` (tiene lógica de correcto/incorrecto) o `"postulado"` (no aplica). Para escenarios, `nombre` y `correo` son obligatorios.

### Colección Firestore: `resultados`

```
resultados/
└── {auto-id}/
    ├── tipo:          "escenario"
    ├── nombre:        string
    ├── correo:        string
    ├── escenario:     "escenario_1"
    ├── respuesta:     "opcion_a" | "opcion_b" | "opcion_c"
    ├── correcta:      boolean
    ├── justificacion: string
    ├── puntaje:       0–100
    ├── timestamp:     ISO 8601
    └── ip:            string
```

---

## Flujo de datos completo

```
[Usuario llena el caso práctico]
         │
         ▼
[React valida el formulario localmente]
         │
         ▼
[fetch POST → http://backend/api/resultados]
         │
         ▼
[Express recibe, valida con express-validator]
         │
         ▼
[Compara respuesta con respuestasCorrectas{}]
         │
         ▼
[Firebase Admin SDK guarda el documento]
         │
         ▼
[Express responde: { ok, correcta, mensaje }]
         │
         ▼
[React muestra la explicación jurídica al usuario]
```

---

## Variables de entorno

### `backend/.env`

```
PORT=3001
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
FIREBASE_PROJECT_ID=determinantes-pot
ALLOWED_ORIGINS=http://localhost:5173
ADMIN_KEY=tu-clave-secreta
```

En producción (Railway) se usa `FIREBASE_SERVICE_ACCOUNT_JSON` con el contenido del JSON como string, en lugar de la ruta al archivo.

### `frontend/.env`

```
VITE_API_URL=http://localhost:3001
```

En producción se configura como secret de GitHub Actions (`VITE_API_URL = https://tu-backend.up.railway.app`) y se inyecta durante el build.

---

## Archivos que NUNCA van a GitHub

```
backend/.env
backend/firebase-service-account.json
frontend/.env
node_modules/     (en ambas carpetas)
dist/             (en frontend)
```

Todos están cubiertos por los `.gitignore` existentes.

---

## CI/CD — GitHub Actions

El archivo `.github/workflows/deploy.yml` se activa en cada `push` a `main` que toque algún archivo dentro de `frontend/`. Hace:

1. Checkout del repo
2. Instala dependencias (`npm ci`)
3. Build (`npm run build`) inyectando el secret `VITE_API_URL`
4. Publica la carpeta `frontend/dist/` en la rama `gh-pages`

El frontend queda disponible en `https://TU_USUARIO.github.io/determinantes-pot/`.

---

## Cómo correr el proyecto localmente

```bash
# 1. Instalar dependencias
cd backend && npm install
cd ../frontend && npm install

# 2. Configurar variables de entorno
cd backend && cp .env.example .env   # editar con datos reales
cd ../frontend && cp .env.example .env

# 3. Poner el JSON de Firebase en backend/firebase-service-account.json

# 4. Levantar backend (terminal 1)
cd backend && npm run dev
# → http://localhost:3001

# 5. Levantar frontend (terminal 2)
cd frontend && npm run dev
# → http://localhost:5173/determinantes-pot/
```

---

## Cómo ver los resultados como administrador

### Ver en Firebase Console
[console.firebase.google.com](https://console.firebase.google.com) → proyecto `determinantes-pot` → **Firestore Database** → colección `resultados`

### Descargar CSV (Excel)

Abre en el navegador (reemplaza `TU_KEY` con el valor de `ADMIN_KEY`):

```
# Local
http://localhost:3001/api/resultados/export?key=TU_KEY

# Producción
https://tu-backend.up.railway.app/api/resultados/export?key=TU_KEY
```

Se descarga `resultados-FECHA.csv` con columnas: `id`, `timestamp`, `tipo`, `nombre`, `correo`, `escenario`, `respuesta`, `correcta`, `puntaje`, `justificacion`, `ip`.

### Ver estadísticas (sin clave)

```
http://localhost:3001/api/resultados/stats
```

---

## Deploy a producción

### Frontend → GitHub Pages

1. Crear repo en GitHub con nombre exacto `determinantes-pot`
2. Subir el código (`git init`, `git push`)
3. En GitHub → **Settings → Pages → Source: gh-pages**
4. Añadir secret `VITE_API_URL` en **Settings → Secrets → Actions**
5. El workflow se activa automáticamente con el siguiente push a `main`

### Backend → Railway

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
2. **Settings → Root Directory:** `backend`
3. Añadir variables de entorno:
   - `FIREBASE_SERVICE_ACCOUNT_JSON` = contenido completo del JSON
   - `FIREBASE_PROJECT_ID` = `determinantes-pot`
   - `ALLOWED_ORIGINS` = `https://TU_USUARIO.github.io`
   - `ADMIN_KEY` = tu clave secreta
4. Railway asigna una URL pública automáticamente
5. Copiar esa URL como valor del secret `VITE_API_URL` en GitHub

---

## Decisiones de diseño

- **Postulados sin backend:** el debate jurídico es una actividad de aprendizaje, no de evaluación. No tiene sentido acumular texto libre en Firestore sin contexto de quién lo escribió.
- **CSV con BOM:** el endpoint de exportación antepone `\uFEFF` al CSV para que Excel en Windows abra el archivo con tildes y ñ correctas sin configuración adicional.
- **CORS restrictivo:** el backend solo acepta peticiones de los orígenes definidos en `ALLOWED_ORIGINS`. En producción esto bloquea cualquier intento de llamar a la API desde dominios no autorizados.
- **Reglas Firestore en modo producción:** el frontend nunca escribe directo a Firestore. Solo el backend usa Firebase Admin SDK, que ignora las reglas de seguridad. Esto significa que aunque las reglas bloqueen todo acceso público, la API funciona correctamente.
```

## Stack

| Capa | Tecnología | Deploy |
|------|-----------|--------|
| Frontend | React 18 + Vite + Tailwind | GitHub Pages |
| Backend | Node.js + Express | Railway / Render |
| Base de datos | Firebase Firestore | Firebase (plan Spark) |

## Setup Rápido

### 1. Clonar el repo
```bash
git clone https://github.com/TU_USUARIO/determinantes-pot.git
cd determinantes-pot
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env   # Llenar con credenciales de Firebase
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env   # Llenar VITE_API_URL
npm run dev
```

## Configuración de Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar **Firestore Database** (modo producción)
3. Ir a Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada
4. Guardar el JSON y referenciar su ruta en `FIREBASE_SERVICE_ACCOUNT_PATH` (o pegar el contenido en `FIREBASE_SERVICE_ACCOUNT_JSON`)

## Deploy

### Frontend → GitHub Pages
```bash
cd frontend
npm run build
npm run deploy   # Requiere gh-pages instalado
```

### Backend → Railway
1. Conectar el repo en [railway.app](https://railway.app)
2. Seleccionar la carpeta `/backend` como root
3. Agregar las variables de entorno del `.env`

## Colección Firestore

**`resultados`**
```json
{
  "nombre": "Ana García",
  "correo": "ana@ejemplo.com",
  "escenario": "escenario_1",
  "respuesta": "opcion_b",
  "correcta": true,
  "justificacion": "Texto libre del usuario",
  "puntaje": 85,
  "timestamp": "2025-01-15T10:30:00Z"
}
```
