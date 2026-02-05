export type PermissionAction = "read" | "create" | "update" | "delete" | "export";
export type AppModule = "dashboard" | "users" | "roles" | "reports" | "settings";

export interface Permission {
  module: AppModule;
  action: PermissionAction;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleInput {
  name: string;
  description?: string;
  permissions: Permission[];
}
