export type PlanType = "No Conforme" | "Acción Correctiva" | "Plan de Mejora";
export type PlanStatus =
  | "Pendiente"
  | "En Progreso"
  | "Completado"
  | "Retrasado";

export type EvidenceFile = {
  id: string;
  name: string;
  url: string;
};

export type ActivityLog = {
  id: string;
  user: string;
  timestamp: string;
  type: "comment" | "status_change" | "file_upload";
  content: string;
  files?: EvidenceFile[];
};

export interface ImprovementPlan {
  id: string;
  name: string;
  type: PlanType;
  status: PlanStatus;
  startDate: string;
  lastUpdate: string;
  deadline: string;
  evidenceFiles: EvidenceFile[];
  activityLog: ActivityLog[];
}
