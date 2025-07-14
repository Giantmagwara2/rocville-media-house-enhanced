interface UserLocation {
  country: string;
  country_name: string;
  region: string;
  city: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  currency?: string;
  language?: string;
}

interface ServicePricing {
  service: string;
  base_price: number;
  adjusted_price: number;
  currency: string;
  features: string[];
  description: string;
  location_multiplier: number;
}

interface ConversationMessage {
  id: string;
  user_phone: string;
  message_type: 'incoming' | 'outgoing';
  message_content: string;
  timestamp: string;
  language?: string;
  processed: boolean;
}

interface UserProfile {
  id: number;
  phone_number: string;
  name?: string;
  email?: string;
  preferred_language: string;
  country?: string;
  city?: string;
  currency: string;
  business_type?: string;
  budget_range?: string;
  interests: string[];
  interaction_count: number;
  lead_score: number;
  last_interaction?: string;
}

interface Lead {
  id: number;
  phone_number: string;
  name?: string;
  email?: string;
  company?: string;
  service_interest: string;
  budget?: string;
  timeline?: string;
  status: string;
  notes?: string;
}

class AIAssistantService {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string = 'https://mzhyi8cqp3dk.manus.space/api/ai', apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Health and Status
  async getHealthStatus(): Promise<any> {
    return this.makeRequest('/health');
  }

  // Location Services
  async getUserLocation(ip?: string): Promise<UserLocation> {
    const body: any = {};
    if (ip) {
      body.ip = ip;
    } else {
      // Try to get user's IP automatically
      body.ip = 'auto';
    }

    return this.makeRequest('/location', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async getLocationFromCoordinates(latitude: number, longitude: number): Promise<UserLocation> {
    return this.makeRequest('/location', {
      method: 'POST',
      body: JSON.stringify({ latitude, longitude }),
    });
  }

  // Pricing Services
  async getServicePricing(
    serviceType: string,
    countryCode?: string,
    customRequirements?: string[]
  ): Promise<ServicePricing> {
    return this.makeRequest('/pricing', {
      method: 'POST',
      body: JSON.stringify({
        service_type: serviceType,
        country_code: countryCode,
        custom_requirements: customRequirements,
      }),
    });
  }

  async getAllServicesPricing(countryCode?: string): Promise<ServicePricing[]> {
    const services = [
      'web_development',
      'digital_marketing',
      'branding',
      'ui_ux_design',
      'app_development',
      'content_creation'
    ];

    const pricingPromises = services.map(service => 
      this.getServicePricing(service, countryCode)
    );

    try {
      const results = await Promise.all(pricingPromises);
      return results;
    } catch (error) {
      console.error('Failed to get all services pricing:', error);
      return [];
    }
  }

  // Translation Services
  async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage: string = 'auto'
  ): Promise<string> {
    const result = await this.makeRequest('/translate', {
      method: 'POST',
      body: JSON.stringify({
        text,
        target_lang: targetLanguage,
        source_lang: sourceLanguage,
      }),
    });

    return result.translated_text || text;
  }

  async detectLanguage(_text: string): Promise<string> {
    // This is a simplified approach - in a real implementation,
    // you'd have a dedicated language detection endpoint
    return 'en'; // Default fallback
  }

  // AI Processing
  async processMessage(
    message: string,
    phoneNumber: string,
    location?: UserLocation
  ): Promise<any> {
    return this.makeRequest('/test-ai', {
      method: 'POST',
      body: JSON.stringify({
        message,
        phone: phoneNumber,
        location,
      }),
    });
  }

  // Conversation Management
  async getConversations(
    phoneNumber?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ conversations: ConversationMessage[]; total: number }> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (phoneNumber) {
      params.append('phone', phoneNumber);
    }

    return this.makeRequest(`/conversations?${params}`);
  }

  async sendMessage(
    toNumber: string,
    message: string,
    messageType: string = 'text'
  ): Promise<any> {
    return this.makeRequest('/send-message', {
      method: 'POST',
      body: JSON.stringify({
        to: toNumber,
        message,
        type: messageType,
      }),
    });
  }

  async sendInteractiveMessage(
    toNumber: string,
    header: string,
    body: string,
    buttons: Array<{ title: string; id?: string }>
  ): Promise<any> {
    return this.makeRequest('/send-interactive', {
      method: 'POST',
      body: JSON.stringify({
        to: toNumber,
        header,
        body,
        buttons,
      }),
    });
  }

  // User Management
  async getUsers(limit: number = 50, offset: number = 0): Promise<{ users: UserProfile[]; total: number }> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    return this.makeRequest(`/users?${params}`);
  }

  async getUserProfile(phoneNumber: string): Promise<{ user: UserProfile; recent_conversations: ConversationMessage[] }> {
    return this.makeRequest(`/users/${phoneNumber}`);
  }

  // Lead Management
  async getLeads(
    status?: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ leads: Lead[]; total: number }> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (status) {
      params.append('status', status);
    }

    return this.makeRequest(`/leads?${params}`);
  }

  // Analytics
  async getAnalytics(
    type?: string,
    days: number = 30
  ): Promise<any> {
    const params = new URLSearchParams({
      days: days.toString(),
    });

    if (type) {
      params.append('type', type);
    }

    return this.makeRequest(`/analytics?${params}`);
  }

  // Utility Methods
  formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // If it starts with 0, replace with 254 (Kenya country code)
    if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1);
    }
    
    // If it doesn't start with a country code, assume Kenya
    if (cleaned.length === 9) {
      return '254' + cleaned;
    }
    
    return cleaned;
  }

  generateWhatsAppUrl(phoneNumber: string, message: string): string {
    const formattedNumber = this.formatPhoneNumber(phoneNumber);
    return `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
  }

  // Service Recommendations
  async getServiceRecommendations(
    userProfile: Partial<UserProfile>,
    budget?: string
  ): Promise<ServicePricing[]> {
    try {
      const allPricing = await this.getAllServicesPricing(userProfile.country);
      
      // Filter based on budget if provided
      if (budget) {
        const budgetAmount = this.parseBudgetString(budget);
        return allPricing.filter(service => service.adjusted_price <= budgetAmount);
      }
      
      // Sort by relevance based on user's business type and interests
      return allPricing.sort((a, b) => {
        const scoreA = this.calculateRelevanceScore(a, userProfile);
        const scoreB = this.calculateRelevanceScore(b, userProfile);
        return scoreB - scoreA;
      });
    } catch (error) {
      console.error('Failed to get service recommendations:', error);
      return [];
    }
  }

  private parseBudgetString(budget: string): number {
    // Extract number from budget string like "$5000", "5000 USD", etc.
    const match = budget.match(/[\d,]+/);
    if (match) {
      return parseInt(match[0].replace(/,/g, ''));
    }
    return 0;
  }

  private calculateRelevanceScore(service: ServicePricing, userProfile: Partial<UserProfile>): number {
    let score = 0;
    
    // Base score
    score += 1;
    
    // Business type relevance
    if (userProfile.business_type) {
      const businessType = userProfile.business_type.toLowerCase();
      if (businessType.includes('ecommerce') && service.service.includes('Web Development')) {
        score += 3;
      }
      if (businessType.includes('startup') && service.service.includes('Branding')) {
        score += 2;
      }
      if (businessType.includes('marketing') && service.service.includes('Digital Marketing')) {
        score += 3;
      }
    }
    
    // Interest relevance
    if (userProfile.interests) {
      userProfile.interests.forEach(interest => {
        if (service.service.toLowerCase().includes(interest.toLowerCase())) {
          score += 2;
        }
      });
    }
    
    return score;
  }

  // Lead Qualification
  qualifyLead(userProfile: UserProfile, _conversationHistory?: ConversationMessage[]): {
    score: number;
    qualification: 'hot' | 'warm' | 'cold';
    reasons: string[];
  } {
    let score = 0;
    const reasons: string[] = [];

    // Interaction frequency
    if (userProfile.interaction_count > 5) {
      score += 20;
      reasons.push('High engagement (5+ interactions)');
    } else if (userProfile.interaction_count > 2) {
      score += 10;
      reasons.push('Moderate engagement');
    }

    // Budget indication
    if (userProfile.budget_range) {
      score += 15;
      reasons.push('Budget range provided');
    }

    // Business information
    if (userProfile.business_type) {
      score += 10;
      reasons.push('Business type identified');
    }

    // Contact information
    if (userProfile.email) {
      score += 10;
      reasons.push('Email provided');
    }

    // Service interest
    if (userProfile.interests && userProfile.interests.length > 0) {
      score += 15;
      reasons.push('Specific service interests');
    }

    // Recent activity
    const lastInteraction = new Date(userProfile.last_interaction || 0);
    const daysSinceLastInteraction = (Date.now() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastInteraction < 1) {
      score += 10;
      reasons.push('Recent activity (within 24h)');
    } else if (daysSinceLastInteraction < 7) {
      score += 5;
      reasons.push('Recent activity (within week)');
    }

    // Determine qualification
    let qualification: 'hot' | 'warm' | 'cold';
    if (score >= 60) {
      qualification = 'hot';
    } else if (score >= 30) {
      qualification = 'warm';
    } else {
      qualification = 'cold';
    }

    return { score, qualification, reasons };
  }
}

// Export singleton instance
export const aiAssistantService = new AIAssistantService();
export default AIAssistantService;

