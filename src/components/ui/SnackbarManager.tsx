import { Snackbar } from "./Snackbar";

// import React from "react";

// Update SnackbarItem interface to match the store type
export interface SnackbarItem {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  onUndo?: () => void;
}

interface SnackbarManagerProps {
  snackbars: SnackbarItem[];
  onClose: (id: number) => void; // Update to accept number instead of string
}

export function SnackbarManager({ snackbars, onClose }: SnackbarManagerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-3 pointer-events-none">
      {snackbars.map((snackbar) => (
        <div key={snackbar.id} className="pointer-events-auto">
          <Snackbar
            message={snackbar.message}
            type={snackbar.type}
            isOpen={true}
            onClose={() => onClose(parseInt(snackbar.id))}
            onUndo={snackbar.onUndo}
          />
        </div>
      ))}
    </div>
  );
}
