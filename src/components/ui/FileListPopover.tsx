import { useState, useRef, useEffect } from "react";
import { EvidenceFile } from "../../types/mejora";

type FileListPopoverProps = {
  files: EvidenceFile[];
};

export const FileListPopover = ({ files }: FileListPopoverProps) => {
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

  if (files.length === 0) {
    return <span className="text-gray-400">—</span>;
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
      >
        📄
        <span>{files.length} Archivo(s)</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-xl border z-10">
          <div className="p-2 font-semibold text-sm border-b">
            Archivos de Evidencia
          </div>
          <div className="p-2 max-h-48 overflow-y-auto">
            {files.map((file) => (
              <a
                key={file.id}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-left p-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 truncate"
                title={file.name}
              >
                {file.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
