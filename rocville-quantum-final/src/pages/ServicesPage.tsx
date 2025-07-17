import { Layout } from "../components/layout";
import { Hero } from "../components/ui/hero";
import { Section } from "../components/ui/section";
import { H2, Lead, P } from "../components/ui/typography";
import { ServiceCard } from "../components/ui/service-card";
import { CTASection } from "../components/ui/cta-section";
import { SERVICES } from "../lib/constants";

export default function ServicesPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title="Our Services"
        subtitle="Comprehensive digital solutions to help your business thrive"
        backgroundImage="/assets/services-hero.jpg"
        size="md"
      />

      {/* Services Overview */}
      <Section spacing="xl">
        <div className="text-center mb-12">
          <H2>What We Offer</H2>
          <Lead className="mt-4 max-w-2xl mx-auto">
            We provide a wide range of digital services to help businesses establish a strong online presence and achieve their goals.
          </Lead>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
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
              ctaLink={`#${service.id}`}
              variant={index === 0 ? "featured" : "default"}
            />
          ))}
        </div>
      </Section>

      {/* Process Section */}
      <Section variant="light" spacing="lg">
        <div className="text-center mb-12">
          <H2>Our Process</H2>
          <Lead className="mt-4 max-w-2xl mx-auto">
            We follow a proven methodology to ensure your project is delivered successfully.
          </Lead>
        </div>

        <div className="relative">
          {/* Process Timeline */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-primary-200 transform -translate-x-1/2"></div>

          <div className="space-y-12 relative">
            {/* Step 1 */}
            <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="md:text-right">
                <div className="bg-white p-6 rounded-lg shadow-medium inline-block">
                  <div className="text-primary font-bold text-xl mb-2">01. Discovery</div>
                  <P>We start by understanding your business goals, target audience, and project requirements. This phase involves research, stakeholder interviews, and competitive analysis to establish a solid foundation for your project.</P>
                </div>
                <div className="hidden md:block absolute top-6 right-0 w-6 h-6 rounded-full bg-primary border-4 border-white transform translate-x-3"></div>
              </div>
              <div className="hidden md:block">
                <img 
                  src="/assets/services/discovery.jpg" 
                  alt="Discovery Phase" 
                  className="rounded-lg shadow-medium mt-8 md:mt-0"
                />
              </div>
            </div>

            {/* Step 2 */}
            <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="hidden md:block">
                <img 
                  src="/assets/services/strategy.jpg" 
                  alt="Strategy Phase" 
                  className="rounded-lg shadow-medium"
                />
              </div>
              <div>
                <div className="bg-white p-6 rounded-lg shadow-medium inline-block">
                  <div className="text-primary font-bold text-xl mb-2">02. Strategy</div>
                  <P>We develop a comprehensive strategy and project plan with clear milestones and deliverables. This includes defining the scope, timeline, budget, and key performance indicators to measure success.</P>
                </div>
                <div className="hidden md:block absolute top-6 left-0 w-6 h-6 rounded-full bg-primary border-4 border-white transform -translate-x-3"></div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="md:text-right">
                <div className="bg-white p-6 rounded-lg shadow-medium inline-block">
                  <div className="text-primary font-bold text-xl mb-2">03. Creation</div>
                  <P>Our team brings your project to life with attention to detail, quality, and innovation. We follow an iterative approach, providing regular updates and opportunities for feedback to ensure the final product meets your expectations.</P>
                </div>
                <div className="hidden md:block absolute top-6 right-0 w-6 h-6 rounded-full bg-primary border-4 border-white transform translate-x-3"></div>
              </div>
              <div className="hidden md:block">
                <img 
                  src="/assets/services/creation.jpg" 
                  alt="Creation Phase" 
                  className="rounded-lg shadow-medium mt-8 md:mt-0"
                />
              </div>
            </div>

            {/* Step 4 */}
            <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
              <div className="hidden md:block">
                <img 
                  src="/assets/services/launch.jpg" 
                  alt="Launch Phase" 
                  className="rounded-lg shadow-medium"
                />
              </div>
              <div>
                <div className="bg-white p-6 rounded-lg shadow-medium inline-block">
                  <div className="text-primary font-bold text-xl mb-2">04. Launch & Support</div>
                  <P>We launch your project and provide ongoing support to ensure continued success. This includes training, documentation, and post-launch optimization to maximize the return on your investment.</P>
                </div>
                <div className="hidden md:block absolute top-6 left-0 w-6 h-6 rounded-full bg-primary border-4 border-white transform -translate-x-3"></div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Detailed Services Sections */}
      {SERVICES.map((service) => (
        <Section key={service.id} id={service.id} spacing="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <H2>{service.title}</H2>
              <Lead className="mt-4">{service.shortDescription}</Lead>
              <P className="mt-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
              </P>
              <ul className="mt-6 space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
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
                      className="w-5 h-5 mr-2 text-primary"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <img
                src={`/assets/services/${service.id}.jpg`}
                alt={service.title}
                className="rounded-lg shadow-large w-full h-auto"
              />
            </div>
          </div>
        </Section>
      ))}

      {/* FAQ Section */}
      <Section variant="light" spacing="lg">
        <div className="text-center mb-12">
          <H2>Frequently Asked Questions</H2>
          <Lead className="mt-4 max-w-2xl mx-auto">
            Find answers to common questions about our services
          </Lead>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-neutral-200">
          <div className="py-6">
            <h3 className="text-xl font-semibold mb-3">How long does a typical project take?</h3>
            <P>Project timelines vary depending on scope and complexity. A simple website might take 4-6 weeks, while a complex web application could take 3-6 months. During our discovery phase, we'll provide a detailed timeline specific to your project.</P>
          </div>

          <div className="py-6">
            <h3 className="text-xl font-semibold mb-3">What is your pricing structure?</h3>
            <P>We offer flexible pricing options including fixed-price quotes for well-defined projects and hourly rates for ongoing work. We'll work with you to find a pricing structure that fits your budget and project needs.</P>
          </div>

          <div className="py-6">
            <h3 className="text-xl font-semibold mb-3">Do you offer ongoing maintenance and support?</h3>
            <P>Yes, we offer various maintenance and support packages to ensure your digital assets remain secure, up-to-date, and performing optimally. These can be tailored to your specific needs and budget.</P>
          </div>

          <div className="py-6">
            <h3 className="text-xl font-semibold mb-3">How do you handle project changes and revisions?</h3>
            <P>We build flexibility into our process and understand that requirements can evolve. Minor revisions are included in our project scope, while significant changes are addressed through our change request process to ensure transparency and proper planning.</P>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Start Your Project?"
        description="Contact us today to discuss how we can help you achieve your digital goals."
        primaryCtaText="Get in Touch"
        secondaryCtaText="View Portfolio"
        secondaryCtaLink="/portfolio"
        variant="primary"
      />
    </Layout>
  );
}
const services = [
    {
      title: "Quantum Web Development",
      description: "Revolutionary web applications that transcend traditional boundaries with neural network-inspired interfaces and biomorphic design elements.",
      features: ["Neural UI/UX Design", "Quantum Interactions", "AI-Powered Features", "Holographic Effects", "Responsive Morphing"],
      price: "$5,000",
      image: images.services.webDevelopment,
      category: "Web Solutions",
      gradient: "linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)"
    },
    {
      title: "AI-Enhanced Mobile Apps",
      description: "Next-generation mobile applications with integrated AI capabilities, predictive interfaces, and seamless biometric authentication.",
      features: ["AI Integration", "Biometric Auth", "Predictive UI", "Neural Networks", "Quantum Security"],
      price: "$8,000",
      image: images.services.mobileApps,
      category: "Mobile Solutions",
      gradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(6, 255, 165, 0.2) 100%)"
    },
    {
      title: "Holographic Branding",
      description: "Avant-garde brand identity systems that challenge conventional design paradigms with multi-dimensional visual experiences.",
      features: ["3D Brand Identity", "Holographic Design", "Interactive Logos", "Quantum Typography", "Neural Aesthetics"],
      price: "$3,500",
      image: images.services.branding,
      category: "Brand Design",
      gradient: "linear-gradient(135deg, rgba(6, 255, 165, 0.2) 0%, rgba(0, 212, 255, 0.2) 100%)"
    },
    {
      title: "Neural Consulting",
      description: "Strategic technology consulting powered by AI analysis and quantum computing insights for business transformation.",
      features: ["AI Strategy", "Digital Transformation", "Tech Architecture", "Innovation Labs", "Future Planning"],
      price: "$2,500",
      image: images.services.consulting,
      category: "Consulting",
      gradient: "linear-gradient(135deg, rgba(255, 20, 147, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)"
    },
    {
      title: "Quantum Analytics",
      description: "Advanced data analytics and visualization using quantum-inspired algorithms and neural network processing.",
      features: ["Quantum Algorithms", "Predictive Analytics", "Real-time Insights", "Neural Processing", "Interactive Dashboards"],
      price: "$4,200",
      image: images.services.analytics,
      category: "Data Science",
      gradient: "linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(6, 255, 165, 0.2) 100%)"
    },
    {
      title: "AI Super Agent Integration",
      description: "Cutting-edge AI agents that provide 24/7 customer service, automated workflows, and intelligent task execution.",
      features: ["24/7 AI Support", "Automated Workflows", "Multi-channel Integration", "Learning Algorithms", "Custom Training"],
      price: "$12,000",
      image: images.services.aiIntegration,
      category: "AI Solutions",
      gradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(255, 20, 147, 0.2) 100%)"
    }
  ];