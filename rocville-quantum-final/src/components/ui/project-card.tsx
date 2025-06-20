import * as React from "react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

interface ProjectCardProps {
  title: string;
  category: string;
  client: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  results?: string[];
  featured?: boolean;
  href?: string;
  className?: string;
}

const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(
  ({ 
    className, 
    title, 
    category, 
    client, 
    description, 
    imageUrl, 
    technologies, 
    results,
    featured = false,
    href = "#",
    ...props 
  }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "overflow-hidden h-full transition-all duration-300 hover:shadow-xl",
          featured && "md:col-span-2",
          className
        )}
        {...props}
      >
        <a href={href} className="block h-full">
          <div className="relative h-64 overflow-hidden">
            <img 
              src={imageUrl || "https://via.placeholder.com/600x400?text=Project+Image"} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <span className="inline-block bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                {category}
              </span>
            </div>
          </div>
          
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-neutral-500">{client}</span>
              {featured && (
                <span className="bg-accent-100 text-accent-600 text-xs font-medium px-2 py-1 rounded">
                  Featured
                </span>
              )}
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </CardHeader>
          
          <CardContent>
            <p className="text-neutral-600 mb-4">{description}</p>
            
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <span 
                    key={index}
                    className="bg-neutral-100 text-neutral-700 text-xs px-2 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            {results && results.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Results</h4>
                <ul className="space-y-1">
                  {results.map((result, index) => (
                    <li key={index} className="flex items-center text-sm text-neutral-700">
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
                        className="w-4 h-4 mr-2 text-secondary"
                      >
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                      {result}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </a>
      </Card>
    );
  }
);

ProjectCard.displayName = "ProjectCard";

export { ProjectCard };
