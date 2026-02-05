// src/pages/roles/RolesPage.tsx
import { useMemo, useState } from "react";
import { useRoles } from "../../hooks/useRoles";
import { Role } from "../../types/role";
import RoleToolbar from "../../components/roles/RoleToolbar";
import RoleTable from "../../components/roles/RoleTable";
import RoleForm from "../../components/roles/RoleForm";
import { exportRolesCSV } from "../../api/roles.api";

export default function RolesPage() {
  const {
    roles, loading, error,
    search, setSearch, page, setPage, pageSize, setPageSize, totalPages, paged,
    selectedIds, toggleSelect, clearSelection,
    addRole, editRole, removeRole, importCSV,
  } = useRoles();

  const [editing, setEditing] = useState<Role | null>(null);
  const [openForm, setOpenForm] = useState(false);

  const title = useMemo(() => (editing ? "Modificar rol" : "Insertar rol"), [editing]);

  function openInsert() { setEditing(null); setOpenForm(true); }
  function openModify() {
    const pick = roles.find(r => selectedIds.includes(r.id));
    if (!pick) return alert("Seleccione un rol para modificar.");
    setEditing(pick); setOpenForm(true);
  }
  async function doDelete() {
    if (selectedIds.length === 0) return alert("Seleccione al menos un rol para eliminar.");
    if (!confirm(`Eliminar ${selectedIds.length} rol(es)?`)) return;
    for (const id of selectedIds) await removeRole(id);
    clearSelection();
  }
  function doExport() {
    const blob = exportRolesCSV(roles);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "roles.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }
  async function doImport(file: File) {
    await importCSV(file);
    setPage(1);
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-brand-800 to-brand-900 text-white rounded-xl px-5 py-4 shadow">
        <h1 className="text-lg font-bold">Roles & Permisos</h1>
        <p className="text-white/80 text-sm">Gestiona los roles del sistema y sus permisos.</p>
      </div>

      {/* Toolbar */}
      <RoleToolbar
        onInsert={openInsert}
        onModify={openModify}
        onDelete={doDelete}
        onExport={doExport}
        onImport={doImport}
        search={search}
        setSearch={setSearch}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />

      {/* Estado */}
      {loading && <div className="text-gray-600">Cargando…</div>}
      {error && <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-3 py-2">{error}</div>}

      {/* Tabla */}
      {!loading && !error && (
        <>
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <RoleTable rows={paged} selectedIds={selectedIds} toggleSelect={toggleSelect} />
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Página {page} de {totalPages}</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded border" onClick={() => setPage(1)} disabled={page === 1}>{`<<`}</button>
              <button className="px-3 py-1 rounded border" onClick={() => setPage(Math.max(1, page-1))} disabled={page === 1}>{`<`}</button>
              <button className="px-3 py-1 rounded border" onClick={() => setPage(Math.min(totalPages, page+1))} disabled={page === totalPages}>{`>`}</button>
              <button className="px-3 py-1 rounded border" onClick={() => setPage(totalPages)} disabled={page === totalPages}>{`>>`}</button>
            </div>
          </div>
        </>
      )}

      {/* Modal Form (responsive) */}
      {openForm && (
        // Overlay: en mobile items-end para que el panel aparezca desde abajo; en desktop lo centramos
        <div
          className="fixed inset-0 z-[70] bg-black/40 flex items-end sm:items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
          onClick={() => {
            /* click en overlay cierra modal */
            setOpenForm(false);
            setEditing(null);
          }}
        >
          <div
            className="w-full sm:max-w-4xl bg-white rounded-t-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl max-h-[95vh] overflow-auto z-[80]"
            onClick={(e) => e.stopPropagation()}
            role="document"
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-sm text-gray-500">{editing ? "Actualiza los datos del rol" : "Crea un nuevo rol"}</p>
              </div>
              <button
                onClick={() => { setOpenForm(false); setEditing(null); }}
                className="text-gray-500 hover:text-gray-800 ml-4"
                aria-label="Cerrar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenido (form responsivo) */}
            <RoleForm
              initial={editing}
              onSubmit={async (data) => {
                if (editing) await editRole(editing.id, data);
                else await addRole(data);
                setOpenForm(false); setEditing(null);
              }}
              onCancel={() => { setOpenForm(false); setEditing(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
