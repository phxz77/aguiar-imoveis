import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light" | "dark";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

export function Logo({
  variant = "default",
  size = "md",
  href = "/",
  className,
}: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: "text-sm", sub: "text-[9px]" },
    md: { icon: 40, text: "text-base", sub: "text-[10px]" },
    lg: { icon: 52, text: "text-xl", sub: "text-xs" },
  };

  const s = sizes[size];

  const textColor =
    variant === "light"
      ? "text-white"
      : variant === "dark"
        ? "text-[#0B2344]"
        : "text-[#0B2344]";

  const subColor =
    variant === "light" ? "text-[#C79A3B]" : "text-[#C79A3B]";

  const LogoIcon = () => (
    <svg
      width={s.icon}
      height={s.icon}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <rect
        width="40"
        height="40"
        rx="10"
        fill={variant === "light" ? "rgba(255,255,255,0.12)" : "#0B2344"}
      />
      {/* Letter A */}
      <path
        d="M10 30 L20 10 L30 30"
        stroke={variant === "light" ? "white" : "white"}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line
        x1="13"
        y1="24"
        x2="27"
        y2="24"
        stroke={variant === "light" ? "white" : "white"}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Gold roof triangle */}
      <path d="M20 14 L16 22 L24 22 Z" fill="#C79A3B" />
      {/* Gold building columns */}
      <rect x="27" y="19" width="3" height="8" rx="0.5" fill="#C79A3B" />
      <rect x="31.5" y="16" width="3" height="11" rx="0.5" fill="#C79A3B" opacity="0.7" />
    </svg>
  );

  const content = (
    <div className={cn("flex items-center gap-2.5 group", className)}>
      <LogoIcon />
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display font-bold tracking-tight leading-none",
            s.text,
            textColor
          )}
        >
          Aguiar Imóveis
        </span>
        <span
          className={cn(
            "font-semibold uppercase tracking-[0.18em] mt-1",
            s.sub,
            subColor
          )}
        >
          Corretor de Imóveis
        </span>
      </div>
    </div>
  );

  if (!href) return content;

  return <Link href={href}>{content}</Link>;
}

/* Compact icon-only version for favicon / loading */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="10" fill="#0B2344" />
      <path
        d="M10 30 L20 10 L30 30"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="13" y1="24" x2="27" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 14 L16 22 L24 22 Z" fill="#C79A3B" />
      <rect x="27" y="19" width="3" height="8" rx="0.5" fill="#C79A3B" />
      <rect x="31.5" y="16" width="3" height="11" rx="0.5" fill="#C79A3B" opacity="0.7" />
    </svg>
  );
}
