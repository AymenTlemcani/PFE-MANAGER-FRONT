import React from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode; // Add this
}

export function Input({ className, label, error, icon, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={cn(
            "w-full rounded-lg border",
            "px-4 py-2.5", // Adjusted padding
            "transition-all duration-200",
            "border-gray-300 dark:border-gray-600/50",
            "text-gray-900 dark:text-gray-100",
            "placeholder-gray-500 dark:placeholder-gray-400",
            "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm",
            "focus:border-blue-500 dark:focus:border-blue-400",
            "focus:outline-none focus:ring-2",
            "focus:ring-blue-500/20 dark:focus:ring-blue-400/20",
            "shadow-sm focus:shadow-md",
            "disabled:bg-gray-50 dark:disabled:bg-gray-900",
            "disabled:text-gray-500 dark:disabled:text-gray-400",
            "disabled:border-gray-200 dark:disabled:border-gray-700",
            error &&
              "border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/20 dark:focus:ring-red-400/20",
            icon && "pr-10", // Add padding if there's an icon
            className
          )}
          {...props}
        />
        {icon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
