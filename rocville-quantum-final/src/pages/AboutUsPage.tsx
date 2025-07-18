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
import { H2, H3, Lead, P } from "../components/ui/typography";
import { CTASection } from "../components/ui/cta-section";
import { COMPANY, TEAM_MEMBERS } from "../lib/constants";

export default function AboutUsPage() {
  return (
    <Layout>
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
        title="About Us"
        subtitle="Get to know our team and our story"
        backgroundImage="/assets/about-hero.jpg"
      />

      {/* Our Story Section */}
      <Section spacing="xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="/assets/about/our-story.jpg"
              alt="RocVille Media House Team"
              className="rounded-lg shadow-large w-full h-auto"
            />
          </div>
          <div>
            <H2>Our Story</H2>
            <Lead className="mt-4">
              From humble beginnings to a full-service digital agency
            </Lead>
            <P className="mt-6">
              Founded in {COMPANY.foundedYear}, RocVille Media House began as a small web design studio with a passion for creating beautiful, functional websites. Our founder, Alex Rivera, saw an opportunity to help local businesses establish a strong online presence in an increasingly digital world.
            </P>
            <P className="mt-4">
              As our reputation for quality and innovation grew, so did our team and service offerings. We expanded beyond web design to include digital marketing, branding, content creation, and application development, becoming the full-service digital agency we are today.
            </P>
            <P className="mt-4">
              Throughout our journey, our mission has remained the same: to create meaningful digital experiences that connect brands with their audiences and drive business growth. We're proud of how far we've come, but we're even more excited about where we're going.
            </P>
          </div>
        </div>
      </Section>

      {/* Mission & Values Section */}
      <Section variant="light" spacing="lg">
        <div className="text-center mb-12">
          <H2>Our Mission & Values</H2>
          <Lead className="mt-4 max-w-2xl mx-auto">
            What drives us and shapes our approach to every project
          </Lead>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-medium">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mb-4">
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
            <H3 className="text-xl mb-3">Our Mission</H3>
            <P>
              To empower businesses with innovative digital solutions that drive growth, enhance brand visibility, and create meaningful connections with their audience. We strive to be a trusted partner in our clients' success, delivering exceptional value through creativity, technical excellence, and strategic thinking.
            </P>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-medium">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mb-4">
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
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <H3 className="text-xl mb-3">Our Vision</H3>
            <P>
              To be recognized as a leading digital agency that sets the standard for innovation, quality, and client satisfaction. We envision a future where our work not only helps businesses thrive but also contributes to a more connected, accessible, and user-friendly digital landscape.
            </P>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-medium">
            <div className="w-10 h-10 rounded-full bg-secondary-100 text-secondary flex items-center justify-center mb-4">
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
                className="w-5 h-5"
              >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
            </div>
            <H3 className="text-lg mb-2">Excellence</H3>
            <P className="text-sm">
              We strive for excellence in everything we do, from the quality of our work to the service we provide our clients.
            </P>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-medium">
            <div className="w-10 h-10 rounded-full bg-secondary-100 text-secondary flex items-center justify-center mb-4">
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
                className="w-5 h-5"
              >
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </div>
            <H3 className="text-lg mb-2">Creativity</H3>
            <P className="text-sm">
              We embrace creativity and innovation, constantly exploring new ideas and approaches to solve complex problems.
            </P>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-medium">
            <div className="w-10 h-10 rounded-full bg-secondary-100 text-secondary flex items-center justify-center mb-4">
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
                className="w-5 h-5"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <H3 className="text-lg mb-2">Collaboration</H3>
            <P className="text-sm">
              We believe in the power of collaboration, working closely with our clients and each other to achieve the best results.
            </P>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-medium">
            <div className="w-10 h-10 rounded-full bg-secondary-100 text-secondary flex items-center justify-center mb-4">
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
                className="w-5 h-5"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <H3 className="text-lg mb-2">Integrity</H3>
            <P className="text-sm">
              We conduct our business with honesty, transparency, and ethical practices, building trust with our clients and partners.
            </P>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-medium">
            <div className="w-10 h-10 rounded-full bg-secondary-100 text-secondary flex items-center justify-center mb-4">
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
                className="w-5 h-5"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <H3 className="text-lg mb-2">Innovation</H3>
            <P className="text-sm">
              We stay at the forefront of digital trends and technologies, constantly evolving our skills and services to deliver cutting-edge solutions.
            </P>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-medium">
            <div className="w-10 h-10 rounded-full bg-secondary-100 text-secondary flex items-center justify-center mb-4">
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
                className="w-5 h-5"
              >
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                <line x1="16" y1="8" x2="2" y2="22"></line>
                <line x1="17.5" y1="15" x2="9" y2="15"></line>
              </svg>
            </div>
            <H3 className="text-lg mb-2">Results-Driven</H3>
            <P className="text-sm">
              We focus on delivering measurable results that help our clients achieve their business objectives and drive growth.
            </P>
          </div>
        </div>
      </Section>

      {/* Team Section */}
      <Section spacing="xl">
        <div className="text-center mb-12">
          <H2>Meet Our Team</H2>
          <Lead className="mt-4 max-w-2xl mx-auto">
            The talented individuals behind our success
          </Lead>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.id} className="bg-white rounded-lg overflow-hidden shadow-medium transition-all duration-300 hover:shadow-large">
              <div className="h-64 overflow-hidden">
                <img 
                  src={member.imageUrl || `https://via.placeholder.com/400x400?text=${member.name}`} 
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <H3 className="text-xl">{member.name}</H3>
                <p className="text-primary font-medium">{member.position}</p>
                <P className="mt-3">{member.bio}</P>
                
                <div className="flex space-x-3 mt-4">
                  {member.socialLinks.linkedin && (
                    <a 
                      href={member.socialLinks.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-neutral-500 hover:text-primary transition-colors"
                      aria-label={`${member.name}'s LinkedIn`}
                    >
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
                        className="w-5 h-5"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                    </a>
                  )}
                  
                  {member.socialLinks.twitter && (
                    <a 
                      href={member.socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-neutral-500 hover:text-primary transition-colors"
                      aria-label={`${member.name}'s Twitter`}
                    >
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
                        className="w-5 h-5"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    </a>
                  )}
                  
                  {member.socialLinks.github && (
                    <a 
                      href={member.socialLinks.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-neutral-500 hover:text-primary transition-colors"
                      aria-label={`${member.name}'s GitHub`}
                    >
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
                        className="w-5 h-5"
                      >
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                    </a>
                  )}
                  
                  {member.socialLinks.dribbble && (
                    <a 
                      href={member.socialLinks.dribbble} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-neutral-500 hover:text-primary transition-colors"
                      aria-label={`${member.name}'s Dribbble`}
                    >
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
                        className="w-5 h-5"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"></path>
                      </svg>
                    </a>
                  )}
                  
                  {member.socialLinks.instagram && (
                    <a 
                      href={member.socialLinks.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-neutral-500 hover:text-primary transition-colors"
                      aria-label={`${member.name}'s Instagram`}
                    >
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
                        className="w-5 h-5"
                      >
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Stats Section */}
      <Section variant="primary" spacing="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-white">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">150+</div>
            <div className="text-xl">Projects Completed</div>
          </div>
          
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">50+</div>
            <div className="text-xl">Happy Clients</div>
          </div>
          
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">15+</div>
            <div className="text-xl">Industry Awards</div>
          </div>
          
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{new Date().getFullYear() - COMPANY.foundedYear}+</div>
            <div className="text-xl">Years of Experience</div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <CTASection
        title="Join Our Team"
        description="We're always looking for talented individuals to join our team. Check out our current openings or send us your resume."
        primaryCtaText="View Openings"
        primaryCtaLink="/careers"
        secondaryCtaText="Contact Us"
        secondaryCtaLink="/contact"
        variant="accent"
      />
    </Layout>
  );
}
