# Análisis Técnico - Frontend NovaGrowth

Este documento detalla el análisis realizado sobre el estado actual del repositorio, enfocándose en arquitectura, rendimiento y escalabilidad según los requerimientos planteados.

## 1. Resumen Ejecutivo
El proyecto es un MVP funcional construido sobre una base moderna (Vite + React + TypeScript). La estructura de carpetas sigue patrones estándar, lo cual es positivo. Sin embargo, se identificaron varias librerías instaladas pero no utilizadas, lógica de "mocking" (simulación de datos) acoplada fuertemente a la capa de servicios, y un manejo de archivos CSV que podría causar problemas de rendimiento con grandes volúmenes de datos.

## 2. Gestión de Estado (State Management)
*   **Estado Actual:** El `package.json` incluye tanto `jotai` como `zustand`, pero **ninguna de las dos se utiliza en el código fuente**. Actualmente, el estado se maneja mediante `useState` local y `Context API` (`AuthProvider`).
*   **Recomendación:** Eliminar `jotai`. Adoptar **Zustand** para el manejo de estado global (inventarios, datos de sesión, filtros complejos). Zustand es ideal para este proyecto por su bajo boilerplate y modelo mental simple ("flux-like"), facilitando la centralización del flujo de datos.

## 3. Mapas
*   **Estado Actual:** Se instalan tanto `@react-google-maps/api` como librerías de `leaflet`.
*   **Hallazgo:** El código utiliza activamente **Leaflet** (`react-leaflet`) en `DiagnosticoInicial.tsx`. No hay rastro de uso de Google Maps.
*   **Recomendación:** Desinstalar `@react-google-maps/api` para reducir el tamaño del bundle y complejidad. Leaflet es suficiente y más eficiente en costos para las necesidades visuales descritas.

## 4. Arquitectura y Capa de API
*   **Estructura de Carpetas:** La organización `src/api`, `src/components`, `src/pages` es correcta.
*   **Servicios (API):** El archivo `src/api/roles.api.ts` mezcla lógica de llamadas HTTP reales (Axios) con una implementación completa de simulación basada en `localStorage` (`useMock = true`).
*   **Riesgo:** Esta mezcla dificulta el mantenimiento y la migración a producción. La lógica de negocio (ordenamiento, filtrado) está dispersa entre los componentes y la capa de API.
*   **Recomendación:**
    1.  Limpiar `src/api` para que solo contenga llamadas HTTP limpias.
    2.  Mover la lógica de transformación de datos a una capa intermedia o a "stores" de Zustand.
    3.  Asegurar tipado estricto en todas las respuestas (evitar `any` en `axios.ts`).

## 5. Rendimiento y Manejo de Archivos (Excel/CSV)
*   **Hallazgo:** En `src/api/roles.api.ts` existe una función `importRolesCSV` que parsea archivos CSV manualmente usando `split` y expresiones regulares en el hilo principal del navegador.
*   **Riesgo:** Para "archivos Excel pesados" (como se menciona en los requisitos), esto **bloqueará la interfaz de usuario**, causando que la aplicación se congele durante la carga.
*   **Recomendación:**
    *   **Opción A (Ideal):** Subir el archivo crudo al backend (Laravel) y procesarlo allí (usando *Laravel Excel*), aprovechando colas (Queues) si es muy pesado.
    *   **Opción B (Frontend):** Si debe procesarse en el cliente, usar un **Web Worker** y una librería optimizada como `papaparse`. Nunca procesar strings gigantes en el hilo principal.

## 6. Estándares y Clean Code
*   **Observaciones:**
    *   El código es legible en general.
    *   El uso de TypeScript es inconsistente (algunos `any` peligrosos).
    *   Hay lógica de negocio dentro de los hooks de vista (`useRoles` maneja paginación y filtrado localmente).
*   **Guía de Estilos:** Se recomienda configurar **ESLint** y **Prettier** con reglas estrictas para asegurar consistencia.

## Próximos Pasos Sugeridos
1.  **Limpieza:** Desinstalar dependencias no usadas (`jotai`, `@react-google-maps/api`).
2.  **Refactor API:** Eliminar la lógica de `localStorage` de los servicios API.
3.  **Implementar Zustand:** Crear el primer "store" para gestionar Roles o Inventario.
4.  **Optimizar Carga:** Refactorizar la importación de archivos para enviarlos al backend.
