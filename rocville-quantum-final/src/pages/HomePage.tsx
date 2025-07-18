import { Layout } from "../components/layout";
import ComplianceStatusWidget from "../components/ComplianceStatusWidget";
import MarketDataWidget from "../components/MarketDataWidget";
import ESGScoreWidget from "../components/ESGScoreWidget";
import DiversificationWidget from "../components/DiversificationWidget";
import SocialShareWidget from "../components/SocialShareWidget";
import Layer2TxWidget from "../components/Layer2TxWidget";
import DIDWidget from "../components/DIDWidget";
import MultiChainBalanceWidget from "../components/MultiChainBalanceWidget";
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
      {/* Compliance Status Widget */}
      <div className="max-w-xl mx-auto mt-8 mb-8 space-y-6">
        <ComplianceStatusWidget />
        <MarketDataWidget />
        <ESGScoreWidget />
        <DiversificationWidget />
        <SocialShareWidget />
        <Layer2TxWidget />
        <DIDWidget />
        <MultiChainBalanceWidget />
      </div>
      {/* Hero Section */}
      <Hero
        title="Crafting Digital Experiences That Inspire"
        subtitle="We're a full-service digital agency specializing in web development, branding, and marketing solutions that drive results."
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
          {SERVICES.slice(0, 6).map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.shortDescription}
              features={service.features}
              image={"/assets/service-default.jpg"}
              category={service.title}
              gradient={"linear-gradient(135deg, #7F5AF0 0%, #2CB67D 100%)"}
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