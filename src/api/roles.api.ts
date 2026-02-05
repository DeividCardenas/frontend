// src/api/roles.api.ts
import api from "./axios";
import { Role, RoleInput } from "../types/role";

const LS_KEY = "nv_roles_storage_v1";
const useMock = true;

/* -------------------- Helpers -------------------- */
function sortByIdAsc(list: Role[]): Role[] {
  return [...list].sort((a, b) => (parseInt(a.id, 10) || 0) - (parseInt(b.id, 10) || 0));
}
function readLS(): Role[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Role[]) : [];
  } catch {
    return [];
  }
}
function writeLS(data: Role[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(sortByIdAsc(data)));
}
function ensureSeed(): Role[] {
  let data = readLS();
  if (data.length === 0) {
    data = [
      {
        id: "1",
        name: "Administrador",
        description: "Acceso total al sistema",
        permissions: [
          { module: "dashboard", action: "read" },
          { module: "users", action: "read" },
          { module: "users", action: "create" },
          { module: "users", action: "update" },
          { module: "users", action: "delete" },
          { module: "roles", action: "read" },
          { module: "roles", action: "create" },
          { module: "roles", action: "update" },
          { module: "roles", action: "delete" },
          { module: "reports", action: "read" },
          { module: "reports", action: "export" },
          { module: "settings", action: "update" },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    writeLS(data);
  }
  return sortByIdAsc(data);
}
function getMaxNumericId(list: Role[]): number {
  return list.reduce((max, r) => {
    const n = parseInt(r.id, 10);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0);
}

/* -------------------- API -------------------- */
export async function listRoles(): Promise<Role[]> {
  if (!useMock) {
    const res = await api.get("/roles");
    return sortByIdAsc(res.data as Role[]);
  }
  return ensureSeed();
}

export async function createRole(input: RoleInput): Promise<Role> {
  if (!useMock) {
    const res = await api.post("/roles", input);
    return res.data;
  }
  const existing = ensureSeed();
  const newId = String(getMaxNumericId(existing) + 1);
  const role: Role = {
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...input,
  };
  writeLS([role, ...existing]);
  return role;
}

export async function updateRole(id: string, input: RoleInput): Promise<Role> {
  if (!useMock) {
    const res = await api.put(`/roles/${id}`, input);
    return res.data;
  }
  const list = ensureSeed();
  const updatedList = list.map((r) =>
    r.id === id ? { ...r, ...input, updatedAt: new Date().toISOString() } : r
  );
  writeLS(updatedList);
  return updatedList.find((r) => r.id === id)!;
}

export async function deleteRole(id: string): Promise<void> {
  if (!useMock) {
    await api.delete(`/roles/${id}`);
    return;
  }
  writeLS(ensureSeed().filter((r) => r.id !== id));
}

/* -------------------- Export/Import CSV -------------------- */
export function exportRolesCSV(roles: Role[]): Blob {
  const headers = ["id", "name", "description", "permissions", "createdAt", "updatedAt"];
  const rows = sortByIdAsc(roles).map((r) => {
    const perms = r.permissions.map((p) => `${p.module}:${p.action}`).join("|");
    const cols = [r.id, r.name, r.description ?? "", perms, r.createdAt, r.updatedAt];
    const escaped = cols.map((v) => `"${String(v).replace(/"/g, '""')}"`);
    return escaped.join(",");
  });
  const csv = [headers.join(","), ...rows].join("\n");
  return new Blob([csv], { type: "text/csv;charset=utf-8;" });
}

export async function importRolesCSV(file: File): Promise<Role[]> {
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length <= 1) return ensureSeed();

  const header = lines[0];
  const dataLines = lines.slice(1);
  const headers = header.split(",").map((h) => h.replace(/^"|"$/g, ""));
  const idx = (k: string) => headers.indexOf(k);
  const parseLine = (line: string): string[] => {
    const re = /("([^"]|"")*"|[^,]+)/g;
    const cols = line.match(re) || [];
    return cols.map((c) => c.replace(/^"|"$/g, "").replace(/""/g, `"`));
  };

  const base = ensureSeed();
  let currentMax = getMaxNumericId(base);

  const imported: Role[] = dataLines.map((line) => {
    const cols = parseLine(line);
    const rawPerms = (cols[idx("permissions")] || "").split("|").filter(Boolean);
    const permissions = rawPerms.map((p) => {
      const [module, action] = p.split(":");
      return { module, action } as any;
    });

    const maybeId = (cols[idx("id")] || "").trim();
    let id = maybeId;
    if (!maybeId || isNaN(parseInt(maybeId, 10))) id = String(++currentMax);
    else currentMax = Math.max(currentMax, parseInt(maybeId, 10));

    const name = cols[idx("name")] || "Sin nombre";
    const description = cols[idx("description")] || "";
    const createdAt = cols[idx("createdAt")] || new Date().toISOString();

    return {
      id,
      name,
      description,
      permissions,
      createdAt,
      updatedAt: new Date().toISOString(),
    } as Role;
  });

  const merged = [
    ...imported,
    ...base.filter((b) => !imported.find((i) => i.id === b.id)),
  ];
  writeLS(merged);
  return sortByIdAsc(merged);
}
