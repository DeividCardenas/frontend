import { useState } from "react";
import { FileUpload } from "../../components/ui/FileUpload";
import { PlanType } from "../../types/mejora";
import { FormField } from "../../components/forms/FormField";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

type BancoProps = {
  onNewPlan: (files: File[], type: PlanType, name: string) => void;
};

const planTypeOptions: PlanType[] = [
  "No Conforme",
  "Acción Correctiva",
  "Plan de Mejora",
];

type FormErrors = {
  planName?: string;
  files?: string;
};

export const BancoInformacionPanel = ({ onNewPlan }: BancoProps) => {
  const [planName, setPlanName] = useState("");
  const [planType, setPlanType] = useState<PlanType>("Plan de Mejora");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = () => {
    const newErrors: FormErrors = {};
    if (planName.trim() === "") {
      newErrors.planName = "El nombre del plan es obligatorio.";
    }
    if (uploadedFiles.length === 0) {
      newErrors.files = "Debe seleccionar al menos un archivo.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onNewPlan(uploadedFiles, planType, planName);
    // Reset the form for the next entry
    setPlanName("");
    setPlanType("Plan de Mejora");
    setUploadedFiles([]);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="font-bold text-lg text-gray-800">Iniciar Nuevo Plan</h3>
      <p className="text-gray-500 mt-1 mb-6">
        Completa los datos y carga un documento para crear un nuevo plan en el
        sistema. Aparecerá en la pestaña de "Seguimiento" con estado
        "Pendiente".
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Nombre del Plan o Actividad"
          htmlFor="planName"
          required
          error={errors.planName}
        >
          <Input
            id="planName"
            name="planName"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className={errors.planName ? "border-red-500" : ""}
          />
        </FormField>

        <FormField label="Tipo de Plan" htmlFor="planType" required>
          <select
            id="planType"
            name="planType"
            value={planType}
            onChange={(e) => setPlanType(e.target.value as PlanType)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-800/50 focus:border-brand-800"
          >
            {planTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          label="Archivo(s) de Evidencia"
          htmlFor="fileUpload"
          required
          error={errors.files}
        >
          <FileUpload onFileUpload={setUploadedFiles} />
        </FormField>

        <div className="pt-4 border-t flex justify-end">
          <Button type="submit" variant="primary">
            Crear Plan
          </Button>
        </div>
      </form>
    </div>
  );
};
