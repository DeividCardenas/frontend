import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { SIDEBAR_MODULES } from "../../config/constants";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);
  const location = useLocation();

  const handleMenuToggle = (key: string) => {
    setOpenMenuKey((prevKey) => (prevKey === key ? null : key));
  };

  const sidebarClasses = `w-72 bg-gray-50 border-r border-gray-200 flex flex-col fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out md:static md:translate-x-0`;
  const transformClass = isOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        ></div>
      )}

      <aside className={`${sidebarClasses} ${transformClass}`}>
        {/* HEADER */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="font-extrabold text-gray-800">Módulos</div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-800"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔎
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Buscar módulo..."
            />
          </div>
        </div>

        {/* MODULES */}
        <nav className="flex-grow overflow-y-auto p-2">
          {SIDEBAR_MODULES.map((module) => {
            const isParentActive = location.pathname.startsWith(module.path);
            const isMenuOpen = openMenuKey === module.key;

            if (module.subModules && module.subModules.length > 0) {
              // 🔹 MÓDULO CON SUBMÓDULOS (como Liderazgo → Roles y Permisos)
              return (
                <div key={module.key}>
                  <button
                    onClick={() => handleMenuToggle(module.key)}
                    className={`w-full flex items-center p-3 my-1 rounded-lg text-left transition-colors duration-150 ${
                      isParentActive
                        ? "text-blue-800 font-bold bg-blue-100"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="text-2xl mr-4">{module.icon}</div>
                    <div className="flex-grow">
                      <div className="text-sm">{module.title}</div>
                    </div>
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        isMenuOpen ? "rotate-90" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {isMenuOpen && (
                    <div className="pl-10 py-1 space-y-1">
                      {module.subModules.map((sub) => (
                        <NavLink
                          key={sub.key}
                          to={sub.path}
                          onClick={() => setIsOpen(false)}
                          className={({ isActive }) =>
                            `block p-2 rounded-md text-sm transition-colors ${
                              isActive
                                ? "bg-blue-200 text-blue-900 font-semibold"
                                : "text-gray-600 hover:bg-gray-200"
                            }`
                          }
                        >
                          {sub.title}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // 🔹 MÓDULO SIMPLE SIN SUBMÓDULOS
            return (
              <NavLink
                key={module.key}
                to={module.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center p-3 my-1 rounded-lg text-left transition-colors duration-150 ${
                    isActive
                      ? "bg-blue-100 text-blue-800 font-bold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <div className="text-2xl mr-4">{module.icon}</div>
                <div>
                  <div className="text-sm">{module.title}</div>
                </div>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
