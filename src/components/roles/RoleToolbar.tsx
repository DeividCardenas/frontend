import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import React from "react";

type Props = {
  onInsert: () => void;
  onModify: () => void;
  onDelete: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  search: string;
  setSearch: (v: string) => void;
  pageSize: number;
  setPageSize: (n: number) => void;
};

export default function RoleToolbar({
  onInsert,
  onModify,
  onDelete,
  onExport,
  onImport,
  search,
  setSearch,
  pageSize,
  setPageSize,
}: Props) {
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Botones */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={onInsert}
          className="border-blue-700 text-blue-700 hover:scale-105 hover:bg-blue-50 transition-transform duration-200"
        >
          Insertar
        </Button>

        <Button
          variant="secondary"
          onClick={onModify}
          className="border-blue-700 text-blue-700 hover:scale-105 hover:bg-blue-50 transition-transform duration-200"
        >
          Modificar
        </Button>

        <Button
          variant="secondary"
          onClick={onDelete}
          className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white hover:scale-105 transition-transform duration-200"
        >
          Eliminar
        </Button>

        <Button
          variant="secondary"
          onClick={onExport}
          className="border-blue-700 text-blue-700 hover:scale-105 hover:bg-blue-50 transition-transform duration-200"
        >
          Exportar
        </Button>

        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])}
        />

        <Button
          variant="secondary"
          onClick={() => fileRef.current?.click()}
          className="border-blue-700 text-blue-700 hover:scale-105 hover:bg-blue-50 transition-transform duration-200"
        >
          Importar
        </Button>
      </div>

      {/* Controles de búsqueda y paginación */}
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-sm text-gray-600">Mostrar</label>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(parseInt(e.target.value))}
          className="border rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-700 outline-none"
        >
          {[10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <div className="w-64">
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="focus:ring-2 focus:ring-blue-700"
          />
        </div>
      </div>
    </div>
  );
}
