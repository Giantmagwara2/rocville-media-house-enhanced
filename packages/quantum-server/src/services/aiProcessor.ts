
import { UserProfile, Lead, Analytics } from '../models/AIAgent';
import { logger } from '../utils/logger';

interface IntentAnalysis {
  primary_intent: string;
  service_interest: string[];
  urgency_level: number;
  is_business_inquiry: boolean;
  sentiment: string;
  requires_human: boolean;
  confidence: number;
}

interface ProcessedMessage {
  response: string;
  intent: IntentAnalysis;
  entities: Record<string, any>;
  tasks_created: number;
  user_profile_updated: boolean;
}

export class AIProcessor {
  private services = {
    web_development: {
      name: "Web Development",
      base_price: 2500,
      description: "Custom websites and web applications",
      features: ["Responsive Design", "E-commerce", "CMS", "PWA", "API Integration"]
    },
    digital_marketing: {
      name: "Digital Marketing", 
      base_price: 1500,
      description: "Strategic marketing campaigns",
      features: ["SEO", "PPC", "Social Media", "Email Marketing", "Analytics"]
    },
    branding: {
      name: "Branding & Identity",
      base_price: 1200,
      description: "Brand identity and visual design",
      features: ["Logo Design", "Brand Strategy", "Visual Identity", "Guidelines"]
    },
    ui_ux_design: {
      name: "UI/UX Design",
      base_price: 1800,
      description: "User experience and interface design",
      features: ["User Research", "Wireframing", "Prototyping", "Usability Testing"]
    },
    app_development: {
      name: "App Development",
      base_price: 3500,
      description: "Mobile applications for iOS and Android",
      features: ["Native Development", "Cross-Platform", "App Store Optimization"]
    },
    content_creation: {
      name: "Content Creation",
      base_price: 800,
      description: "Content strategy and creation",
      features: ["Copywriting", "Blog Content", "Video Production", "Photography"]
    }
  };

  private locationMultipliers: Record<string, number> = {
    "US": 1.0, "CA": 0.9, "GB": 0.95, "AU": 0.9, "DE": 0.85, "FR": 0.85,
    "NL": 0.8, "SE": 0.8, "NO": 0.85, "DK": 0.8, "CH": 1.1, "JP": 0.9,
    "SG": 0.75, "HK": 0.8, "IN": 0.3, "PH": 0.25, "TH": 0.35, "MY": 0.4,
    "ID": 0.3, "VN": 0.25, "BD": 0.2, "PK": 0.2, "LK": 0.25, "NP": 0.2,
    "KE": 0.3, "NG": 0.25, "ZA": 0.4, "EG": 0.3, "MA": 0.3, "TN": 0.3,
    "BR": 0.4, "MX": 0.35, "AR": 0.3, "CL": 0.4, "CO": 0.3, "PE": 0.3,
    "RU": 0.4, "UA": 0.25, "PL": 0.5, "CZ": 0.5, "HU": 0.45, "RO": 0.4
  };

  async processMessage(message: string, userPhone: string, userProfile?: any): Promise<ProcessedMessage> {
    try {
      // Analyze message intent
      const intent = await this.analyzeIntent(message);
      
      // Extract entities
      const entities = this.extractEntities(message);
      
      // Get or create user profile
      let profile = userProfile;
      if (!profile) {
        profile = await UserProfile.findOne({ phone_number: userPhone });
        if (!profile) {
          profile = await this.createUserProfile(userPhone);
        }
      }

      // Update user interaction count
      profile.interaction_count += 1;
      profile.last_interaction = new Date();
      
      // Generate response
      const response = await this.generateResponse(intent, entities, profile, message);
      
      // Update lead score if applicable
      if (intent.is_business_inquiry) {
        await this.updateLeadScore(profile, intent);
      }
      
      // Create tasks if needed
      const tasksCreated = await this.createAutonomousTasks(intent, entities, profile);
      
      await profile.save();
      
      return {
        response,
        intent,
        entities,
        tasks_created: tasksCreated.length,
        user_profile_updated: true
      };
      
    } catch (error) {
      logger.error('AI processing error:', error);
      return {
        response: "I apologize, but I'm experiencing a technical issue. Let me connect you with our team for immediate assistance.",
        intent: this.getDefaultIntent(),
        entities: {},
        tasks_created: 0,
        user_profile_updated: false
      };
    }
  }

  private async analyzeIntent(message: string): Promise<IntentAnalysis> {
    const messageLower = message.toLowerCase();
    
    // Simple intent detection (in production, this would use advanced NLP)
    let primary_intent = 'inquiry';
    let service_interest: string[] = [];
    let urgency_level = 5;
    let is_business_inquiry = false;
    let sentiment = 'neutral';
    let requires_human = false;
    let confidence = 0.8;

    // Greeting detection
    if (/hello|hi|hey|good morning|good afternoon/.test(messageLower)) {
      primary_intent = 'greeting';
    }

    // Service interest detection
    if (/website|web|development/.test(messageLower)) {
      service_interest.push('web_development');
      is_business_inquiry = true;
    }
    if (/marketing|seo|social media/.test(messageLower)) {
      service_interest.push('digital_marketing');
      is_business_inquiry = true;
    }
    if (/brand|logo|design/.test(messageLower)) {
      service_interest.push('branding');
      is_business_inquiry = true;
    }
    if (/ui|ux|user experience/.test(messageLower)) {
      service_interest.push('ui_ux_design');
      is_business_inquiry = true;
    }
    if (/app|mobile|application/.test(messageLower)) {
      service_interest.push('app_development');
      is_business_inquiry = true;
    }
    if (/content|copywriting|blog/.test(messageLower)) {
      service_interest.push('content_creation');
      is_business_inquiry = true;
    }

    // Pricing inquiry
    if (/price|cost|budget|quote/.test(messageLower)) {
      primary_intent = 'pricing';
      is_business_inquiry = true;
    }

    // Urgency detection
    if (/urgent|asap|immediately|rush/.test(messageLower)) {
      urgency_level = 9;
    }

    // Sentiment analysis (basic)
    if (/love|great|excellent|amazing|fantastic/.test(messageLower)) {
      sentiment = 'positive';
    } else if (/hate|terrible|awful|bad|disappointed/.test(messageLower)) {
      sentiment = 'negative';
    }

    return {
      primary_intent,
      service_interest,
      urgency_level,
      is_business_inquiry,
      sentiment,
      requires_human,
      confidence
    };
  }

  private extractEntities(message: string): Record<string, any> {
    const entities: Record<string, any> = {};
    
    // Extract email
    const emailMatch = message.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (emailMatch) {
      entities.email = emailMatch[0];
    }
    
    // Extract budget
    const budgetMatch = message.match(/\$([0-9,]+)|([0-9,]+)\s*dollars?/i);
    if (budgetMatch) {
      entities.budget = budgetMatch[1] || budgetMatch[2];
    }
    
    // Extract timeline
    const timelineMatch = message.match(/(\d+)\s*(weeks?|months?|days?)/i);
    if (timelineMatch) {
      entities.timeline = timelineMatch[0];
    }
    
    return entities;
  }

  private async generateResponse(intent: IntentAnalysis, entities: Record<string, any>, userProfile: any, originalMessage: string): Promise<string> {
    const messageLower = originalMessage.toLowerCase();
    
    // Greeting responses
    if (intent.primary_intent === 'greeting') {
      return `Hello! Welcome to RocVille Media House. I'm your AI assistant, and I'm here to help you with all your digital needs. We specialize in web development, digital marketing, branding, UI/UX design, app development, and content creation. How can I assist you today?`;
    }
    
    // Service-specific responses
    if (intent.service_interest.includes('web_development')) {
      return `Excellent! Web development is one of our core specialties. We create modern, responsive websites that drive results. Our web development services include custom websites, e-commerce platforms, progressive web apps, and API integrations. Would you like to know more about our web development packages and pricing?`;
    }
    
    if (intent.service_interest.includes('digital_marketing')) {
      return `Great choice! Digital marketing is essential for business growth. Our comprehensive digital marketing services include SEO optimization, PPC campaigns, social media management, email marketing, and analytics. We create data-driven strategies that deliver measurable results. Would you like to discuss your marketing goals?`;
    }
    
    if (intent.service_interest.includes('branding')) {
      return `Perfect! Strong branding is the foundation of business success. We offer complete branding solutions including logo design, brand strategy, visual identity systems, and brand guidelines. Our team creates memorable brands that resonate with your target audience. What type of business are you looking to brand?`;
    }
    
    // Pricing inquiries
    if (intent.primary_intent === 'pricing') {
      const country = userProfile.country || 'US';
      const multiplier = this.locationMultipliers[country] || 0.5;
      
      let pricingText = `Here are our service packages for ${country}:\n\n`;
      pricingText += `🌐 Web Development: Starting from $${Math.round(2500 * multiplier)}\n`;
      pricingText += `📱 Digital Marketing: Starting from $${Math.round(1500 * multiplier)}\n`;
      pricingText += `🎨 Branding Package: Starting from $${Math.round(1200 * multiplier)}\n`;
      pricingText += `💡 UI/UX Design: Starting from $${Math.round(1800 * multiplier)}\n`;
      pricingText += `📱 App Development: Starting from $${Math.round(3500 * multiplier)}\n`;
      pricingText += `✍️ Content Creation: Starting from $${Math.round(800 * multiplier)}\n\n`;
      pricingText += `These are starting prices for our standard packages. We offer customized solutions based on your specific needs. Would you like to schedule a consultation to discuss your project requirements?`;
      
      return pricingText;
    }
    
    // Contact inquiries
    if (/contact|phone|call|email|reach/.test(messageLower)) {
      return `You can reach RocVille Media House through:\n\n📞 Phone/WhatsApp: +254753426492\n📧 Email: rocvillemediahouse@gmail.com\n🌐 Website: rocvillemediahouse.com\n\nWe're available Monday to Friday, 9 AM to 6 PM EAT. Feel free to call or message us anytime for immediate assistance!`;
    }
    
    // Default response
    return `Thank you for your message! RocVille Media House offers comprehensive digital solutions including web development, digital marketing, branding, UI/UX design, app development, and content creation. We'd love to help you achieve your business goals. Could you tell me more about what specific services you're interested in, or would you like to schedule a consultation to discuss your project?`;
  }

  private async createUserProfile(phoneNumber: string): Promise<any> {
    const profile = new UserProfile({
      phone_number: phoneNumber,
      preferred_language: 'en',
      currency: 'USD',
      interests: [],
      interaction_count: 0,
      lead_score: 0
    });
    
    await profile.save();
    return profile;
  }

  private async updateLeadScore(userProfile: any, intent: IntentAnalysis): Promise<void> {
    let scoreIncrease = 0;
    
    if (intent.is_business_inquiry) {
      scoreIncrease += 10;
    }
    
    if (intent.urgency_level > 7) {
      scoreIncrease += 5;
    }
    
    if (intent.service_interest.length > 0) {
      scoreIncrease += intent.service_interest.length * 3;
    }
    
    userProfile.lead_score = Math.min(100, userProfile.lead_score + scoreIncrease);
  }

  private async createAutonomousTasks(intent: IntentAnalysis, entities: Record<string, any>, userProfile: any): Promise<any[]> {
    const tasks: any[] = [];
    
    // Create lead if high-value inquiry
    if (userProfile.lead_score > 50 && intent.is_business_inquiry) {
      const lead = new Lead({
        phone_number: userProfile.phone_number,
        name: userProfile.name,
        email: entities.email || userProfile.email,
        service_interest: intent.service_interest.join(', '),
        budget: entities.budget,
        timeline: entities.timeline,
        status: 'new'
      });
      
      await lead.save();
      tasks.push({ type: 'lead_created', lead_id: lead._id });
    }
    
    // Log analytics
    const analytics = new Analytics({
      metric_type: 'conversation',
      metric_name: 'business_inquiry',
      metric_value: intent.is_business_inquiry ? 1 : 0,
      dimensions: JSON.stringify({
        intent: intent.primary_intent,
        services: intent.service_interest,
        country: userProfile.country
      })
    });
    
    await analytics.save();
    
    return tasks;
  }

  private getDefaultIntent(): IntentAnalysis {
    return {
      primary_intent: 'inquiry',
      service_interest: [],
      urgency_level: 5,
      is_business_inquiry: true,
      sentiment: 'neutral',
      requires_human: false,
      confidence: 0.5
    };
  }

  getServicePricing(serviceType: string, countryCode: string = "US", customRequirements: string[] = []): any {
    if (!(serviceType in this.services)) {
      return { error: "Service not found" };
    }

    const service = this.services[serviceType as keyof typeof this.services];
    const basePrice = service.base_price;
    
    // Apply location multiplier
    const multiplier = this.locationMultipliers[countryCode] || 0.5;
    let adjustedPrice = Math.round(basePrice * multiplier);
    
    // Add complexity multiplier for custom requirements
    if (customRequirements.length > 0) {
      const complexityMultiplier = 1 + (customRequirements.length * 0.1);
      adjustedPrice = Math.round(adjustedPrice * complexityMultiplier);
    }
    
    return {
      service: service.name,
      base_price: basePrice,
      location_multiplier: multiplier,
      adjusted_price: adjustedPrice,
      currency: "USD",
      features: service.features,
      description: service.description,
      custom_requirements: customRequirements
    };
  }
}
