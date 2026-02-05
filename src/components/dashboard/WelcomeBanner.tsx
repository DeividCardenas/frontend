import { useAuth } from "../../hooks/useAuth";

export const WelcomeBanner = () => {
  const { user } = useAuth();
  return (
    <div className="p-6 rounded-xl bg-gradient-to-r from-brand-800 to-brand-900 text-white shadow-lg">
      <h2 className="text-2xl font-bold">
        ¡Bienvenido de nuevo, {user?.name || "Usuario"}!
      </h2>
      <p className="mt-1 text-white/80">
        Aquí tienes un resumen de tu actividad reciente y tareas pendientes.
      </p>
    </div>
  );
};
