import * as React from "react";
import { cn } from "../../lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

const H1 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, as: Component = "h1", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        "scroll-m-20 font-heading text-4xl font-bold tracking-tight text-neutral-dark lg:text-5xl",
        className
      )}
      {...props}
    />
  )
);
H1.displayName = "H1";

const H2 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, as: Component = "h2", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        "scroll-m-20 font-heading text-3xl font-semibold tracking-tight text-neutral-dark first:mt-0",
        className
      )}
      {...props}
    />
  )
);
H2.displayName = "H2";

const H3 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, as: Component = "h3", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        "scroll-m-20 font-heading text-2xl font-semibold tracking-tight text-neutral-dark",
        className
      )}
      {...props}
    />
  )
);
H3.displayName = "H3";

const H4 = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, as: Component = "h4", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        "scroll-m-20 font-heading text-xl font-semibold tracking-tight text-neutral-dark",
        className
      )}
      {...props}
    />
  )
);
H4.displayName = "H4";

const P = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, as: Component = "p", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn("leading-7 font-body text-neutral-700 [&:not(:first-child)]:mt-6", className)}
      {...props}
    />
  )
);
P.displayName = "P";

const Lead = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, as: Component = "p", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn("font-body text-xl text-neutral-600 leading-8", className)}
      {...props}
    />
  )
);
Lead.displayName = "Lead";

const Large = React.forwardRef<HTMLDivElement, TypographyProps>(
  ({ className, as: Component = "div", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn("font-body text-lg font-semibold text-neutral-900", className)}
      {...props}
    />
  )
);
Large.displayName = "Large";

const Small = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, as: Component = "small", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn("font-body text-sm font-medium leading-none", className)}
      {...props}
    />
  )
);
Small.displayName = "Small";

const Subtle = React.forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, as: Component = "p", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn("font-body text-sm text-neutral-500", className)}
      {...props}
    />
  )
);
Subtle.displayName = "Subtle";

const Accent = React.forwardRef<HTMLSpanElement, TypographyProps>(
  ({ className, as: Component = "span", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn("font-accent text-accent-500 italic", className)}
      {...props}
    />
  )
);
Accent.displayName = "Accent";

export { H1, H2, H3, H4, P, Lead, Large, Small, Subtle, Accent };
