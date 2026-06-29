import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "outline"
    | "available"
    | "sold"
    | "rented"
    | "reserved"
    | "featured"
    | "blue"
    | "green";
}

function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default:
      "bg-zinc-100 text-zinc-700 border border-zinc-200",
    outline:
      "border border-zinc-200 text-zinc-700 bg-transparent",
    available:
      "bg-emerald-50 text-emerald-700 border border-emerald-200",
    sold: "bg-zinc-100 text-zinc-600 border border-zinc-200",
    rented: "bg-blue-50 text-blue-700 border border-blue-200",
    reserved: "bg-amber-50 text-amber-700 border border-amber-200",
    featured:
      "bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0 shadow-sm",
    blue: "bg-blue-50 text-blue-700 border border-blue-200",
    green: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
