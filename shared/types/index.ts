// Portfolio Types
export interface Asset {
  sector: string;
  weight: number;
  risk: number;
  esgScore: number;
}

export interface Portfolio {
  assets: Asset[];
  optimizationMessage?: string;
}

// Market Data Types
export interface MarketTrend {
  sector: string;
  growth: number;
  volatility: number;
}

export interface MarketData {
  trends: MarketTrend[];
}

// Sustainability Types
export interface SustainabilityMetrics {
  esgScores: Record<string, number>;
  carbonFootprint: Record<string, number>;
}

// AI Types
export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  answer: string;
  confidence: number;
}

// User Preferences
export interface UserPreferences {
  riskTolerance: number;
  sustainability: boolean;
  sectors?: string[];
}
