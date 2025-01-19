import { cn } from "../../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline";
  children: React.ReactNode;
}

export function Badge({
  variant = "default",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100":
            variant === "default",
          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100":
            variant === "secondary",
          "border border-gray-200 dark:border-gray-700": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}
