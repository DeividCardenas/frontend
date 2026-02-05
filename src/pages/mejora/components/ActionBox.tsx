import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../../../hooks/useAuth";

type ActionBoxProps = {
  onPublish: (comment: string, files: File[]) => void;
};

export const ActionBox = ({ onPublish }: ActionBoxProps) => {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const handleRemoveFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f.name !== fileName));
  };

  const handleSubmit = () => {
    if (comment.trim() === "" && files.length === 0) return;
    onPublish(comment, files);
    setComment("");
    setFiles([]);
  };

  return (
    <div {...getRootProps()} className="bg-white rounded-xl shadow-md">
      <div className="p-4">
        <textarea
          className="w-full p-2 border border-gray-200 rounded-lg"
          rows={3}
          placeholder={`Añadir una actualización...`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="mt-2 space-y-2">
          {files.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between bg-gray-100 p-2 rounded-md text-sm"
            >
              <span>📄 {file.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveFile(file.name)}
                className="text-red-600 font-bold"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-gray-50 border-t flex justify-between items-center rounded-b-xl">
        <button
          type="button"
          onClick={open}
          className="text-gray-500 hover:text-blue-600 py-2 pr-2 rounded-full max-w-min flex items-center md:max-w-max md:px-2"
        >
          <span className="text-xl md:text-lg">📎</span>
          <span className="inline">Añadir archivo(s)</span>
        </button>
        <button
          onClick={handleSubmit}
          disabled={comment.trim() === "" && files.length === 0}
          className="bg-brand-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-900 disabled:bg-gray-400"
        >
          Publicar
        </button>
      </div>
      <input {...getInputProps()} />
    </div>
  );
};
