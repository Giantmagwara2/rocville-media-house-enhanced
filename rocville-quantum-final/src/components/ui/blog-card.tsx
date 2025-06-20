import * as React from "react";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader } from "./card";
import { formatDate } from "../../lib/utils";
import { H3, Subtle } from "./typography";

interface BlogCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  featured?: boolean;
  href?: string;
}

const BlogCard = React.forwardRef<HTMLDivElement, BlogCardProps>(
  ({ 
    className, 
    title, 
    excerpt, 
    author, 
    date, 
    category, 
    imageUrl, 
    featured = false,
    href = "#",
    ...props 
  }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "overflow-hidden h-full transition-all duration-300 hover:shadow-large",
          featured && "md:col-span-2",
          className
        )}
        {...props}
      >
        <a href={href} className="block h-full">
          <div className="relative h-48 overflow-hidden">
            <img 
              src={imageUrl || "https://via.placeholder.com/600x400?text=Blog+Image"} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <span className="inline-block bg-accent text-white text-xs font-medium px-3 py-1 rounded-full">
                {category}
              </span>
            </div>
            {featured && (
              <div className="absolute top-4 right-4">
                <span className="inline-block bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                  Featured
                </span>
              </div>
            )}
          </div>
          
          <CardHeader>
            <Subtle>{formatDate(date)}</Subtle>
            <H3 className="mt-2 text-xl hover:text-primary transition-colors">{title}</H3>
          </CardHeader>
          
          <CardContent>
            <p className="text-neutral-600 mb-4 line-clamp-3">{excerpt}</p>
            
            <div className="flex items-center mt-4 pt-4 border-t border-neutral-200">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary flex items-center justify-center font-medium mr-3">
                {author.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-sm font-medium">{author}</span>
            </div>
          </CardContent>
        </a>
      </Card>
    );
  }
);

BlogCard.displayName = "BlogCard";

export { BlogCard };
