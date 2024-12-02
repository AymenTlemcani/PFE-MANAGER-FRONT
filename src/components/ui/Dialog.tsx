import React from "react";
import { Button } from "./Button";
import type { ButtonProps } from "./Button";
import { X } from "lucide-react";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: ButtonProps["variant"];
  onConfirm?: () => void;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  onConfirm,
}: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/25" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {title && (
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {title}
            </h3>
          )}

          {description && (
            <p className="text-sm text-gray-500 mb-4">{description}</p>
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
