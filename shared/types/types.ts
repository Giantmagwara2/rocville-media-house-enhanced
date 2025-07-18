export interface Portfolio {
  assets: {
    sector: string;
    weight: number;
    risk: number;
    esgScore?: number;
  }[];
}
export interface MarketData {
  [key: string]: any;
}
export interface SustainabilityMetrics {
  [key: string]: any;
}
