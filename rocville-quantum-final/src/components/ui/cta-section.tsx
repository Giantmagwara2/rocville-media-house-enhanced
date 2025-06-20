import * as React from "react";
import { cn } from "../../lib/utils";
import { Section } from "./section";
import { H2, Lead } from "./typography";
import { Button } from "./button";

interface CTASectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage?: string;
  variant?: "default" | "primary" | "accent";
}

const CTASection = React.forwardRef<HTMLDivElement, CTASectionProps>(
  ({ 
    className, 
    title, 
    description, 
    primaryCtaText = "Get Started", 
    primaryCtaLink = "/contact",
    secondaryCtaText,
    secondaryCtaLink = "/services",
    backgroundImage,
    variant = "primary",
    ...props 
  }, ref) => {
    const variantStyles = {
      default: {
        bg: "bg-white",
        title: "text-neutral-dark",
        description: "text-neutral-600",
        primaryBtn: "cta",
        secondaryBtn: "secondary"
      },
      primary: {
        bg: "bg-primary",
        title: "text-white",
        description: "text-white/90",
        primaryBtn: "cta",
        secondaryBtn: "outline"
      },
      accent: {
        bg: "bg-accent",
        title: "text-white",
        description: "text-white/90",
        primaryBtn: "primary",
        secondaryBtn: "outline"
      }
    };

    const styles = variantStyles[variant];

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        {/* Background Image with Overlay */}
        {backgroundImage ? (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" 
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            <div className={`absolute inset-0 ${variant === "primary" ? "bg-primary/80" : variant === "accent" ? "bg-accent/80" : "bg-neutral-dark/70"} z-0`} />
          </>
        ) : (
          <div className={`absolute inset-0 ${styles.bg} z-0`}></div>
        )}

        <Section container spacing="lg" className="relative z-10">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <H2 className={styles.title}>{title}</H2>
            
            {description && (
              <Lead className={cn("mt-4", styles.description)}>
                {description}
              </Lead>
            )}
            
            <div className="flex flex-wrap gap-4 mt-8 justify-center">
              <Button 
                variant={styles.primaryBtn as any} 
                size="lg" 
                asChild
              >
                <a href={primaryCtaLink}>{primaryCtaText}</a>
              </Button>
              
              {secondaryCtaText && (
                <Button 
                  variant={styles.secondaryBtn as any} 
                  size="lg"
                  className={variant !== "default" ? "border-white text-white hover:bg-white hover:text-neutral-dark" : ""}
                  asChild
                >
                  <a href={secondaryCtaLink}>{secondaryCtaText}</a>
                </Button>
              )}
            </div>
          </div>
        </Section>
      </div>
    );
  }
);

CTASection.displayName = "CTASection";

export { CTASection };
