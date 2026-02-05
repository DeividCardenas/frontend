import { Role } from "../../types/role";

type Props = {
  rows: Role[];
  selectedIds: string[];
  toggleSelect: (id: string) => void;
};

export default function RoleTable({ rows, selectedIds, toggleSelect }: Props) {
  return (
    <div className="overflow-auto rounded-lg border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="p-3 w-10"></th>
            <th className="text-left p-3 font-semibold">Id</th>
            <th className="text-left p-3 font-semibold">Nombre</th>
            <th className="text-left p-3 font-semibold">Descripción</th>
            <th className="text-left p-3 font-semibold">Permisos</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={r.id} className={idx % 2 ? "bg-white" : "bg-gray-50"}>
              <td className="p-3 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(r.id)}
                  onChange={() => toggleSelect(r.id)}
                />
              </td>
              <td className="p-3">{r.id}</td>
              <td className="p-3 font-medium">{r.name}</td>
              <td className="p-3 text-gray-600">{r.description || "—"}</td>
              <td className="p-3">
                <div className="flex flex-wrap gap-1">
                  {r.permissions.slice(0, 12).map((p, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-800 text-xs">
                      {p.module}:{p.action}
                    </span>
                  ))}
                  {r.permissions.length > 12 && (
                    <span className="text-xs text-gray-500">
                      +{r.permissions.length - 12}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="p-6 text-center text-gray-500">Sin resultados.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
