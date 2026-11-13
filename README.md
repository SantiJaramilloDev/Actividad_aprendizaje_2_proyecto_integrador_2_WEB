# Frontend - Gestión de películas y series

Aplicación web desarrollada con **ReactJS** para administrar los módulos de **Género, Director, Productora, Tipo y Media** (películas y series) de la Institución Universitaria Digital de Antioquia.

Este proyecto corresponde a la **Evidencia de Aprendizaje 2** y consume la API REST construida en la carpeta `../API`.

## Integrantes

- Santiago Valencia Hernandez
- Brayan Santiago Jaramillo Amézquita

## Características

- **Dashboard** con indicadores del catálogo, producciones recientes y estado de conexión con la API.
- **CRUD completo** de géneros, directores, productoras, tipos y medias.
- **Búsqueda y filtros** por nombre, estado, género y tipo; los filtros de medias se sincronizan con la URL.
- **Formularios accesibles** con validación, resumen de errores y mensajes devueltos por la API.
- **Vista previa** de cada producción con su portada, sinopsis y metadatos.
- **Diseño dark cinematográfico** responsive (móvil, tablet y escritorio) con navegación lateral.
- **Feedback visual** mediante notificaciones y confirmaciones con SweetAlert2.
- Estados de carga (skeletons), vacío y error en todas las pantallas.

## Tecnologías

- React 19 + Vite 6
- React Router 7
- Axios
- Bootstrap 5 + Bootstrap Icons
- SweetAlert2
- Oxlint

## Requisitos

- Node.js 22 o superior
- npm
- La API REST de la carpeta `../API` en ejecución

## Instalación

```bash
cd WEB
npm install
cp .env.example .env
```

El archivo `.env` define la URL de la API:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

> **Nota para WSL:** usa Node instalado dentro de WSL. Si ejecutas `npm` con el Node de Windows sobre una ruta `\\wsl.localhost\...`, Vite falla al resolver las dependencias. Con nvm:
>
> ```bash
> nvm install 22
> nvm use 22
> ```

## Ejecutar la aplicación

Primero inicia la API (desde la carpeta `API`):

```bash
npm run dev:memory
# o, con MongoDB configurado:
npm run seed
npm run dev
```

Luego inicia el frontend (desde la carpeta `WEB`):

```bash
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con recarga automática |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Previsualiza la versión de producción |
| `npm run lint` | Ejecuta el linter del proyecto |

## Estructura del proyecto

```text
WEB/
├── src/
│   ├── api/          # Cliente Axios y manejo de errores
│   ├── components/   # Layout, UI reutilizable, catálogos y medias
│   ├── config/       # Configuración de campos y columnas de catálogos
│   ├── hooks/        # Hooks de carga de datos y salud de la API
│   ├── pages/        # Dashboard, módulos y 404
│   ├── routes/       # Definición de rutas
│   ├── services/     # Consumo de los endpoints de la API
│   ├── styles/       # Sistema de diseño (tema dark)
│   ├── utils/        # Formato, validación y alertas
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── index.html
└── package.json
```

## Módulos

| Módulo | Ruta | Funcionalidad |
|---|---|---|
| Dashboard | `/` | KPIs, producciones recientes y estado de la API |
| Géneros | `/generos` | CRUD, búsqueda y filtro por estado |
| Directores | `/directores` | CRUD, búsqueda y filtro por estado |
| Productoras | `/productoras` | CRUD, búsqueda y filtro por estado |
| Tipos | `/tipos` | CRUD y búsqueda |
| Películas y series | `/medias` | CRUD, filtros por título, género y tipo, y vista previa |

## Reglas de negocio respetadas en la interfaz

- Una media solo puede asociarse a **géneros, directores y productoras activos**.
- El **tipo** debe existir (no maneja estado).
- `serial` y `urlPelicula` son únicos.
- No se pueden eliminar catálogos asociados a una media.
- Al editar una media se envía `PATCH` solo con los campos modificados, evitando reenviar referencias inactivas sin cambios.
- Los formularios muestran los mensajes de error que devuelve la API.

## Endpoints consumidos

La URL base es `http://localhost:3000/api/v1`:

- `GET /health`
- `GET/POST/PUT/DELETE /generos`
- `GET/POST/PUT/DELETE /directores`
- `GET/POST/PUT/DELETE /productoras`
- `GET/POST/PUT/DELETE /tipos`
- `GET/POST/PATCH/DELETE /medias`
