# Evaluación II: Sistema de Gestión de AstroLogistics Ltd. & Estabilizador del Reactor

Aplicación web completa (Frontend y Backend) desarrollada con Node.js, Express, React y Vite para la resolución de problemas lógicos y gestión de inventario/carga espacial.

📋 Información de la Evaluación
- Asignatura: Programación Web (Ciclo 02, 2026)
- Evaluación: Evaluación Parcial II (20%)
- Tecnologías: Node.js, Express, React, Vite, Reactstrap, JavaScript
- Persistencia: Local basada en archivos JSON estructurados (`inventario.json`, `carga.json`)

📁 Estructura del Proyecto
proyecto/
├── backend/
│   ├── data/                         # Archivos JSON (inventario y carga)
│   ├── src/
│   │   ├── controllers/              # Lógica del reactor y de logística (req/res)
│   │   ├── routes/                   # Endpoints de la API (/adjust, /reboot, /api/*)
│   │   └── app.js                    # Servidor Express, middlewares y CORS
│   ├── package.json                  # Dependencias del servidor
│   └── .env                          # Variables del servidor (PORT)
├── frontend/
│   ├── src/
│   │   ├── components/               # Componentes de React (Reactor, Bodega, Catalogo)
│   │   ├── App.jsx                   # Vista principal, integración y estados (useState)
│   │   └── main.jsx                  # Configuración de Vite y Bootstrap
│   ├── package.json                  # Dependencias del cliente (Reactstrap, Bootstrap)
│   ├── vite.config.js                # Proxy para conexión con el backend sin errores CORS
│   └── .env                          # Variables de entorno de Vite (VITE_API_BASE_URL)
└── README.md                         # Documentación del proyecto

---

## Inicializar el proyecto

El proyecto está dividido en dos capas independientes.

# 1. Configurar el Backend
```bash
cd ./backend
npm install
# Crear archivo .env basado en el .env.example (PORT=3000)
```

# 2. Configurar el Frontend
```bash
cd ./frontend
npm install
# Crear archivo .env basado en el .env.example (VITE_API_BASE_URL=http://localhost:3000)
```

---

## 🔀 Flujo de Trabajo Colaborativo (GitFlow)

Para asegurar la trazabilidad de los commits de cada integrante del equipo, se utiliza el modelo simplificado de GitFlow.

### 1. Estructura de Ramas
- **`main`**: Rama de producción con código 100% estable y funcional.
- **`develop`**: Rama base de integración común donde confluyen las funcionalidades terminadas.
- **`feature/<nombre-funcionalidad>`**: Ramas de trabajo temporal para cada módulo o componente.

---

### 2. Convención de Ramas por Funcionalidad
Cada integrante del equipo debe crear su propia rama para trabajar la tarea asignada:
- `feature/backend-reactor` (POST /adjust, POST /reboot)
- `feature/backend-inventario` (GET /api/inventario, GET /api/carga)
- `feature/backend-operaciones-carga` (POST, PUT, DELETE en /api/carga)
- `feature/frontend-reactor-ui` (Componente Reactor, validaciones e historial)
- `feature/frontend-astrologistics-ui` (Catálogo, Bodega y Panel Superior con Reactstrap)

---

### 3. Guía Paso a Paso para Integrantes

#### Paso 1: Obtener la última versión de `develop`
```bash
git checkout develop
git pull origin develop
```

#### Paso 2: Crear la rama para la funcionalidad asignada
```bash
git checkout -b feature/<nombre-de-tu-tarea>
```

#### Paso 3: Realizar cambios y registrar commits claros
```bash
git add .
git commit -m "feat: implementar validación de créditos insuficientes en PUT carga"
```

#### Paso 4: Subir la rama al repositorio remoto
```bash
git push origin feature/<nombre-de-tu-tarea>
```

##### 4. Publicación Final en main (Solo tras integrar y probar en develop)
```bash
git checkout main
git pull origin main
git merge develop
git push origin main
```

---

## ▶️ Ejecutar el programa

Para levantar el entorno completo de desarrollo, debes abrir **dos terminales** independientes en la raíz del proyecto.

### Terminal 1: Correr el Backend (Express)
```bash
cd backend
npm run dev
```
*(Nota: El script "dev" en el package.json utiliza `node --watch src/app.js` en lugar de nodemon)*

### Terminal 2: Correr el Frontend (Vite)
```bash
cd frontend
npm run dev
```