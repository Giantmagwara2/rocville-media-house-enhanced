import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "link" | "cta" | "tertiary";
  size?: "sm" | "md" | "lg" | "icon";
  isActive?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isActive, asChild, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-primary text-white hover:bg-primary-700 focus-visible:ring-primary",
      secondary: "bg-secondary text-white hover:bg-secondary-700 focus-visible:ring-secondary",
      accent: "bg-accent text-white hover:bg-accent-700 focus-visible:ring-accent",
      outline: "border border-neutral-300 bg-transparent hover:bg-neutral-100 focus-visible:ring-neutral-400",
      ghost: "bg-transparent hover:bg-neutral-100 focus-visible:ring-neutral-400",
      link: "bg-transparent underline-offset-4 hover:underline focus-visible:ring-neutral-400 p-0 h-auto",
      cta: "bg-accent text-white hover:bg-accent-600 focus-visible:ring-accent font-bold",
      tertiary: "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 focus-visible:ring-neutral-400",
    };
    
    const sizes = {
      sm: "h-9 px-3 rounded-md",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-6 text-lg",
      icon: "h-10 w-10",
    };

    // If asChild is true, we render the children directly
    if (asChild) {
      return React.cloneElement(props.children as React.ReactElement, {
        className: cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isActive && "bg-primary text-white hover:bg-primary-700",
          className
        ),
        ref,
        ...props,
      });
    }
    
    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isActive && "bg-primary text-white hover:bg-primary-700",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export const buttonVariants = ({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
} = {}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-700 focus-visible:ring-primary",
    secondary: "bg-secondary text-white hover:bg-secondary-700 focus-visible:ring-secondary",
    accent: "bg-accent text-white hover:bg-accent-700 focus-visible:ring-accent",
    outline: "border border-neutral-300 bg-transparent hover:bg-neutral-100 focus-visible:ring-neutral-400",
    ghost: "bg-transparent hover:bg-neutral-100 focus-visible:ring-neutral-400",
    link: "bg-transparent underline-offset-4 hover:underline focus-visible:ring-neutral-400 p-0 h-auto",
    cta: "bg-accent text-white hover:bg-accent-600 focus-visible:ring-accent font-bold",
    tertiary: "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 focus-visible:ring-neutral-400",
  };
  
  const sizes = {
    sm: "h-9 px-3 rounded-md",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg",
    icon: "h-10 w-10",
  };

  return cn(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  );
};

export { Button };
