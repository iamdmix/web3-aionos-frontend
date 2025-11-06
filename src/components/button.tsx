import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-1";

  const variantClasses = {
    primary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900",
    secondary:
      "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus:ring-gray-300",
    ghost:
      "border border-gray-900 bg-transparent text-gray-900 hover:bg-gray-50 focus:ring-gray-900",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
