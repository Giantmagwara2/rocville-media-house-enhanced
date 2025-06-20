import { Layout } from "../components/layout";
import { Hero } from "../components/ui/hero";
import { Section } from "../components/ui/section";
import { H2, H3, Lead, P } from "../components/ui/typography";
import { CTASection } from "../components/ui/cta-section";
import { COMPANY } from "../lib/constants";
import { Button } from "../components/ui/button";

export default function ContactUsPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <Hero
        title="Contact Us"
        subtitle="Get in touch with our team to discuss your project"
        backgroundImage="/assets/contact-hero.jpg"
        size="md"
      />

      {/* Contact Form Section */}
      <Section spacing="xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <H2>Get In Touch</H2>
            <Lead className="mt-4">
              We'd love to hear from you. Fill out the form and we'll get back to you as soon as possible.
            </Lead>
            
            <div className="mt-8 space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
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
                    className="w-6 h-6 text-primary mt-1"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="ml-4">
                  <H3 className="text-lg font-semibold">Visit Us</H3>
                  <P className="mt-1">{COMPANY.address}</P>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
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
                    className="w-6 h-6 text-primary mt-1"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <H3 className="text-lg font-semibold">Call Us</H3>
                  <P className="mt-1">
                    <a href={`tel:${COMPANY.phone}`} className="text-primary hover:underline">
                      {COMPANY.phone}
                    </a>
                  </P>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
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
                    className="w-6 h-6 text-primary mt-1"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="ml-4">
                  <H3 className="text-lg font-semibold">Email Us</H3>
                  <P className="mt-1">
                    <a href={`mailto:${COMPANY.email}`} className="text-primary hover:underline">
                      {COMPANY.email}
                    </a>
                  </P>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
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
                    className="w-6 h-6 text-primary mt-1"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="ml-4">
                  <H3 className="text-lg font-semibold">Business Hours</H3>
                  <P className="mt-1">Monday - Friday: 9:00 AM - 6:00 PM</P>
                  <P>Weekends: Closed</P>
                </div>
              </div>
              
              <div className="pt-4">
                <H3 className="text-lg font-semibold mb-3">Connect With Us</H3>
                <div className="flex space-x-4">
                  <a
                    href={COMPANY.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-neutral-100 hover:bg-primary hover:text-white text-neutral-600 p-2 rounded-full transition-colors"
                    aria-label="Twitter"
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
                  <a
                    href={COMPANY.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-neutral-100 hover:bg-primary hover:text-white text-neutral-600 p-2 rounded-full transition-colors"
                    aria-label="Facebook"
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
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a
                    href={COMPANY.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-neutral-100 hover:bg-primary hover:text-white text-neutral-600 p-2 rounded-full transition-colors"
                    aria-label="Instagram"
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
                  <a
                    href={COMPANY.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-neutral-100 hover:bg-primary hover:text-white text-neutral-600 p-2 rounded-full transition-colors"
                    aria-label="LinkedIn"
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
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-large">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium text-neutral-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first-name"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium text-neutral-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last-name"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="john.doe@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1">
                  Subject
                </label>
                <select
                  id="subject"
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="" disabled selected>Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="quote">Request a Quote</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              
              <div className="flex items-start">
                <input
                  id="privacy"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded mt-1"
                />
                <label htmlFor="privacy" className="ml-2 text-sm text-neutral-600">
                  I agree to the <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a> and consent to being contacted regarding my inquiry.
                </label>
              </div>
              
              <Button variant="primary" size="lg" className="w-full">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </Section>

      {/* Map Section */}
      <Section variant="light" spacing="lg">
        <div className="text-center mb-12">
          <H2>Our Location</H2>
          <Lead className="mt-4 max-w-2xl mx-auto">
            Visit our office in the heart of New York City
          </Lead>
        </div>
        
        <div className="rounded-lg overflow-hidden shadow-large h-96">
          {/* Replace with actual map component or iframe */}
          <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
            <p className="text-neutral-600">Interactive Map Would Be Displayed Here</p>
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      <Section spacing="lg">
        <div className="text-center mb-12">
          <H2>Frequently Asked Questions</H2>
          <Lead className="mt-4 max-w-2xl mx-auto">
            Find answers to common questions about working with us
          </Lead>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-neutral-200">
          <div className="py-6">
            <H3 className="text-xl mb-3">How quickly do you respond to inquiries?</H3>
            <P>We aim to respond to all inquiries within 24 business hours. For urgent matters, please indicate so in your message subject line.</P>
          </div>
          
          <div className="py-6">
            <H3 className="text-xl mb-3">What information should I include in my initial inquiry?</H3>
            <P>To help us provide the most accurate response, please include details about your project scope, timeline, budget range, and specific goals or challenges you're looking to address.</P>
          </div>
          
          <div className="py-6">
            <H3 className="text-xl mb-3">Do you work with clients internationally?</H3>
            <P>Yes, we work with clients globally. Our team is experienced in managing remote projects and can accommodate different time zones for meetings and communications.</P>
          </div>
          
          <div className="py-6">
            <H3 className="text-xl mb-3">What happens after I submit my contact form?</H3>
            <P>After submission, you'll receive an automatic confirmation email. Our team will review your inquiry and reach out to schedule an initial consultation to discuss your needs in more detail.</P>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Start Your Project?"
        description="Contact us today to discuss how we can help you achieve your digital goals."
        primaryCtaText="Call Us Now"
        primaryCtaLink={`tel:${COMPANY.phone}`}
        secondaryCtaText="Email Us"
        secondaryCtaLink={`mailto:${COMPANY.email}`}
        variant="primary"
      />
    </Layout>
  );
}
