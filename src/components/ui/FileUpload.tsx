import { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";

type FileUploadProps = {
  onFileUpload: (files: File[]) => void;
};

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.filter(
        (newFile) =>
          !uploadedFiles.some(
            (existingFile) => existingFile.name === newFile.name
          )
      );
      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      onFileUpload(updatedFiles);
    },
    [uploadedFiles, onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // Specify accepted file types here
    // accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg'] }
  });

  const handleRemoveFile = (fileName: string) => {
    const updatedFiles = uploadedFiles.filter((file) => file.name !== fileName);
    setUploadedFiles(updatedFiles);
    onFileUpload(updatedFiles);
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-600">Suelta los archivos aquí...</p>
        ) : (
          <p className="text-gray-500">
            Arrastra archivos aquí, o haz clic para seleccionarlos
          </p>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="font-semibold text-sm">Archivos seleccionados:</p>
          {uploadedFiles.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between bg-gray-100 p-2 rounded-md text-sm"
            >
              <span>{file.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveFile(file.name)}
                className="text-red-600 hover:text-red-800 font-bold"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
