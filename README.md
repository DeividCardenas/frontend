# Frontend NovaGrowth

Este es el repositorio del frontend para la aplicación NovaGrowth, desarrollada con tecnologías modernas para ofrecer una experiencia de usuario fluida y escalable.

## 🛠️ Stack Tecnológico

*   **Framework:** [React](https://react.dev/) v19
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/) v4
*   **Mapas:** [Leaflet](https://leafletjs.com/) (vía `react-leaflet`)
*   **Estado Global:** Context API (migración recomendada a Zustand)
*   **Peticiones HTTP:** Axios

## 🚀 Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu entorno de desarrollo:

*   [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
*   npm (viene con Node.js)

## 📦 Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone <url-del-repositorio>
    cd frontend
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

## ⚙️ Configuración del Entorno (Backend)

La aplicación necesita conectarse a una API Backend (Laravel). Para configurar esta conexión:

1.  Crea un archivo `.env` en la raíz del proyecto (puedes basarte en un `.env.example` si existiera, o crearlo desde cero).
2.  Define la variable de entorno `VITE_API_URL` con la URL base de tu backend.

**Ejemplo de archivo `.env`:**

```env
VITE_API_URL=http://localhost:8000/api
```

> **Nota:** Si no defines `VITE_API_URL`, la aplicación intentará conectarse por defecto a `http://172.27.58.171:8000` (según configuración actual en `src/api/axios.ts`), lo cual probablemente no funcionará en tu entorno local.

### Sobre CORS y Proxy

Actualmente, el proyecto **no utiliza un proxy de desarrollo** en `vite.config.js`. Esto significa que el navegador hará las peticiones directamente a la URL definida.

*   **Backend (Laravel):** Asegúrate de que tu backend tenga configurados los encabezados **CORS** (Cross-Origin Resource Sharing) para permitir peticiones desde `http://localhost:5173` (o el puerto donde corra este frontend).
*   Si prefieres usar un proxy para evitar problemas de CORS en desarrollo, puedes editar `vite.config.js`.

## ▶️ Ejecución

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible típicamente en `http://localhost:5173`.

## 🏗️ Estructura del Proyecto

```
src/
├── api/            # Configuración de Axios y funciones para llamadas al backend
├── assets/         # Imágenes, fuentes y archivos estáticos
├── components/     # Componentes reutilizables (UI, Layouts, etc.)
├── hooks/          # Custom Hooks (lógica reutilizable)
├── layouts/        # Plantillas de diseño (ej. MainLayout con Sidebar)
├── pages/          # Vistas principales de la aplicación (Rutas)
├── providers/      # Contextos de React (AuthContext, etc.)
├── types/          # Definiciones de tipos TypeScript (Interfaces)
├── utils/          # Funciones de utilidad y helpers
├── App.tsx         # Configuración principal de Rutas
└── main.tsx        # Punto de entrada de la aplicación
```

## 📚 Scripts Disponibles

*   `npm run dev`: Inicia el servidor de desarrollo.
*   `npm run build`: Compila la aplicación para producción.
*   `npm run preview`: Sirve localmente la versión compilada para probarla.
*   `npm run lint`: Ejecuta ESLint para verificar la calidad del código.

## 🤝 Contribución y Estándares

*   **Clean Code:** Mantener los componentes pequeños y con una única responsabilidad.
*   **Tipado:** Utilizar interfaces explícitas en `src/types` en lugar de `any`.
*   **Commits:** Usar mensajes descriptivos.
