import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

interface SnackbarProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  type?: "success" | "error" | "info";
  autoHideDuration?: number;
  onUndo?: () => void;
}

export function Snackbar({
  message,
  isOpen,
  onClose,
  type = "success",
  autoHideDuration = 5000, // Increased to 5s for better UX
  onUndo,
}: SnackbarProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number>(); // Changed from NodeJS.Timeout to number
  const rafRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const [isClosing, setIsClosing] = useState(false);
  const mountedRef = useRef(false);

  const cleanup = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startTimeRef.current = 0;
  };

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      cleanup();
      return;
    }

    cleanup();
    setIsClosing(false);

    // Synchronize animation with the actual timing
    const startTime = performance.now();
    startTimeRef.current = startTime;

    const animate = (currentTime: number) => {
      if (!mountedRef.current) return;

      const elapsed = currentTime - startTime;
      const remaining = Math.max(0, autoHideDuration - elapsed);
      const progress = (remaining / autoHideDuration) * 100;

      if (progressRef.current) {
        progressRef.current.style.width = `${progress}%`;
      }

      if (remaining > 0) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    timerRef.current = setTimeout(() => {
      if (mountedRef.current) {
        setIsClosing(true);
        setTimeout(onClose, 300); // Animation duration
      }
    }, autoHideDuration);

    return cleanup;
  }, [isOpen, autoHideDuration, onClose]);

  if (!isOpen) return null;

  const colors = {
    success: "bg-green-100 text-green-800 border-green-200",
    error: "bg-red-100 text-red-800 border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const progressColors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  return (
    <div
      className="max-w-md w-full"
      style={{
        opacity: isClosing ? 0 : 1,
        transform: isClosing ? "translateX(100%)" : "translateX(0)",
        transition: "opacity 300ms, transform 300ms",
      }}
    >
      <div
        className={`relative overflow-hidden rounded-lg border px-4 py-3 shadow-lg ${colors[type]}`}
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium flex-1">{message}</p>
          <div className="flex items-center gap-2 shrink-0">
            {onUndo && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onUndo();
                  onClose();
                }}
                className="text-xs px-2 py-1 h-7"
              >
                Undo
              </Button>
            )}
            <button
              onClick={onClose}
              className="hover:bg-gray-200 rounded-full p-1 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div
          ref={progressRef}
          className={`absolute bottom-0 left-0 h-1 w-full transition-width ${progressColors[type]} opacity-70`}
        />
      </div>
    </div>
  );
}
