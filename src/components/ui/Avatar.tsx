import { cn } from "../../lib/utils";

interface AvatarProps {
  src?: string;
  fallback: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ src, fallback, size = "md", className }: AvatarProps) {
  const sizeClasses = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-gray-100",
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={fallback}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span className="font-medium text-gray-600">{fallback}</span>
      )}
    </div>
  );
}
