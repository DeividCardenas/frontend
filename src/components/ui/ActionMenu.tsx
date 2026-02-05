import { useState, useRef, useEffect } from "react";

type ActionMenuProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export const ActionMenu = ({ onEdit, onDelete }: ActionMenuProps) => {
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

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200"
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-xl border z-10">
          <button
            onClick={onEdit}
            className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Modificar
          </button>
          <button
            onClick={onDelete}
            className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
};
