import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { ImprovementPlan, PlanType } from "../../types/mejora";
import { Button } from "../ui/Button";
import { PlanForm } from "../../pages/mejora/components/PlanForm";

type PlanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: "view" | "edit" | "delete" | "create";
  plan: ImprovementPlan | null;
  onSave: (
    data: { name: string; type: PlanType; files: File[] },
    planId?: string
  ) => void;
  onConfirmDelete: (id: string) => void;
};

export const PlanModal = ({
  isOpen,
  onClose,
  mode,
  plan,
  onSave,
  onConfirmDelete,
}: PlanModalProps) => {
  const getTitle = () => {
    switch (mode) {
      case "view":
        return "Detalles del Plan";
      case "edit":
        return "Modificar Plan";
      case "create":
        return "Crear Nuevo Plan";
      case "delete":
        return "Confirmar Eliminación";
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-xl font-bold leading-6 text-gray-900"
                >
                  {getTitle()}
                </DialogTitle>

                {/* Conditional content based on mode */}
                <div className="mt-4">
                  {mode === "delete" && (
                    <>
                      <p className="text-gray-600">
                        ¿Estás seguro de que deseas eliminar el plan "
                        {plan?.name}"? Esta acción no se puede deshacer.
                      </p>
                      <div className="mt-6 flex justify-end gap-4">
                        <Button variant="secondary" onClick={onClose}>
                          Cancelar
                        </Button>
                        <Button
                          variant="primary"
                          className="!bg-red-600 hover:!bg-red-700 focus:!ring-red-500"
                          onClick={() => onConfirmDelete(plan!.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </>
                  )}

                  {(mode === "edit" || mode === "create") && (
                    <PlanForm
                      initialData={plan}
                      onCancel={onClose}
                      onSubmit={(formData) => onSave(formData, plan?.id)}
                    />
                  )}

                  {mode === "view" && (
                    <div className="space-y-2 text-gray-700">
                      <p>
                        <strong>Nombre:</strong> {plan?.name}
                      </p>
                      <p>
                        <strong>Tipo:</strong> {plan?.type}
                      </p>
                      <p>
                        <strong>Estado:</strong> {plan?.status}
                      </p>
                      {/* ... etc ... */}
                    </div>
                  )}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
