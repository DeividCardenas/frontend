type FormFieldProps = {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
};

export const FormField = ({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
}: FormFieldProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="font-bold text-gray-800">
        {label}
        {required && <span className="text-red-600 font-black"> *</span>}
      </label>

      {children}

      {hint && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-sm font-bold text-red-600">{error}</p>}
    </div>
  );
};
