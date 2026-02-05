import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

export const UserMenu = () => {
  const { user, logout } = useAuth(); // Get user data and logout function
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar and Button */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          {/* Display user's first initial, or a generic icon if no user */}
          {user ? user.email.charAt(0).toUpperCase() : "👤"}
        </div>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border py-1 z-30">
          <a
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Perfil
          </a>
          <a
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Preferencias
          </a>
          <div className="border-t my-1"></div>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};
