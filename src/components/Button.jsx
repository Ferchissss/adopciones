import React from "react";

export const Button = ({ children, className, variant, ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded ${variant === "outline" ? "border" : "bg-emerald-600 text-white"} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};