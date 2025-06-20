import { Layout } from "../components/layout";
import { Hero } from "../components/ui/hero";
import { Section } from "../components/ui/section";
import { H2, H3, Lead, P } from "../components/ui/typography";
import { BlogCard } from "../components/ui/blog-card";
import { CTASection } from "../components/ui/cta-section";
import { BLOG_POSTS } from "../lib/constants";
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [filteredPosts, setFilteredPosts] = useState(BLOG_POSTS);
  
  const categories = [
    { id: "all", label: "All Posts" },
    { id: "Design", label: "Design" },
    { id: "Development", label: "Development" },
    { id: "Digital Marketing", label: "Digital Marketing" },
    { id: "Branding", label: "Branding" },
  ];

  useEffect(() => {
    if (activeCategory === "all") {
      setFilteredPosts(BLOG_POSTS);
    } else {
      setFilteredPosts(BLOG_POSTS.filter(post => post.category === activeCategory));
    }
  }, [activeCategory]);

  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title="Our Blog"
        subtitle="Insights, trends, and tips from our experts"
        backgroundImage="/assets/blog-hero.jpg"
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
            >
              {category.label}
            </Button>
          ))}
        </div>
      </Section>

      {/* Featured Posts */}
      <Section spacing="lg">
        <div className="text-center mb-12">
          <H2>Featured Articles</H2>
          <Lead className="mt-4 max-w-2xl mx-auto">
            Dive into our most popular and insightful content
          </Lead>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.filter(post => post.featured).map((post) => (
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

      {/* All Posts */}
      <Section variant="light" spacing="xl">
        <div className="text-center mb-12">
          <H2>All Articles</H2>
          <Lead className="mt-4 max-w-2xl mx-auto">
            Browse our collection of articles on design, development, marketing, and more
          </Lead>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogCard
              key={post.id}
              title={post.title}
              excerpt={post.excerpt}
              author={post.author}
              date={post.date}
              category={post.category}
              imageUrl={post.imageUrl}
              featured={false}
              href={`/blog/${post.id}`}
            />
          ))}
        </div>
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <H3>No posts found in this category</H3>
            <P className="mt-2">Please try selecting a different category.</P>
          </div>
        )}
      </Section>

      {/* Newsletter Section */}
      <Section spacing="lg">
        <div className="bg-primary-50 rounded-xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <H2>Subscribe to Our Newsletter</H2>
              <P className="mt-4">
                Stay updated with the latest insights, trends, and tips from our experts. We'll send you our best content straight to your inbox.
              </P>
              <P className="mt-2 text-sm text-neutral-600">We respect your privacy. Unsubscribe at any time.</P>
            </div>
            <div>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Your email address"
                  />
                </div>
                <Button variant="primary" className="w-full">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <CTASection
        title="Have a Topic in Mind?"
        description="We're always looking for new ideas and perspectives. If you have a topic you'd like us to cover, let us know!"
        primaryCtaText="Contact Us"
        secondaryCtaText="View Services"
        secondaryCtaLink="/services"
        variant="primary"
      />
    </Layout>
  );
}
