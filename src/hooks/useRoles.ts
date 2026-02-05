// src/hooks/useRoles.ts
import { useEffect, useMemo, useState } from "react";
import { Role, RoleInput, PermissionAction, AppModule } from "../types/role";
import { listRoles, createRole, updateRole, deleteRole, importRolesCSV } from "../api/roles.api";

export const ACTIONS: PermissionAction[] = ["read","create","update","delete","export"];
export const MODULES: AppModule[]   = ["dashboard","users","roles","reports","settings"];

const sortByIdAsc = (list: Role[]) =>
  [...list].sort((a, b) => (parseInt(a.id, 10) || 0) - (parseInt(b.id, 10) || 0));

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await listRoles();
        setRoles(sortByIdAsc(data));
      } catch (e: any) {
        setError(e?.message ?? "Error cargando roles");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter(r =>
      r.name.toLowerCase().includes(q) ||
      (r.description ?? "").toLowerCase().includes(q)
    );
  }, [roles, search]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / pageSize)), [filtered, pageSize]);

  function toggleSelect(id: string) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }
  function clearSelection() { setSelectedIds([]); }

  async function addRole(data: RoleInput) {
    const created = await createRole(data);
    setRoles(prev => sortByIdAsc([...prev, created]));
  }
  async function editRole(id: string, data: RoleInput) {
    const updated = await updateRole(id, data);
    setRoles(prev => sortByIdAsc(prev.map(r => (r.id === id ? updated : r))));
  }
  async function removeRole(id: string) {
    await deleteRole(id);
    setRoles(prev => sortByIdAsc(prev.filter(r => r.id !== id)));
  }
  async function importCSV(file: File) {
    const merged = await importRolesCSV(file);
    setRoles(sortByIdAsc(merged));
  }

  return {
    roles, loading, error,
    search, setSearch, page, setPage, pageSize, setPageSize, totalPages, paged,
    selectedIds, toggleSelect, clearSelection,
    addRole, editRole, removeRole, importCSV,
    ACTIONS, MODULES,
  };
}
