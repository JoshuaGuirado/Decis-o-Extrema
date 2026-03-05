import { HTMLMotionProps, motion } from "motion/react";
import { ReactNode } from "react";
import { cn } from "../lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wider font-mono";

  const variants = {
    primary:
      "bg-cyan-600 text-white hover:bg-cyan-500 shadow-[0_0_20px_rgba(8,145,178,0.4)] border border-cyan-400/20 hover:scale-105 hover:border-cyan-500/50 transition-all duration-300",
    outline:
      "border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 hover:text-white text-zinc-300 backdrop-blur-sm hover:scale-105 hover:border-cyan-500/50 transition-all duration-300",
    ghost: "hover:bg-zinc-800 hover:text-white text-zinc-400 hover:scale-105 hover:border-cyan-500/50 transition-all duration-300",
  };

  const sizes = {
    sm: "h-9 px-4 text-xs",
    md: "h-11 px-8 text-sm",
    lg: "h-14 px-10 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
      {variant === "primary" && (
        <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10" />
      )}
    </motion.button>
  );
}
