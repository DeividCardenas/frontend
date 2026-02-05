import { useState, useRef, useEffect } from "react";
import { PlanStatus } from "../../types/mejora";

type StatusBadgeProps = {
  currentStatus: PlanStatus;
  onStatusChange: (newStatus: PlanStatus) => void;
};

const statusOptions: PlanStatus[] = [
  "Pendiente",
  "En Progreso",
  "Completado",
  "Retrasado",
];

const statusColors: Record<PlanStatus, string> = {
  Pendiente: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  "En Progreso": "bg-blue-100 text-blue-800 hover:bg-blue-200",
  Completado: "bg-green-100 text-green-800 hover:bg-green-200",
  Retrasado: "bg-red-100 text-red-800 hover:bg-red-200",
};

export const StatusBadge = ({
  currentStatus,
  onStatusChange,
}: StatusBadgeProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (newStatus: PlanStatus) => {
    onStatusChange(newStatus);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-colors flex items-center gap-1.5 ${statusColors[currentStatus]}`}
      >
        {currentStatus}
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-40 bg-white rounded-lg shadow-xl border z-10">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => handleSelect(status)}
              className={`w-full text-left block px-3 py-2 text-sm hover:bg-gray-100 ${
                status === currentStatus
                  ? "font-bold text-blue-600"
                  : "text-gray-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
