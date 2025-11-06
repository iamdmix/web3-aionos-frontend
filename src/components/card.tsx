import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  const baseClasses = "rounded-lg border border-gray-200 bg-white";
  const hoverClasses = hover ? "hover:shadow-md transition-shadow" : "";

  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}
