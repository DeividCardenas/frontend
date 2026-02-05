// Using union types for fields with specific options
export type TipoPersona = "JURIDICA" | "NATURAL";
export type TipoId = "NIT" | "CC" | "CE" | "PAS";

export type IdOption = {
  value: TipoId;
  label: string;
};

// The main interface for our form data
export interface DiagnosticoFormData {
  correo: string;
  razonSocial: string;
  tipoPersona: TipoPersona;
  representante: string;
  tipoId: TipoId;
  numeroId: string;
  direccion: string;
  georef: string;
  actividad: string;
  numTrabajadores: string; // Keep as string for form input, convert on submission if needed
  jornada: string;
  entradasSalidas: string;
  procesosSinES: string;
  aceptaTratamiento: boolean;
}

type BaseErrors = Partial<Omit<DiagnosticoFormData, "aceptaTratamiento">>;

export type FormErrors = BaseErrors & {
  aceptaTratamiento?: string;
};
