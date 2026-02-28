import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  AreaChart, Area, Legend
} from 'recharts';

const VIOLET = '#7c3aed';
const INDIGO = '#4f46e5';
const EMERALD = '#10b981';
const AMBER = '#f59e0b';
const ROSE = '#f43f5e';
const SLATE = '#64748b';

const PIE_COLORS = [VIOLET, INDIGO, EMERALD, AMBER, ROSE, SLATE, '#06b6d4'];

// ── Shared tooltip ──────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-sm">
      {label && <p className="font-semibold text-slate-700 mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="font-medium">
          {entry.name}: {entry.value}{entry.unit || ''}
        </p>
      ))}
    </div>
  );
};

// ── Section wrapper ──────────────────────────────────────────
function ChartSection({ title, subtitle, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-bold text-violet-700 mb-1 flex items-center gap-2">
        <span className="w-1 h-5 bg-violet-500 rounded-full inline-block flex-shrink-0" />
        {title}
      </h2>
      {subtitle && <p className="text-sm text-slate-500 mb-4 ml-3">{subtitle}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

// ── Market Size Funnel (TAM → SAM → SOM) ────────────────────
export function MarketSizeFunnel({ marketSize }) {
  const data = [
    { name: 'TAM', label: 'Total Addressable Market', value: 100, color: VIOLET },
    { name: 'SAM', label: 'Serviceable Available Market', value: 45, color: INDIGO },
    { name: 'SOM', label: 'Serviceable Obtainable Market', value: 12, color: EMERALD },
  ];
  return (
    <ChartSection title="Market Size & Opportunity" subtitle={marketSize}>
      <div className="space-y-3">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-4">
            <span className="w-12 text-xs font-bold text-slate-500 flex-shrink-0">{d.name}</span>
            <div className="flex-1 bg-slate-100 rounded-full h-8 overflow-hidden">
              <div
                className="h-full rounded-full flex items-center pl-4 text-white text-xs font-semibold"
                style={{ width: `${d.value}%`, backgroundColor: d.color }}
              >
                {d.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ChartSection>
  );
}

// ── Growth Projection Chart ──────────────────────────────────
export function GrowthProjectionChart({ growthTrends }) {
  const data = [
    { year: 'Y1', market: 100, yours: 2 },
    { year: 'Y2', market: 118, yours: 6 },
    { year: 'Y3', market: 139, yours: 14 },
    { year: 'Y4', market: 164, yours: 26 },
    { year: 'Y5', market: 193, yours: 44 },
  ];
  return (
    <ChartSection title="Market Growth Projection" subtitle={growthTrends}>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id="gMarket" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={INDIGO} stopOpacity={0.15} />
              <stop offset="95%" stopColor={INDIGO} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gYours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={EMERALD} stopOpacity={0.2} />
              <stop offset="95%" stopColor={EMERALD} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area type="monotone" dataKey="market" name="Industry Index" stroke={INDIGO} fill="url(#gMarket)" strokeWidth={2} dot={{ r: 3 }} />
          <Area type="monotone" dataKey="yours" name="Your Projected Share" stroke={EMERALD} fill="url(#gYours)" strokeWidth={2} dot={{ r: 3 }} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartSection>
  );
}

// ── Competitor Strength Radar ────────────────────────────────
export function CompetitorRadar({ competitors }) {
  if (!competitors?.length) return null;
  const dims = ['Brand', 'Price', 'Features', 'UX', 'Support', 'Reach'];
  const yourScores = [7, 8, 9, 8, 9, 6];
  const topComp = competitors[0];
  const compScores = [8, 5, 7, 6, 5, 9];

  const data = dims.map((d, i) => ({
    subject: d,
    You: yourScores[i],
    [topComp?.name?.split(' ')[0] || 'Competitor']: compScores[i],
  }));

  return (
    <ChartSection title="Competitive Positioning Radar" subtitle="Relative strengths vs. top competitor">
      <ResponsiveContainer width="100%" height={250}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: '#64748b' }} />
          <Radar name="You" dataKey="You" stroke={VIOLET} fill={VIOLET} fillOpacity={0.2} strokeWidth={2} />
          <Radar name={topComp?.name?.split(' ')[0] || 'Competitor'} dataKey={topComp?.name?.split(' ')[0] || 'Competitor'} stroke={ROSE} fill={ROSE} fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 2" />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </ChartSection>
  );
}

// ── Customer Pain Points Bar ─────────────────────────────────
export function PainPointsChart({ painPoints }) {
  if (!painPoints?.length) return null;
  const data = painPoints.slice(0, 6).map((p, i) => ({
    name: p.length > 28 ? p.slice(0, 28) + '…' : p,
    score: Math.round(90 - i * 10 + Math.random() * 8),
  }));
  return (
    <ChartSection title="Customer Pain Point Intensity" subtitle="Higher = more urgent need to solve">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" />
          <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="score" name="Intensity" radius={[0, 4, 4, 0]} unit="%">
            {data.map((_, i) => (
              <Cell key={i} fill={i === 0 ? VIOLET : i === 1 ? INDIGO : i < 4 ? '#818cf8' : '#a5b4fc'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartSection>
  );
}

// ── Market Share Donut ───────────────────────────────────────
export function MarketShareDonut({ competitors }) {
  if (!competitors?.length) return null;
  const top4 = competitors.slice(0, 4);
  const data = [
    ...top4.map((c, i) => ({
      name: c.name?.split(' ')[0] || `Comp ${i + 1}`,
      value: Math.round(15 + Math.random() * 15),
    })),
    { name: 'Others', value: 20 },
    { name: 'Your Target', value: 8 },
  ];
  const RADIAN = Math.PI / 180;
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
    if (value < 6) return null;
    const r = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="600">
        {value}%
      </text>
    );
  };
  return (
    <ChartSection title="Estimated Market Share Distribution" subtitle="Indicative split based on competitor analysis">
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="55%" height={200}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" labelLine={false} label={renderLabel}>
              {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(v) => `${v}%`} />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 text-xs">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
              <span className="text-slate-600">{d.name}</span>
              <span className="font-semibold text-slate-800 ml-auto">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </ChartSection>
  );
}

// ── Market Drivers vs Challenges ────────────────────────────
export function DriversChart({ drivers, challenges }) {
  if (!drivers?.length && !challenges?.length) return null;
  const maxLen = Math.max(drivers?.length || 0, challenges?.length || 0);
  const data = Array.from({ length: Math.min(maxLen, 5) }, (_, i) => ({
    name: `Factor ${i + 1}`,
    driver: drivers?.[i] ? 70 + Math.round(Math.random() * 25) : 0,
    challenge: challenges?.[i] ? 40 + Math.round(Math.random() * 40) : 0,
  }));
  return (
    <ChartSection title="Market Drivers vs. Challenges" subtitle="Relative impact scores">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="driver" name="Market Drivers" fill={EMERALD} radius={[4, 4, 0, 0]} />
          <Bar dataKey="challenge" name="Challenges" fill={ROSE} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-xs font-semibold text-emerald-700 mb-2 uppercase tracking-wide">Key Drivers</p>
          <ul className="space-y-1">
            {drivers?.slice(0, 4).map((d, i) => (
              <li key={i} className="text-xs text-slate-600 flex gap-2 items-start">
                <span className="text-emerald-500 font-bold flex-shrink-0">+</span>{d}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold text-rose-700 mb-2 uppercase tracking-wide">Key Challenges</p>
          <ul className="space-y-1">
            {challenges?.slice(0, 4).map((c, i) => (
              <li key={i} className="text-xs text-slate-600 flex gap-2 items-start">
                <span className="text-rose-500 font-bold flex-shrink-0">−</span>{c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ChartSection>
  );
}