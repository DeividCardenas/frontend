import { EvidenceFile } from "../../../types/mejora";

type EvidencePanelProps = {
  files: EvidenceFile[];
};

export const EvidencePanel = ({ files }: EvidencePanelProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 h-full flex flex-col">
      <h3 className="font-bold text-gray-800 flex-shrink-0">
        Evidencias ({files.length})
      </h3>

      <div className="mt-4 space-y-2 flex-grow overflow-y-auto max-h-96 pr-2">
        {files.length > 0 ? (
          files.map((file) => (
            <a
              key={file.id}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-2 rounded-md hover:bg-gray-100 text-blue-600 truncate"
              title={file.name}
            >
              📄 {file.name}
            </a>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No hay archivos de evidencia.
          </p>
        )}
      </div>
    </div>
  );
};
