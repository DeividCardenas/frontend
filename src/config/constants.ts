import { IdOption, TipoId } from "../types/diagnostico";
import { Module } from "../types/navigation";
import { Banner } from "../types/dashboard";
import { ImprovementPlan } from "../types/mejora";

export const SIDEBAR_MODULES: Module[] = [
  {
    key: "dashboard",
    path: "/dashboard",
    title: "Dashboard",
    sub: "Vista principal y KPIs",
    icon: "🏠",
  },
  {
    key: "diagnostico",
    path: "/diagnostico",
    title: "Diagnóstico Inicial",
    sub: "Contexto de la organización",
    icon: "📝",
  },

  {
    key: "liderazgo",
    path: "/liderazgo",
    title: "Liderazgo",
    sub: "Roles de los funcionarios",
    icon: "👥",
    subModules: [
      {
        key: "roles",
        path: "/liderazgo/roles",
        title: "Roles & Permisos",
      }
    ],
  },

  {
    key: "gdoc",
    path: "/gestion-documental",
    title: "Gestión Documental",
    sub: "Biblioteca y control",
    icon: "📂",
    subModules: [
      {
        key: "biblioteca",
        path: "/gestion-documental/biblioteca",
        title: "Biblioteca",
      },
      {
        key: "control-cambio",
        path: "/gestion-documental/control-cambio",
        title: "Control del Cambio",
      },
      {
        key: "creacion",
        path: "/gestion-documental/creacion",
        title: "Creación Documental",
      },
      {
        key: "doc-externa",
        path: "/gestion-documental/doc-externa",
        title: "Documentación Externa",
      },
    ],
  },
  {
    key: "apoyo",
    path: "/apoyo",
    title: "Apoyo",
    sub: "Conciencia y comunicación",
    icon: "🤝",
  },
  {
    key: "monitoreo",
    path: "/monitoreo",
    title: "Monitoreo",
    sub: "Indicadores y seguimiento",
    icon: "📊",
  },
  {
    key: "mejora",
    path: "/mejora",
    title: "Mejora",
    sub: "Banco de información",
    icon: "📈",
  },
];

export const BANNERS: Banner[] = [
  {
    title: "Novedades de la plataforma",
    text: "Consulta nuevas plantillas y mejoras de rendimiento.",
  },
  {
    title: "Calendario del mes",
    text: "Revisa auditorías y tareas programadas.",
  },
  {
    title: "Actualiza tu perfil",
    text: "Completa tu información para una mejor experiencia.",
  },
];

export const TIPO_ID_OPTIONS: IdOption[] = [
  { value: "NIT", label: "NIT" },
  { value: "CC", label: "CÉDULA DE CIUDADANÍA" },
  { value: "CE", label: "CÉDULA DE EXTRANJERÍA" },
  { value: "PAS", label: "PASAPORTE" },
];

export const MOCK_PLANS: ImprovementPlan[] = [
  {
    id: "1",
    name: "Plan de Reducción de Emisiones CO2",
    type: "Plan de Mejora",
    status: "En Progreso",
    startDate: "2025-08-01",
    lastUpdate: "2025-09-15",
    deadline: "2025-10-30",
    evidenceFiles: [
      { id: "f1", name: "informe_emisiones_q3.pdf", url: "#" },
      { id: "f2", name: "analisis_emisiones.pdf", url: "#" },
    ],
    activityLog: [
      {
        id: "a3",
        user: "Ana García",
        timestamp: "2025-09-15T10:00:00Z",
        type: "comment",
        content: "El informe de emisiones del Q3 ha sido cargado.",
      },
      {
        id: "a2",
        user: "Sistema",
        timestamp: "2025-08-01T09:05:00Z",
        type: "status_change",
        content: "El estado cambió de Pendiente a En Progreso.",
      },
      {
        id: "a1",
        user: "Juan Pérez",
        timestamp: "2025-08-01T09:00:00Z",
        type: "file_upload",
        content: "Se creó el plan con el archivo inicial.",
      },
    ],
  },
  {
    id: "2",
    name: "Corrección de Vertimiento No Conforme",
    type: "Acción Correctiva",
    status: "Completado",
    startDate: "2025-07-20",
    lastUpdate: "2025-08-30",
    deadline: "2025-08-25",
    evidenceFiles: [{ id: "f3", name: "analisis_agua_final.pdf", url: "#" }],
    activityLog: [],
  },
  {
    id: "3",
    name: "Gestión de Residuos Peligrosos",
    type: "No Conforme",
    status: "Retrasado",
    startDate: "2025-06-01",
    lastUpdate: "2025-09-01",
    deadline: "2025-10-05",
    evidenceFiles: [],
    activityLog: [
      {
        id: "a3",
        user: "Ana García",
        timestamp: "2025-09-15T10:00:00Z",
        type: "comment",
        content: "El informe de emisiones del Q3 ha sido cargado.",
      },
      {
        id: "a2",
        user: "Sistema",
        timestamp: "2025-08-01T09:05:00Z",
        type: "status_change",
        content: "El estado cambió de Pendiente a En Progreso.",
      },
    ],
  },
  // ... etc
];
