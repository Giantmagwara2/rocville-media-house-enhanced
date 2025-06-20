import * as React from "react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader } from "./card";
import { H3, Subtle } from "./typography";

interface TestimonialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  quote: string;
  name: string;
  position: string;
  company: string;
  imageUrl?: string;
  rating?: number;
}

const TestimonialCard = React.forwardRef<HTMLDivElement, TestimonialCardProps>(
  ({ 
    className, 
    quote, 
    name, 
    position, 
    company, 
    imageUrl,
    rating = 5,
    ...props 
  }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "h-full transition-all duration-300 hover:shadow-large",
          className
        )}
        {...props}
      >
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={i < rating ? "#F59E0B" : "none"}
                  stroke={i < rating ? "#F59E0B" : "#D1D5DB"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              ))}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-10 h-10 text-primary-200"
            >
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
            </svg>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-700 italic mb-6">"{quote}"</p>
          
          <div className="flex items-center">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={name}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary-100 text-primary flex items-center justify-center font-medium mr-4">
                {name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            <div>
              <H3 className="text-base font-semibold">{name}</H3>
              <Subtle>
                {position}, {company}
              </Subtle>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

TestimonialCard.displayName = "TestimonialCard";

export { TestimonialCard };
