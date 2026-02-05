import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ImprovementPlan, PlanStatus, PlanType } from "../../types/mejora";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { ActionMenu } from "../../components/ui/ActionMenu";
import { Button } from "../../components/ui/Button";
import { FileListPopover } from "../../components/ui/FileListPopover";
import { PlanModal } from "../../components/modals/PlanModal";
import { MOCK_PLANS } from "../../config/constants";
import { calculateDeadlineInfo } from "../../utils/dateUtils";

export default function MejoraPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<ImprovementPlan[]>(MOCK_PLANS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ImprovementPlan | null>(
    null
  );
  const [modalMode, setModalMode] = useState<"create" | "delete">("create");

  const handleSavePlan = (
    data: { name: string; type: PlanType; files: File[] },
    planId?: string
  ) => {
    if (planId) {
      setPlans((currentPlans) =>
        currentPlans.map((p) =>
          p.id === planId
            ? {
                ...p,
                name: data.name,
                type: data.type,
              }
            : p
        )
      );
      toast.success("Plan actualizado!");
    } else {
      const newPlan: ImprovementPlan = {
        id: new Date().toISOString(),
        name: data.name,
        type: data.type,
        status: "Pendiente",
        startDate: new Date().toISOString().split("T")[0],
        lastUpdate: new Date().toISOString().split("T")[0],
        evidenceFiles: data.files.map((file, index) => ({
          id: `temp-${index}-${file.name}`,
          name: file.name,
          url: "#",
        })),
        activityLog: [],
      };
      setPlans((currentPlans) => [newPlan, ...currentPlans]);
      toast.success("Plan creado con éxito!");
    }
    setIsModalOpen(false);
  };

  // Handler for creating a new plan
  const handleCreate = () => {
    setSelectedPlan(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  // Handler for deleting a plan (triggered from the ActionMenu)
  const handleDelete = (plan: ImprovementPlan) => {
    setSelectedPlan(plan);
    setModalMode("delete");
    setIsModalOpen(true);
  };

  const handleStatusChange = (planId: string, newStatus: PlanStatus) => {
    setPlans((currentPlans) =>
      currentPlans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              status: newStatus,
              lastUpdate: new Date().toISOString().split("T")[0],
            }
          : plan
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Mejora Continua</h1>
          <p className="text-gray-500 mt-1">
            Gestiona acciones correctivas, planes y no conformidades.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button onClick={handleCreate}>
            <strong>+</strong>
            Añadir Plan
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md">
        <div className="hidden md:grid grid-cols-7 gap-4 p-4 font-semibold text-sm text-gray-600 border-b">
          <div className="col-span-2">Nombre del Plan</div>
          <div className="text-center">Estado</div>
          <div className="text-center">Fechas</div>
          <div className="text-center">Vencimiento</div>
          <div className="text-center">Evidencia</div>
          <div className="text-right">Acciones</div>
        </div>
        <div className="space-y-1 p-2">
          {plans.map((plan) => {
            const deadlineInfo = calculateDeadlineInfo(plan.deadline);

            return (
              <div
                key={plan.id}
                className="grid grid-cols-2 md:grid-cols-7 gap-4 items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-2">
                  <Link
                    to={`/mejora/plan/${plan.id}`}
                    className="font-bold text-gray-800 hover:text-blue-600 hover:underline truncate block"
                    title={plan.name}
                  >
                    {plan.name}
                  </Link>
                  <p className="text-xs text-gray-500 md:hidden">{plan.type}</p>

                  <div className="text-xs md:hidden mt-1">
                    <p className="font-semibold text-gray-500">
                      Fin: {deadlineInfo.formattedDate}
                    </p>
                    <p
                      className={`font-semibold ${
                        deadlineInfo.isOverdue
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {deadlineInfo.displayText}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end md:justify-center">
                  <StatusBadge
                    currentStatus={plan.status}
                    onStatusChange={(newStatus) =>
                      handleStatusChange(plan.id, newStatus)
                    }
                  />
                </div>

                <div className="hidden md:block text-center text-sm text-gray-600">
                  <p>Inicio: {plan.startDate}</p>
                  <p>Act: {plan.lastUpdate}</p>
                </div>

                <div className={`hidden md:block text-center text-sm`}>
                  <p className="text-gray-600">
                    Fin: {deadlineInfo.formattedDate}
                  </p>
                  <p
                    className={`font-semibold ${
                      deadlineInfo.isOverdue ? "text-red-600" : "text-gray-700"
                    }`}
                  >
                    {deadlineInfo.displayText}
                  </p>
                </div>

                <div className="hidden md:flex justify-center">
                  <FileListPopover files={plan.evidenceFiles} />
                </div>

                <div className="flex justify-end">
                  <ActionMenu
                    onEdit={() => navigate(`/mejora/plan/${plan.id}`)}
                    onDelete={() => handleDelete(plan)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The Modal for Modify and Delete actions remains */}
      <PlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        plan={selectedPlan}
        onSave={handleSavePlan}
        onConfirmDelete={(id) => {
          setPlans((plans) => plans.filter((p) => p.id !== id));
          setIsModalOpen(false);
          // Call API to delete
        }}
      />
    </div>
  );
}
