import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

export default function Login() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!email.trim() || !password) {
      return;
    }

    try {
      await login(email.trim().toLowerCase(), password);
      setPassword("");
    } catch (err) { }
  };

  return (
    <div className="bg-white font-sans min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row-reverse rounded-lg overflow-hidden md:shadow-2xl md:h-[600px]">
        <div className="w-full md:w-1/2 p-8 lg:p-12 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-sm" aria-live="polite">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
              Iniciar sesión
            </h1>
            <p className="text-sm mb-6 text-gray-600 text-center">
              Plataforma de gestión ambiental de <strong>Nova Growth</strong>
            </p>

            <span className="text-xs mb-4 text-gray-500 block text-center">
              Ingresa tus credenciales
            </span>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              aria-required
              className="border-brand-900 focus:border-brand-800 focus:ring-brand-900/20"
            />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              aria-required
              className="border-brand-900 focus:border-brand-800 focus:ring-brand-900/20"
            />

            {error && (
              <div
                role="alert"
                className="text-red-700 font-bold mt-2 text-sm text-center"
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              aria-disabled={isLoading}
              className="
                w-full mt-4 rounded-full border border-accent bg-brand-900 
                text-white text-xs font-extrabold uppercase tracking-wider py-3
                hover:brightness-110 active:scale-95 transition-transform
              "
            >
              {isLoading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </div>

        <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col items-center justify-center text-center bg-gradient-to-r from-brand-800 to-brand-900 text-white">
          <h1 className="text-4xl font-extrabold">¡Bienvenido!</h1>
          <div className="my-6">
            <img
              src="/img/LOGO.png"
              alt="Logo Nova Growth"
              className="w-32 mx-auto"
            />
          </div>
          <p className="leading-relaxed">
            Para continuar, inicia sesión con las credenciales proporcionadas
            por la compañía.
          </p>
        </div>
      </div>
    </div>
  );
}
