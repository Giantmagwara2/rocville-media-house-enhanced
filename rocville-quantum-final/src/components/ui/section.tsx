import * as React from "react";
import { cn } from "../../lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "secondary" | "accent" | "dark" | "light";
  container?: boolean;
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
}

const sectionVariants = {
  default: "bg-white text-neutral-dark",
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-white",
  accent: "bg-accent text-white",
  dark: "bg-neutral-dark text-white",
  light: "bg-neutral-light text-neutral-dark",
};

const spacingVariants = {
  none: "py-0",
  sm: "py-8 md:py-12",
  md: "py-12 md:py-16",
  lg: "py-16 md:py-24",
  xl: "py-24 md:py-32",
};

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ 
    className, 
    variant = "default", 
    container = true, 
    spacing = "lg",
    children,
    ...props 
  }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          sectionVariants[variant],
          spacingVariants[spacing],
          className
        )}
        {...props}
      >
        <div className={cn(container && "container mx-auto px-4 md:px-6")}>
          {children}
        </div>
      </section>
    );
  }
);

Section.displayName = "Section";

export { Section };
