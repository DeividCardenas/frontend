import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ImprovementPlan,
  PlanStatus,
  ActivityLog,
  EvidenceFile,
} from "../../types/mejora";
import { MOCK_PLANS } from "../../config/constants";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Button } from "../../components/ui/Button";
import { ActivityFeed } from "./components/ActivityFeed";
import { EvidencePanel } from "./components/EvidencePanel";
import { useAuth } from "../../hooks/useAuth";

export default function PlanDetailPage() {
  const { planId } = useParams<{ planId: string }>();
  const [plan, setPlan] = useState<ImprovementPlan | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const foundPlan = MOCK_PLANS.find((p) => p.id === planId);
    setPlan(foundPlan || null);
  }, [planId]);

  const handleStatusChange = (newStatus: PlanStatus) => {
    if (!plan) return;

    // This updates the state for this page only.
    // In a real app, this would also trigger an API call and then
    // you'd want to update the global state.
    const updatedPlan = {
      ...plan,
      status: newStatus,
      lastUpdate: new Date().toISOString().split("T")[0],
    };
    setPlan(updatedPlan);
  };

  const handlePublishActivity = (comment: string, files: File[]) => {
    if (!plan || !user) return;

    const newFiles: EvidenceFile[] = files.map((file) => ({
      id: `${file.name}-${new Date().getTime()}`,
      name: file.name,
      url: "#",
    }));

    const newActivity: ActivityLog = {
      id: new Date().toISOString(),
      user: user.name,
      timestamp: new Date().toISOString(),
      type: "comment",
      content: comment,
      files: newFiles,
    };

    setPlan((currentPlan) => {
      if (!currentPlan) return null;
      return {
        ...currentPlan,
        activityLog: [newActivity, ...currentPlan.activityLog],
        evidenceFiles: [...currentPlan.evidenceFiles, ...newFiles],
      };
    });
  };

  if (!plan) {
    return (
      <div className="text-center p-10">
        <h2 className="text-xl font-semibold">Cargando plan...</h2>
        <p className="text-gray-500">
          Si el plan no carga, es posible que no exista.
        </p>
        <Link
          to="/mejora"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          Volver a Todos los Planes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <Link
          to="/mejora"
          className="text-sm text-blue-600 hover:underline mb-2 block"
        >
          &larr; Volver a Todos los Planes
        </Link>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">{plan.name}</h1>
          <Button
            variant="primary"
            onClick={() => alert("Generando reporte con AI...")}
          >
            🤖 Generar Reporte (AI)
          </Button>
        </div>
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
          <span>Estado:</span>
          <StatusBadge
            currentStatus={plan.status}
            onStatusChange={handleStatusChange}
          />
          <span>&bull;</span>
          <span>Última actualización: {plan.lastUpdate}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed
            activities={plan.activityLog}
            onPublish={handlePublishActivity}
          />
        </div>
        <div className="lg:col-span-1">
          <EvidencePanel files={plan.evidenceFiles} />
        </div>
      </div>
    </div>
  );
}
