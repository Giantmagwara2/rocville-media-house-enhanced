import { Layout } from "../components/layout";
import { Hero } from "../components/ui/hero";
import { Section } from "../components/ui/section";
import { H2, Lead, P } from "../components/ui/typography";
import { ServiceCard } from "../components/ui/service-card";
import { ProjectCard } from "../components/ui/project-card";
import { TestimonialCard } from "../components/ui/testimonial-card";
import { BlogCard } from "../components/ui/blog-card";
import { CTASection } from "../components/ui/cta-section";
import { SERVICES, PORTFOLIO_ITEMS, TESTIMONIALS, BLOG_POSTS } from "../lib/constants";

export default function HomePage() {
  // Filter featured items
  const featuredProjects = PORTFOLIO_ITEMS.filter(project => project.featured);
  const featuredTestimonials = TESTIMONIALS.slice(0, 3);
  const featuredBlogPosts = BLOG_POSTS.filter(post => post.featured);

  return (
    <Layout transparentHeader>
      {/* Hero Section */}
      <Hero
        title="Crafting Digital Experiences That Inspire"
        subtitle="We're a full-service digital agency specializing in web development, branding, and marketing solutions that drive results."
        ctaText="Get Started"
        secondaryCtaText="Our Services"
        backgroundImage="/assets/hero-bg.jpg"
      />

      {/* Services Section */}
      <Section id="services" spacing="xl">
        <div className="text-center mb-12">
          <H2>Our Services</H2>
          <Lead className="mt-4 max-w-2xl mx-auto">
            We offer comprehensive digital solutions to help your business thrive in the digital landscape.
          </Lead>
        </div>

        <div className="bento-grid">
          {SERVICES.slice(0, 6).map((service, index) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.shortDescription}
              features={service.features}
              icon={
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
                >
                  {service.icon === "Code" && (
                    <>
                      <polyline points="16 18 22 12 16 6"></polyline>
                      <polyline points="8 6 2 12 8 18"></polyline>
                    </>
                  )}
                  {service.icon === "BarChart" && (
                    <>
                      <line x1="12" y1="20" x2="12" y2="10"></line>
                      <line x1="18" y1="20" x2="18" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="16"></line>
                    </>
                  )}
                  {service.icon === "Palette" && (
                    <>
                      <circle cx="13.5" cy="6.5" r=".5"></circle>
                      <circle cx="17.5" cy="10.5" r=".5"></circle>
                      <circle cx="8.5" cy="7.5" r=".5"></circle>
                      <circle cx="6.5" cy="12.5" r=".5"></circle>
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path>
                    </>
                  )}
                  {service.icon === "FileText" && (
                    <>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </>
                  )}
                  {service.icon === "Layout" && (
                    <>
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="21" x2="9" y2="9"></line>
                    </>
                  )}
                  {service.icon === "Smartphone" && (
                    <>
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                      <line x1="12" y1="18" x2="12.01" y2="18"></line>
                    </>
                  )}
                </svg>
              }
              ctaLink={`/services#${service.id}`}
              variant={index === 0 ? "featured" : "default"}
            />
          ))}
        </div>
      </Section>

      {/* Portfolio Section */}
      <Section id="portfolio" variant="light" spacing="xl">
        <div className="text-center mb-12">
          <H2>Our Work</H2>
          <Lead className="mt-4 max-w-2xl mx-auto">
            Explore our latest projects and see how we've helped our clients achieve their goals.
          </Lead>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProjects.map((project) => (
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
      </Section>

      {/* About Section */}
      <Section id="about" spacing="lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="/assets/about-image.jpg"
              alt="RocVille Media House Team"
              className="rounded-lg shadow-large w-full h-auto"
            />
          </div>
          <div>
            <H2>Who We Are</H2>
            <Lead className="mt-4">
              A team of passionate digital experts dedicated to helping businesses succeed online.
            </Lead>
            <P className="mt-6">
              Founded in 2015, RocVille Media House has grown from a small web design studio to a full-service digital agency. Our mission is to create meaningful digital experiences that connect brands with their audiences and drive business growth.
            </P>
            <P className="mt-4">
              We believe in collaboration, innovation, and results. Our team combines creativity with technical expertise to deliver solutions that not only look great but also perform exceptionally well.
            </P>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-primary">150+</span>
                <span className="text-neutral-600">Projects Completed</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-primary">98%</span>
                <span className="text-neutral-600">Client Satisfaction</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-primary">15+</span>
                <span className="text-neutral-600">Industry Awards</span>
              </div>
              <div className="flex flex-col">
                <span className="text-4xl font-bold text-primary">10+</span>
                <span className="text-neutral-600">Years of Experience</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Testimonials Section */}
      <Section id="testimonials" variant="light" spacing="xl">
        <div className="text-center mb-12">
          <H2>What Our Clients Say</H2>
          <Lead className="mt-4 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say about working with us.
          </Lead>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              quote={testimonial.quote}
              name={testimonial.name}
              position={testimonial.position}
              company={testimonial.company}
              imageUrl={testimonial.imageUrl}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </Section>

      {/* Blog Section */}
      <Section id="blog" spacing="lg">
        <div className="text-center mb-12">
          <H2>Latest Insights</H2>
          <Lead className="mt-4 max-w-2xl mx-auto">
            Stay updated with the latest trends and insights in the digital world.
          </Lead>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredBlogPosts.map((post) => (
            <BlogCard
              key={post.id}
              title={post.title}
              excerpt={post.excerpt}
              author={post.author}
              date={post.date}
              category={post.category}
              imageUrl={post.imageUrl}
              featured={post.featured}
              href={`/blog/${post.id}`}
            />
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Transform Your Digital Presence?"
        description="Let's work together to create a digital strategy that drives results for your business."
        primaryCtaText="Get Started"
        secondaryCtaText="Learn More"
        variant="primary"
      />
    </Layout>
  );
}