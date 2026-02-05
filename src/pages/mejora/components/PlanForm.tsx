import { useState, FormEvent } from "react";
import { PlanType, ImprovementPlan } from "../../../types/mejora";
import { FileUpload } from "../../../components/ui/FileUpload";
import { FormField } from "../../../components/forms/FormField";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

const planTypeOptions: PlanType[] = [
  "No Conforme",
  "Acción Correctiva",
  "Plan de Mejora",
];

type PlanFormProps = {
  onSubmit: (formData: { name: string; type: PlanType; files: File[] }) => void;
  onCancel: () => void;
  initialData?: ImprovementPlan | null;
};

export const PlanForm = ({
  onSubmit,
  onCancel,
  initialData,
}: PlanFormProps) => {
  const [planName, setPlanName] = useState(initialData?.name || "");
  const [planType, setPlanType] = useState<PlanType>(
    initialData?.type || "Plan de Mejora"
  );
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<{ planName?: string; files?: string }>(
    {}
  );

  const validate = () => {
    const newErrors: { planName?: string; files?: string } = {};
    if (planName.trim() === "")
      newErrors.planName = "El nombre del plan es obligatorio.";
    if (uploadedFiles.length === 0 && !initialData)
      newErrors.files = "Debe seleccionar al menos un archivo.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ name: planName, type: planType, files: uploadedFiles });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
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
        required={!initialData}
        error={errors.files}
      >
        <FileUpload onFileUpload={setUploadedFiles} />
      </FormField>

      <div className="pt-4 flex justify-end gap-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          {initialData ? "Guardar Cambios" : "Crear Plan"}
        </Button>
      </div>
    </form>
  );
};
