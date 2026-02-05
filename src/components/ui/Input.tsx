import React from "react";

type InputProps = {
  className?: string;
} & React.ComponentProps<"input">;

export const Input = ({ className, disabled, ...props }: InputProps) => {
  const baseClasses =
    "w-full px-3 py-2 my-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

  const stateClasses = disabled
    ? "bg-gray-100 cursor-not-allowed" //
    : "";

  return (
    <input
      className={`${baseClasses} ${stateClasses} ${className || ""}`}
      disabled={disabled}
      {...props}
    />
  );
};
