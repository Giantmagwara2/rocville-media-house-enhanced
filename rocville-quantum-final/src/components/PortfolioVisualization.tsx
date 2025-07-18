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

const COLORS = ['#4ade80', '#60a5fa', '#fbbf24', '#f472b6', '#a78bfa', '#f87171'];

const PortfolioVisualization: React.FC<Props> = ({ portfolio }: Props) => {
  const total = portfolio.assets.reduce((sum: number, a: Asset) => sum + a.weight, 0);
  let startAngle = 0;

  const getCoordinates = (angle: number, radius: number): { x: number; y: number } => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: 100 + radius * Math.cos(rad),
      y: 100 + radius * Math.sin(rad),
    };
  };

  const sectors = portfolio.assets.map((asset: Asset, i: number) => {
    const angle = (asset.weight / total) * 360;
    const endAngle = startAngle + angle;
    const largeArc = angle > 180 ? 1 : 0;
    const start = getCoordinates(startAngle, 90);
    const end = getCoordinates(endAngle, 90);
    const path = `M100,100 L${start.x},${start.y} A90,90 0 ${largeArc} 1 ${end.x},${end.y} Z`;
    const sector = (
      <path
        key={asset.sector}
        d={path}
        fill={COLORS[i % COLORS.length]}
        stroke="#fff"
        strokeWidth={2}
      >
        <title>{`${asset.sector}: ${(asset.weight * 100).toFixed(1)}%`}</title>
      </path>
    );
    startAngle = endAngle;
    return sector;
  });

  return (
    <div style={{ maxWidth: 300, margin: '2rem auto' }}>
      <h3 className="text-lg font-bold mb-2">Portfolio Allocation</h3>
      <svg width={200} height={200} viewBox="0 0 200 200">
        {sectors}
        <circle cx={100} cy={100} r={60} fill="#fff" />
        <text x={100} y={105} textAnchor="middle" fontSize={18} fontWeight="bold">ESG</text>
      </svg>
      <ul className="mt-2 text-sm">
        {portfolio.assets.map((a: Asset, i: number) => (
          <li key={a.sector} style={{ color: COLORS[i % COLORS.length] }}>
            <span className="font-semibold">{a.sector}</span>: {(a.weight * 100).toFixed(1)}% (ESG: {a.esgScore})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PortfolioVisualization;
