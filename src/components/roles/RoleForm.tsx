import { useEffect, useState } from "react";
import { Role, RoleInput, Permission } from "../../types/role";
import { ACTIONS, MODULES } from "../../hooks/useRoles";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { FormField } from "../../components/forms/FormField";

type Props = {
  initial?: Role | null;
  onSubmit: (data: RoleInput) => Promise<void> | void;
  onCancel: () => void;
};

export default function RoleForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [permissions, setPermissions] = useState<Permission[]>(initial?.permissions ?? []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setDescription(initial.description ?? "");
      setPermissions(initial.permissions);
    }
  }, [initial]);

  function togglePermission(module: Permission["module"], action: Permission["action"]) {
    const exists = permissions.some(p => p.module === module && p.action === action);
    setPermissions(prev =>
      exists
        ? prev.filter(p => !(p.module === module && p.action === action))
        : [...prev, { module, action }]
    );
  }

  // ✅ Nueva función: marcar o desmarcar todos los permisos de un módulo
  function toggleAll(module: Permission["module"]) {
    const modulePerms = permissions.filter(p => p.module === module);
    const allSelected = modulePerms.length === ACTIONS.length;

    setPermissions(prev => {
      if (allSelected) {
        // Quita todos los permisos del módulo
        return prev.filter(p => p.module !== module);
      } else {
        // Agrega los permisos faltantes del módulo
        const newPerms = ACTIONS.filter(
          a => !modulePerms.some(p => p.action === a)
        ).map(a => ({ module, action: a }));

        return [...prev, ...newPerms];
      }
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ name, description, permissions });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <FormField label="Nombre del rol" required>
          <Input value={name} onChange={e => setName(e.target.value)} required />
        </FormField>
        <FormField label="Descripción">
          <Input value={description} onChange={e => setDescription(e.target.value)} />
        </FormField>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">Permisos</h3>
          <button
            type="button"
            onClick={() => setPermissions([])}
            className="text-xs underline"
          >
            Limpiar
          </button>
        </div>

        <div className="overflow-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3 font-semibold">Módulo</th>
                {ACTIONS.map(a => (
                  <th key={a} className="p-3 capitalize font-semibold">
                    {a}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODULES.map(m => {
                const allChecked = ACTIONS.every(a =>
                  permissions.some(p => p.module === m && p.action === a)
                );

                return (
                  <tr key={m} className="odd:bg-white even:bg-gray-50">
                    <td className="p-3 font-medium capitalize flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={allChecked}
                        onChange={() => toggleAll(m)}
                      />
                      {m}
                    </td>
                    {ACTIONS.map(a => {
                      const checked = permissions.some(
                        p => p.module === m && p.action === a
                      );
                      return (
                        <td key={a} className="p-3 text-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={checked}
                            onChange={() => togglePermission(m, a)}
                          />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Guardando…" : initial ? "Actualizar" : "Crear"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
