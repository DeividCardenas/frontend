import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
} & React.ComponentProps<"button">;

export const Button = ({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) => {
  const baseClasses =
    "px-5 py-2.5 font-bold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform duration-150 active:scale-95 flex items-center justify-center gap-2";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-brand-800 to-brand-900 text-white border border-brand-900 hover:brightness-110 focus:ring-brand-800",
    secondary:
      "bg-white text-brand-900 border-2 border-brand-900 hover:bg-gray-50 focus:ring-brand-800",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-400",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
};
