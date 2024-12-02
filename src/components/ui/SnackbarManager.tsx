import { Snackbar } from "./Snackbar";

// import React from "react";

export interface SnackbarItem {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  onUndo?: () => void;
}

interface SnackbarManagerProps {
  snackbars: SnackbarItem[];
  onClose: (id: string) => void;
}

export function SnackbarManager({ snackbars, onClose }: SnackbarManagerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-3 pointer-events-none">
      {snackbars.map((snackbar) => (
        <div key={snackbar.id} className="pointer-events-auto">
          <Snackbar
            key={`${snackbar.id}-${snackbar.message}`}
            message={snackbar.message}
            type={snackbar.type}
            isOpen={true}
            onClose={() => onClose(snackbar.id)}
            onUndo={snackbar.onUndo}
          />
        </div>
      ))}
    </div>
  );
}
