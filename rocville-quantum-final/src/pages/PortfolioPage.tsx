import { Layout } from "../components/layout";
import { Hero } from "../components/ui/hero";
import { Section } from "../components/ui/section";
import { H2, H3, Lead, P } from "../components/ui/typography";
import { ProjectCard } from "../components/ui/project-card";
import { CTASection } from "../components/ui/cta-section";
import { PORTFOLIO_ITEMS } from "../lib/constants";
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [filteredProjects, setFilteredProjects] = useState(PORTFOLIO_ITEMS);
  
  const categories = [
    { id: "all", label: "All Projects" },
    { id: "web-development", label: "Web Development" },
    { id: "digital-marketing", label: "Digital Marketing" },
    { id: "branding", label: "Branding" },
    { id: "content-creation", label: "Content Creation" },
    { id: "ui-ux-design", label: "UI/UX Design" },
    { id: "app-development", label: "App Development" },
  ];

  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredProjects(PORTFOLIO_ITEMS);
    } else {
      setFilteredProjects(PORTFOLIO_ITEMS.filter(project => project.category === activeCategory));
    }
  }, [activeCategory]);

  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title="Our Portfolio"
        subtitle="Explore our latest projects and see how we've helped our clients achieve their digital goals"
        backgroundImage="/assets/portfolio-hero.jpg"
        size="md"
      />

      {/* Filter Section */}
      <Section spacing="md">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "primary" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              isActive={activeCategory === category.id}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </Section>

      {/* Portfolio Grid */}
      <Section spacing="xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              category={project.category}
              client={project.client}
              description={project.description}
              imageUrl={project.imageUrl}
              technologies={project.technologies}
              results={project.results}
              featured={project.featured}
              href={`/portfolio/${project.id}`}
            />
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <H3>No projects found in this category</H3>
            <P className="mt-2">Please try selecting a different category.</P>
          </div>
        )}
      </Section>

      {/* Process Section */}
      <Section variant="light" spacing="lg">
        <div className="text-center mb-12">
          <H2>Our Project Process</H2>
          <Lead className="mt-4 max-w-2xl mx-auto">
            We follow a proven methodology to ensure your project is delivered successfully.
          </Lead>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-medium">
            <div className="w-12 h-12 rounded-full bg-primary-100 text-primary flex items-center justify-center text-xl font-bold mb-4">
              1
            </div>
            <H3 className="text-xl mb-2">Discovery</H3>
            <P>We start by understanding your business goals, target audience, and project requirements.</P>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-medium">
            <div className="w-12 h-12 rounded-full bg-primary-100 text-primary flex items-center justify-center text-xl font-bold mb-4">
              2
            </div>
            <H3 className="text-xl mb-2">Strategy</H3>
            <P>We develop a comprehensive strategy and project plan with clear milestones and deliverables.</P>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-medium">
            <div className="w-12 h-12 rounded-full bg-primary-100 text-primary flex items-center justify-center text-xl font-bold mb-4">
              3
            </div>
            <H3 className="text-xl mb-2">Creation</H3>
            <P>Our team brings your project to life with attention to detail, quality, and innovation.</P>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-medium">
            <div className="w-12 h-12 rounded-full bg-primary-100 text-primary flex items-center justify-center text-xl font-bold mb-4">
              4
            </div>
            <H3 className="text-xl mb-2">Launch & Support</H3>
            <P>We launch your project and provide ongoing support to ensure continued success.</P>
          </div>
        </div>
      </Section>

      {/* Client Logos */}
      <Section spacing="lg">
        <div className="text-center mb-12">
          <H2>Trusted By</H2>
          <Lead className="mt-4 max-w-2xl mx-auto">
            We've had the privilege of working with amazing clients across various industries.
          </Lead>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="flex justify-center">
              <img 
                src={`/assets/clients/client-${index}.svg`} 
                alt={`Client ${index}`}
                className="h-12 w-auto grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Start Your Project?"
        description="Let's work together to create a digital solution that drives results for your business."
        primaryCtaText="Contact Us"
        secondaryCtaText="Our Services"
        secondaryCtaLink="/services"
        variant="primary"
      />
    </Layout>
  );
}
