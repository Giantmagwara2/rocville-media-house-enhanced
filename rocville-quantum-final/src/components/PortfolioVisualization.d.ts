import React from 'react';

type Asset = {
  sector: string;
  weight: number;
  risk: number;
  esgScore: number;
};

type Portfolio = {
  assets: Asset[];
};

type Props = {
  portfolio: Portfolio;
};

declare const PortfolioVisualization: React.FC<Props>;
export default PortfolioVisualization;
