import React from "react";
import { Button } from "./Button";
import type { ButtonProps } from "./Button";
import { X } from "lucide-react";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onClickOutside?: () => void;
  title?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: ButtonProps["variant"];
  onConfirm?: () => void;
  className?: string;
}

export function Dialog({
  isOpen,
  onClose,
  onClickOutside,
  title,
  description,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  onConfirm,
  className = "max-w-2xl w-full",
}: DialogProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClickOutside?.();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="min-h-screen px-4 flex items-center justify-center bg-black/50">
        <div
          className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl mx-auto ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {title && (
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 mb-4">
              {title}
            </h3>
          )}

          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {description}
            </p>
          )}

          {children}

          {onConfirm && (
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                {cancelText}
              </Button>
              <Button
                variant={confirmVariant}
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
