export type Role = {
  id_rol?: number;
  nombre?: string;
};

export type User = {
  id_usuario?: number;
  nombre?: string;
  correo?: string;
  activo?: boolean;
  roles?: Role[];
};

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser?: () => Promise<void>;
};
