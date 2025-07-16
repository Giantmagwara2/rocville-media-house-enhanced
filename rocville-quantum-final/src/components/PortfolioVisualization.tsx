import React from 'react';
import { Portfolio } from '../../../prototypes/types';

interface Props {
  portfolio: Portfolio;
}

export default function PortfolioVisualization({ portfolio }: Props) {
  // Simple pie chart using SVG (replace with chart library for production)
  const total = portfolio.assets.reduce((sum, a) => sum + a.weight, 0);
  let acc = 0;
  const colors = ['#4fd1c5', '#63b3ed', '#f6ad55', '#fc8181', '#90cdf4', '#f687b3'];

  return (
    <svg width={200} height={200} viewBox="0 0 32 32">
      {portfolio.assets.map((asset, i) => {
        const start = acc / total * 2 * Math.PI;
        acc += asset.weight;
        const end = acc / total * 2 * Math.PI;
        const x1 = 16 + 16 * Math.sin(start);
        const y1 = 16 - 16 * Math.cos(start);
        const x2 = 16 + 16 * Math.sin(end);
        const y2 = 16 - 16 * Math.cos(end);
        const large = end - start > Math.PI ? 1 : 0;
        return (
          <path
            key={i}
            d={`M16,16 L${x1},${y1} A16,16 0 ${large} 1 ${x2},${y2} Z`}
            fill={colors[i % colors.length]}
            stroke="#fff"
            strokeWidth={0.5}
          >
            <title>{asset.sector}: {(asset.weight * 100).toFixed(1)}%</title>
          </path>
        );
      })}
    </svg>
  );
}
