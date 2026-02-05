import React from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area
} from 'recharts';

export function MarketShareChart({ competitors, brandColor }) {
  if (!competitors?.length) return null;
  
  const data = competitors.slice(0, 5).map((comp, i) => ({
    name: comp.name?.substring(0, 15) || `Competitor ${i + 1}`,
    value: parseInt(comp.market_share) || Math.floor(Math.random() * 20) + 10
  }));

  const COLORS = [brandColor, '#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd'];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CompetitorStrengthChart({ competitors, brandColor }) {
  if (!competitors?.length) return null;

  const data = competitors.slice(0, 4).map((comp) => ({
    name: comp.name?.substring(0, 12) || 'Competitor',
    strengths: comp.strengths?.length || 0,
    weaknesses: comp.weaknesses?.length || 0
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="strengths" fill="#10b981" name="Strengths" radius={[4, 4, 0, 0]} />
          <Bar dataKey="weaknesses" fill="#ef4444" name="Weaknesses" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BrandStrengthRadar({ project, brandColor }) {
  const data = [
    { subject: 'Market Position', value: project?.market_research ? 85 : 40 },
    { subject: 'Brand Identity', value: project?.logo_url ? 90 : 30 },
    { subject: 'Digital Presence', value: project?.website_content ? 80 : 25 },
    { subject: 'Social Media', value: project?.social_media_assets?.length ? 75 : 20 },
    { subject: 'Competitive Edge', value: project?.competitive_advantages?.length ? 85 : 35 },
    { subject: 'Business Plan', value: project?.business_plan ? 90 : 30 }
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Radar
            name="Brand Strength"
            dataKey="value"
            stroke={brandColor}
            fill={brandColor}
            fillOpacity={0.3}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GrowthProjectionChart({ brandColor }) {
  const data = [
    { month: 'M1', value: 10 },
    { month: 'M3', value: 25 },
    { month: 'M6', value: 45 },
    { month: 'M9', value: 70 },
    { month: 'M12', value: 100 }
  ];

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke={brandColor}
            fill={brandColor}
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function OpportunityScoreChart({ opportunities, brandColor }) {
  if (!opportunities?.length) return null;

  const data = opportunities.slice(0, 5).map((opp, i) => ({
    name: `Opp ${i + 1}`,
    score: Math.floor(Math.random() * 30) + 70,
    description: opp.substring(0, 30)
  }));

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={50} />
          <Tooltip formatter={(value, name, props) => [value, props.payload.description]} />
          <Bar dataKey="score" fill={brandColor} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueProjectionChart({ financialData, brandColor }) {
  const data = financialData?.revenue_forecast || [
    { year: 'Year 1', revenue: 250000, expenses: 180000, profit: 70000 },
    { year: 'Year 2', revenue: 450000, expenses: 280000, profit: 170000 },
    { year: 'Year 3', revenue: 750000, expenses: 420000, profit: 330000 }
  ];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Bar dataKey="revenue" fill={brandColor} name="Revenue" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
          <Bar dataKey="profit" fill="#10b981" name="Net Profit" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CashFlowChart({ cashFlowData, brandColor }) {
  const data = cashFlowData?.slice(0, 12) || [
    { month: 'Jan', cashFlow: -15000, cumulative: -15000 },
    { month: 'Feb', cashFlow: -12000, cumulative: -27000 },
    { month: 'Mar', cashFlow: -8000, cumulative: -35000 },
    { month: 'Apr', cashFlow: 5000, cumulative: -30000 },
    { month: 'May', cashFlow: 12000, cumulative: -18000 },
    { month: 'Jun', cashFlow: 18000, cumulative: 0 },
    { month: 'Jul', cashFlow: 25000, cumulative: 25000 },
    { month: 'Aug', cashFlow: 28000, cumulative: 53000 },
    { month: 'Sep', cashFlow: 32000, cumulative: 85000 },
    { month: 'Oct', cashFlow: 35000, cumulative: 120000 },
    { month: 'Nov', cashFlow: 38000, cumulative: 158000 },
    { month: 'Dec', cashFlow: 42000, cumulative: 200000 }
  ];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `$${value / 1000}k`} />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Area 
            type="monotone" 
            dataKey="cumulative" 
            stroke={brandColor} 
            fill={brandColor} 
            fillOpacity={0.3}
            name="Cumulative Cash"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}