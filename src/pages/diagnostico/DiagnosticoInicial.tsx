import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DiagnosticoFormData,
  FormErrors,
  TipoPersona,
} from "../../types/diagnostico";
import { FormField } from "../../components/forms/FormField";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { TIPO_ID_OPTIONS } from "../../config/constants";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";

const initialState: DiagnosticoFormData = {
  correo: "",
  razonSocial: "",
  tipoPersona: "JURIDICA",
  representante: "",
  tipoId: "NIT",
  numeroId: "",
  direccion: "",
  georef: "",
  actividad: "",
  numTrabajadores: "",
  jornada: "",
  entradasSalidas: "",
  procesosSinES: "",
  aceptaTratamiento: false,
};

const mapContainerStyle = {
  width: "100%",
  height: "350px",
  borderRadius: "12px",
};

const center: [number, number] = [4.711, -74.0721]; // Bogotá

export default function DiagnosticoInicial() {
  const navigate = useNavigate();
  const [data, setData] = useState<DiagnosticoFormData>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [step, setStep] = useState(1);

  // NEW: manage sistemaAmbiental and archivos separately so we don't have to modify the DiagnosticoFormData type
  const [sistemaAmbiental, setSistemaAmbiental] = useState<"SI" | "NO" | "">("");
  const [documentosAmbientales, setDocumentosAmbientales] = useState<FileList | null>(null);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentosAmbientales(e.target.files);
    // Clear file-related error if any
    if ((errors as any).documentosAmbientales) {
      setErrors((prev) => ({ ...prev, documentosAmbientales: undefined }));
    }
  };

  // 📍 Manejo del clic en el mapa
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        setSelected([lat, lng]);
        setData((prev) => ({
          ...prev,
          georef: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        }));
        // Clear georef error if any
        if (errors.georef) {
          setErrors((prev) => ({ ...prev, georef: undefined }));
        }
      },
    });
    return selected ? (
      <Marker
        position={selected}
        icon={L.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
          iconSize: [30, 30],
        })}
      />
    ) : null;
  };

  const validateStep1 = (): boolean => {
    const e: FormErrors = {};
    if (!data.correo || !/^\S+@\S+\.\S+$/.test(data.correo))
      e.correo = "Ingresa un correo válido.";
    if (!data.razonSocial.trim()) e.razonSocial = "Campo obligatorio.";
    if (data.tipoPersona === "JURIDICA" && !data.representante.trim())
      e.representante = "Obligatorio para persona jurídica.";
    if (!data.numeroId.trim()) e.numeroId = "Campo obligatorio.";
    if (!data.direccion.trim()) e.direccion = "Campo obligatorio.";
    if (!data.georef.trim())
      e.georef = "Selecciona una ubicación en el mapa o ingresa coordenadas.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = (): boolean => {
    const e: FormErrors = {};
    if (!data.actividad.trim()) e.actividad = "Campo obligatorio.";
    if (!data.numTrabajadores || isNaN(Number(data.numTrabajadores)))
      e.numTrabajadores = "Ingresa un número válido.";
    if (!data.jornada.trim()) e.jornada = "Campo obligatorio.";
    if (!data.entradasSalidas.trim())
      e.entradasSalidas = "Describe entradas y salidas.";
    if (!data.aceptaTratamiento)
      e.aceptaTratamiento = "Debes aceptar el tratamiento de datos.";

    // Validate new question via local state
    if (!sistemaAmbiental) {
      // Use a key that your FormErrors accepts; cast to any to be safe
      (e as any).sistemaAmbiental = "Selecciona una opción.";
    }
    if (sistemaAmbiental === "SI" && (!documentosAmbientales || documentosAmbientales.length === 0)) {
      (e as any).documentosAmbientales = "Adjunta al menos un documento.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;

    // Prepare payload combining data + the new fields
    const archivosNombres =
      documentosAmbientales && documentosAmbientales.length > 0
        ? Array.from(documentosAmbientales).map((f) => f.name)
        : null;

    const payload = {
      ...data,
      sistemaAmbiental: sistemaAmbiental || "NO",
      documentosAmbientales: archivosNombres,
    };

    // Aquí podrías enviar payload y los archivos reales a tu backend
    console.log("Payload a enviar:", payload);
    if (documentosAmbientales) {
      console.log("Archivos (FileList):", documentosAmbientales);
    }

    alert("Diagnóstico enviado con éxito.");
    navigate("/dashboard");
  };

  const mapCenter: [number, number] = selected ?? center;

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-brand-800 to-brand-900 text-white p-6 flex items-center gap-4">
          <img
            src="/img/LOGO.png"
            alt="Logo Nova Growth"
            onClick={() => navigate("/dashboard")}
            className="h-8 cursor-pointer"
          />
          <h1 className="text-2xl font-bold tracking-wide">
            Diagnóstico Inicial
          </h1>
        </div>

        {/* --- Paso 1: Identificación y georreferenciación --- */}
        {step === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (validateStep1()) setStep(2);
            }}
            noValidate
            className="p-6 space-y-6"
          >
            <section className="border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-extrabold text-brand-900 mb-6">
                Identificación de la organización
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <FormField
                  label="Correo"
                  htmlFor="correo"
                  error={errors.correo}
                  required
                >
                  <Input
                    id="correo"
                    name="correo"
                    type="email"
                    value={data.correo}
                    onChange={onChange}
                  />
                </FormField>

                <FormField
                  label="Nombre o razón social"
                  htmlFor="razonSocial"
                  error={errors.razonSocial}
                  required
                >
                  <Input
                    id="razonSocial"
                    name="razonSocial"
                    type="text"
                    value={data.razonSocial}
                    onChange={onChange}
                  />
                </FormField>

                <FormField label="Tipo de persona" required>
                  <div className="flex flex-wrap gap-4">
                    {(["JURIDICA", "NATURAL"] as TipoPersona[]).map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="tipoPersona"
                          value={type}
                          checked={data.tipoPersona === type}
                          onChange={onChange}
                          className="accent-brand-900"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </FormField>

                {data.tipoPersona === "JURIDICA" && (
                  <FormField
                    label="Nombre del representante legal"
                    htmlFor="representante"
                    error={errors.representante}
                    required
                  >
                    <Input
                      id="representante"
                      name="representante"
                      type="text"
                      value={data.representante}
                      onChange={onChange}
                    />
                  </FormField>
                )}

                <FormField label="Tipo de identificación" required>
                  <div className="flex flex-wrap gap-4">
                    {TIPO_ID_OPTIONS.map(({ value, label }) => (
                      <label
                        key={value}
                        className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="tipoId"
                          value={value}
                          checked={data.tipoId === value}
                          onChange={onChange}
                          className="accent-brand-900"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </FormField>

                <FormField
                  label="Número de identificación"
                  htmlFor="numeroId"
                  error={errors.numeroId}
                  required
                >
                  <Input
                    id="numeroId"
                    name="numeroId"
                    type="text"
                    value={data.numeroId}
                    onChange={onChange}
                  />
                </FormField>

                <FormField
                  label="Dirección de la empresa"
                  htmlFor="direccion"
                  error={errors.direccion}
                  required
                >
                  <Input
                    id="direccion"
                    name="direccion"
                    type="text"
                    placeholder="Calle #, Ciudad, Departamento"
                    value={data.direccion}
                    onChange={onChange}
                  />
                </FormField>

                <FormField
                  label="Georreferenciación"
                  htmlFor="georef"
                  error={errors.georef}
                  required
                  hint="Selecciona en el mapa o ingresa coordenadas (lat, lng)"
                >
                  <Input
                    id="georef"
                    name="georef"
                    type="text"
                    value={data.georef}
                    onChange={onChange}
                  />
                </FormField>
              </div>

              {/* --- OpenStreetMap --- */}
              <div className="mt-6 rounded-lg overflow-hidden">
                <MapContainer center={mapCenter} zoom={6} style={mapContainerStyle}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MapClickHandler />
                </MapContainer>
                <p className="text-sm text-gray-500 mt-2">
                  Haz clic en el mapa para establecer la ubicación exacta.
                </p>
              </div>
            </section>

            <div className="flex justify-end pt-6">
              <Button type="submit" variant="primary">
                Siguiente →
              </Button>
            </div>
          </form>
        )}

        {/* --- Paso 2: Preguntas adicionales --- */}
        {step === 2 && (
          <form onSubmit={onSubmit} className="p-6 space-y-6">
            <section className="border border-gray-200 rounded-xl p-5">
              <h3 className="text-lg font-extrabold text-brand-900 mb-6">
                Información adicional
              </h3>

              <FormField
                label="1. ¿Cuál es la actividad económica de su empresa?"
                htmlFor="actividad"
                error={errors.actividad}
                required
              >
                <Input
                  id="actividad"
                  name="actividad"
                  type="text"
                  value={data.actividad}
                  onChange={onChange}
                />
              </FormField>

              <FormField
                label="2. ¿Cuántas personas trabajan en su empresa?"
                htmlFor="numTrabajadores"
                error={errors.numTrabajadores}
                required
              >
                <Input
                  id="numTrabajadores"
                  name="numTrabajadores"
                  type="number"
                  value={data.numTrabajadores}
                  onChange={onChange}
                />
              </FormField>

              <FormField
                label="3. ¿Cuál es la jornada laboral?"
                htmlFor="jornada"
                error={errors.jornada}
                required
              >
                <Input
                  id="jornada"
                  name="jornada"
                  type="text"
                  value={data.jornada}
                  onChange={onChange}
                />
              </FormField>

              <FormField
                label="4. ¿Cuáles son las entradas y salidas de sus procesos productivos o servicios?"
                htmlFor="entradasSalidas"
                error={errors.entradasSalidas}
                required
              >
                <textarea
                  id="entradasSalidas"
                  name="entradasSalidas"
                  value={data.entradasSalidas}
                  onChange={onChange}
                  className="w-full border rounded-lg p-2 h-24"
                />
              </FormField>

              <FormField
                label="5. En caso de no tener identificado el numeral 4, describa cuáles son sus procesos operativos y qué insumos y materiales utiliza"
                htmlFor="procesosSinES"
                error={errors.procesosSinES}
              >
                <textarea
                  id="procesosSinES"
                  name="procesosSinES"
                  value={data.procesosSinES}
                  onChange={onChange}
                  className="w-full border rounded-lg p-2 h-24"
                />
              </FormField>

              {/* Pregunta 6 (Sistema de Gestión Ambiental) */}
              <FormField
                label="6. ¿La empresa cuenta con un Sistema de Gestión Ambiental implementado? En caso afirmativo, indique qué documentación posee y adjunte los archivos correspondientes."
                htmlFor="sistemaAmbiental"
                error={(errors as any).sistemaAmbiental}
                required
              >
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sistemaAmbiental"
                      value="SI"
                      checked={sistemaAmbiental === "SI"}
                      onChange={() => {
                        setSistemaAmbiental("SI");
                        // clear error if any
                        if ((errors as any).sistemaAmbiental) {
                          setErrors((prev) => ({ ...prev, sistemaAmbiental: undefined }));
                        }
                      }}
                      className="accent-brand-900"
                    />
                    Sí
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sistemaAmbiental"
                      value="NO"
                      checked={sistemaAmbiental === "NO"}
                      onChange={() => {
                        setSistemaAmbiental("NO");
                        setDocumentosAmbientales(null);
                        if ((errors as any).sistemaAmbiental || (errors as any).documentosAmbientales) {
                          setErrors((prev) => ({ ...prev, sistemaAmbiental: undefined, documentosAmbientales: undefined }));
                        }
                      }}
                      className="accent-brand-900"
                    />
                    No
                  </label>
                </div>
              </FormField>

              {sistemaAmbiental === "SI" && (
                <FormField
                  label="Adjuntar documentación (PDF, Word, Excel, imágenes)"
                  htmlFor="documentosAmbientales"
                  error={(errors as any).documentosAmbientales}
                >
                  <input
                    id="documentosAmbientales"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                    onChange={onFileChange}
                    className="border border-gray-300 rounded-lg p-2"
                  />
                </FormField>
              )}

              <div className="pt-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="aceptaTratamiento"
                    name="aceptaTratamiento"
                    checked={data.aceptaTratamiento}
                    onChange={onChange}
                    className="h-4 w-4 accent-brand-900"
                  />
                  <label htmlFor="aceptaTratamiento" className="text-sm">
                    Acepto el tratamiento de mis datos personales.
                  </label>
                </div>
                {errors.aceptaTratamiento && (
                  <p className="text-sm font-bold text-red-600 mt-2">
                    {errors.aceptaTratamiento}
                  </p>
                )}
              </div>
            </section>

            <div className="flex justify-between pt-6 border-t mt-6">
              <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                ← Atrás
              </Button>

              <Button type="submit" variant="primary">
                Enviar diagnóstico
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
