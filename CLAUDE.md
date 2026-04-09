# Documentación completa — App interactiva Determinantes POT

## Resumen del proyecto

Aplicación web interactiva para una clase universitaria sobre determinantes del POT (Plan de Ordenamiento Territorial) en Colombia. Los estudiantes debaten 6 casos reales colombianos con sistema de votación en tiempo real. El docente controla la sesión desde un dashboard.

---

## Arquitectura

```
Frontend (React + Vite)          Backend (Express + Node.js)         Base de datos
GitHub Pages                  →  Render.com                      →   Firebase Firestore
jeremaya203.github.io/...        onrender.com                        Google Cloud
```

### URLs de producción
- **App estudiantes:** `https://jeremaya203.github.io/Determinantes-pot-desarrollo-regional/`
- **Dashboard docente:** `https://jeremaya203.github.io/Determinantes-pot-desarrollo-regional/dashboard`
- **Backend API:** `https://determinantes-pot-desarrollo-regional.onrender.com`
- **Repositorio:** `https://github.com/Jeremaya203/Determinantes-pot-desarrollo-regional`

---

## Estructura de archivos

```
determinantes/
├── .github/workflows/deploy.yml     # CI/CD → GitHub Pages
├── frontend/
│   ├── src/
│   │   ├── App.jsx                  # Routing, estado nombre, IntersectionObserver
│   │   ├── components/
│   │   │   ├── PostuladosSection.jsx    # 6 casos colombianos + votación
│   │   │   ├── RegistroModal.jsx        # Modal para capturar nombre
│   │   │   └── ... (Hero, Navbar, etc.)
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.jsx        # Página principal del dashboard
│   │   │   ├── DashboardLogin.jsx
│   │   │   ├── DashboardHeader.jsx
│   │   │   ├── PostuladoPanel.jsx       # Panel de votos por postulado
│   │   │   ├── CasoPracticoPanel.jsx
│   │   │   ├── JustificacionesCarousel.jsx
│   │   │   └── useDashboardData.js      # Hook polling cada 2s
│   │   ├── hooks/
│   │   │   └── useRegistro.js           # sesionId (constante exportada)
│   │   └── services/api.js
│   ├── vite.config.js               # base: '/Determinantes-pot-desarrollo-regional/'
│   └── .env.example
├── backend/
│   ├── src/
│   │   ├── index.js                 # Servidor Express
│   │   ├── firebase.js              # Firebase Admin SDK
│   │   └── routes/
│   │       ├── postulados.js
│   │       ├── resultados.js
│   │       └── sesiones.js          # Incluye endpoint /global/dashboard
│   └── .env.example
├── render.yaml                      # Config deploy Render
└── .gitignore                       # Excluye: .env, firebase-service-account.json
```

---

## Base de datos — Firestore

### Colecciones

**`sesiones`**
```json
{ "sesion_id": "uuid", "creada_en": "timestamp", "estado": "esperando|..." }
```

**`postulados`**
```json
{
  "sesion_id": "uuid", "nombre": "Juan", "caso_id": 1,
  "voto": "acuerdo|desacuerdo", "justificacion": "texto",
  "segunda_votacion": "acuerdo|desacuerdo", "justificacion_cambio": "texto"
}
```

**`resultados`**
```json
{
  "sesion_id": "uuid", "nombre": "Juan",
  "caso_practico": { "respuesta": "A|B|C|D", "justificacion": "texto" }
}
```

---

## Backend — API REST

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/api/sesiones` | Crear sesión |
| GET | `/api/sesiones/:id` | Estado de sesión |
| PATCH | `/api/sesiones/:id` | Actualizar estado |
| GET | `/api/sesiones/:id/dashboard` | Datos completos dashboard |
| GET | `/api/sesiones/global/dashboard` | Todos los datos (sin filtro) |
| POST | `/api/postulados` | Registrar voto |
| GET | `/api/postulados/:sesion_id` | Votos de sesión |
| POST | `/api/resultados` | Registrar caso práctico |

### Variables de entorno backend
```env
PORT=3001
NODE_ENV=production
ADMIN_KEY=Jeremaya203%%
FIREBASE_PROJECT_ID=determinantes-pot
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
ALLOWED_ORIGINS=https://jeremaya203.github.io
```

### CORS
- Métodos: `GET, POST, PATCH`
- Headers: `Content-Type, x-admin-key`
- Orígenes: variable `ALLOWED_ORIGINS` separados por coma

---

## Frontend

### Variables de entorno
```env
VITE_API_URL=https://determinantes-pot-desarrollo-regional.onrender.com
VITE_DASHBOARD_PASSWORD=Jeremaya203%%
```

### GitHub Secrets requeridos
| Secret | Valor |
|--------|-------|
| `VITE_API_URL` | `https://determinantes-pot-desarrollo-regional.onrender.com` |
| `VITE_DASHBOARD_PASSWORD` | `Jeremaya203%%` |

### sesionId
- Constante exportada desde `useRegistro.js` (NO es un hook)
- Lee `?sesion=UUID` de la URL o genera uno nuevo con `crypto.randomUUID()`
- El docente comparte `?sesion=UUID` para agrupar estudiantes

### ID especial `'global'` en dashboard
- `GET /api/sesiones/global/dashboard` omite el filtro por sesión
- Devuelve todos los documentos de la base de datos
- Se activa automáticamente al hacer login

---

## CI/CD — GitHub Actions

**Trigger:** cualquier push a `main` + manual (`workflow_dispatch`)

**Pasos:**
1. Checkout → Setup Node 20 → `npm ci`
2. `npm run build` con secrets como env vars
3. Copia `index.html` → `404.html` (fix SPA routing en GitHub Pages)
4. Deploy a rama `gh-pages`

**Por qué el 404.html:** GitHub Pages no soporta SPA routing. Sin este archivo, entrar directamente a `/dashboard` devuelve 404.

---

## Deploy — Render.com (backend)

- **Plan:** Free ($0/mes)
- **rootDir:** `backend/`
- **Build:** `npm install`
- **Start:** `node src/index.js`
- **Health check:** `/health`

**Nota plan Free:** El servicio se duerme tras 15 min de inactividad. Primera petición tarda 30-50s. Abrir el dashboard antes de clase para despertarlo.

---

## Firebase

- **Proyecto:** `determinantes-pot`
- **SDK:** Firebase Admin SDK 12 (solo en backend)
- **Credenciales:** `FIREBASE_SERVICE_ACCOUNT_JSON` en variables de entorno de Render
- **Archivo local:** `backend/firebase-service-account.json` (en .gitignore, nunca al repo)

**Seguridad:** Si la clave privada se expone: revocarla en Firebase Console → Proyecto → Cuentas de servicio.

---

## Bugs resueltos

| Bug | Causa | Solución |
|-----|-------|----------|
| PostuladosSection encoding corrupto | UTF-8 doble-codificado como Win-1252 | Borrar y recrear el archivo |
| "Failed to fetch" en dashboard | ALLOWED_ORIGINS solo tenía puerto 5173 | Agregar puertos 5174, 5175 |
| Dashboard cargando infinito | `res.id` en vez de `res.sesion_id` | Corregir lectura del response |
| CORS 422 en PATCH | methods faltaba PATCH | Agregar PATCH al CORS |
| Dashboard muestra 0 votos | `data?.caso` / nombres de campos incorrectos | Normalizar: `caso_practico`, `correctas`, `por_opcion` |
| 422 al cerrar segunda votación | `estado: 'activa'` inválido | `estado: 'esperando'` |
| PostuladoPanel 0 votos | Desestructuración con nombres viejos (`segunda`/`argumentos`) | `cambios`/`justificaciones` |
| React crash al cargar datos | JustificacionesCarousel recibía objetos en vez de strings | Mapear a array de strings |
| Dashboard no muestra nada global | `modoGlobal=false` + `sesionId=''` → hook no disparaba | `handleLogin` activa `modoGlobal=true`; backend acepta ID `'global'` |
| 404 en rutas React en GitHub Pages | GitHub Pages no maneja SPA routing | Copiar `index.html` como `404.html` |
| Render: `npm not found` | `rootDir` no configurado | `render.yaml` con `rootDir: backend` |

---

## Uso en clase

### Antes de clase
1. Abrir `https://determinantes-pot-desarrollo-regional.onrender.com/health` (despertar backend)
2. Abrir dashboard: `https://jeremaya203.github.io/Determinantes-pot-desarrollo-regional/dashboard`
3. Ingresar contraseña: `Jeremaya203%%`
4. Crear nueva sesión (`+ NUEVA SESIÓN`) y copiar URL para estudiantes

### Durante clase
- Estudiantes abren la URL compartida → ingresan nombre → completan 6 debates → caso práctico
- Dashboard muestra votos en tiempo real (polling cada 2s)
- Abrir segunda votación por caso: `ABRIR SEGUNDA VOTACIÓN →`
- Revelar resultados del caso práctico: `REVELAR RESULTADOS →`

### Después de clase
- Datos guardados en Firestore indefinidamente
- Para limpiar: script temporal con Firebase Admin SDK (borrar colecciones `postulados`, `resultados`, `sesiones`)

---

## Desarrollo local

### Backend
```bash
cd backend
npm install
cp .env.example .env   # Editar con credenciales reales
# Colocar firebase-service-account.json en backend/
npm run dev            # → http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:3001
npm run dev            # → http://localhost:5173
```