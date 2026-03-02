import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Shield, Users, Zap, BookOpen, Search, ChevronDown, ChevronRight,
  Bot, Image, Palette, TrendingUp, Globe, FileText, MessageSquare,
  Target, Lightbulb, ShieldCheck, Layers, Megaphone, BarChart2,
  Star, AlertTriangle, CheckCircle2, Lock, Sparkles, Crown,
  Video, Mail, Phone, Layout, Clipboard, Eye, ArrowRight
} from 'lucide-react';

// ── Agent Registry ──────────────────────────────────────────────────────────

const AGENTS = [
  {
    id: 'graphic_artist',
    name: 'Graphic Artist',
    icon: Image,
    color: 'from-pink-500 to-rose-500',
    badge: 'bg-pink-100 text-pink-700',
    category: 'Visual Quality',
    status: 'active',
    clearance: 'Admin',
    tagline: 'Seasoned graphic artist — perfects every image asset to publication quality.',
    description: 'The Graphic Artist AI Agent acts as your on-demand senior creative director. It inspects ALL platform images — hero photos, logos, brand assets, social graphics — against professional publication standards. It scores each asset on crop quality, transparency, composition, brand alignment, and professional grade, then delivers actionable regeneration or correction instructions.',
    responsibilities: [
      'Inspects all uploaded logos for transparent backgrounds (flags white-box logos as CRITICAL)',
      'Evaluates hero images for professional composition, resolution, and brand alignment',
      'Reviews all BusinessProject logos and saved logo variations',
      'Scores each visual asset 0-10 across Crop, Transparency, Composition, Brand Alignment, Quality',
      'Produces a full Visual Quality Report with prioritized fix list',
      'Flags any image that would embarrass the brand in a professional context',
    ],
    useCases: [
      'Ask it to audit all project logos before a client pitch',
      'Have it review your hero image before a product launch',
      'Use it to check if uploaded logos have proper transparent backgrounds',
      'Get a full visual quality report before going live',
    ],
    accessPath: 'Admin Dashboard → Agents → Graphic Artist',
  },
  {
    id: 'brand_sentinel',
    name: 'Brand Sentinel',
    icon: ShieldCheck,
    color: 'from-violet-500 to-indigo-600',
    badge: 'bg-violet-100 text-violet-700',
    category: 'Brand Integrity',
    status: 'active',
    clearance: 'Admin',
    tagline: 'Zero-tolerance brand consistency enforcer across all touchpoints.',
    description: 'The Brand Sentinel enforces absolute consistency of visual and verbal brand identity across every platform output. Critically, it treats the project logo as the origin point of the entire color system — all color choices in business plans, documentation, brand kits, websites, and social assets must be complementary to the logo\'s actual colors. All inconsistencies are reported directly to the Project Manager AI via structured Brand Inconsistency Reports.',
    responsibilities: [
      'Visual identity enforcement: colors, fonts, logo usage, iconography, layout grids',
      'Verbal consistency: brand voice, tone, terminology, CTAs, headline patterns',
      'Logo-complementary color enforcement: all colors in every document, plan, and asset must harmonize with the project logo\'s palette',
      'Reports ALL inconsistencies to the Project Manager AI via structured Brand Inconsistency Reports (severity: CRITICAL / HIGH / MEDIUM / LOW)',
      'Submits specific suggestions and corrective action recommendations to the Project Manager for assignment',
      'Multi-agent compliance: validates outputs from all other AI agents',
      'Compliance scoring with deduction model (wrong color -5, logo-contradicting scheme -10, logo misuse -15)',
      'Flags systemic issues — same deviation across multiple assets — as HIGH or CRITICAL',
    ],
    useCases: [
      '"Review my business plan — are the colors complementary to my logo?"',
      '"Audit all social media assets for logo color harmony"',
      '"Submit a brand inconsistency report to the Project Manager for this newsletter"',
      '"Run a platform-wide brand compliance audit and report findings"',
    ],
    accessPath: 'Admin Dashboard → Agents → Brand Sentinel',
  },
  {
    id: 'brand_consistency_guardian',
    name: 'Reliability & Diagnostics',
    icon: AlertTriangle,
    color: 'from-amber-500 to-orange-500',
    badge: 'bg-amber-100 text-amber-700',
    category: 'Diagnostics',
    status: 'active',
    clearance: 'Admin',
    tagline: 'Diagnostic-first reliability agent — finds and repairs app inconsistencies.',
    description: 'The Reliability & Diagnostics Agent operates on a strict user-invoked protocol. It never acts autonomously. When called, it enters Diagnostic Mode: identifying errors, logic inconsistencies, and misconfigurations in the platform, then presents findings classified by severity before any repair is authorized.',
    responsibilities: [
      'Diagnoses app errors, broken flows, and logic inconsistencies',
      'Classifies findings: Critical / High / Medium / Low',
      'Reports exactly what is broken, where, why, and the impact',
      'Audits brand consistency issues when invoked for brand review',
      'Performs minimal, reversible repairs only when explicitly authorized',
      'One repair cycle per instruction — never mass-patches without approval',
    ],
    useCases: [
      '"Check for bugs in the onboarding flow"',
      '"Why is the hero image not saving?"',
      '"Audit the business plan template for brand alignment"',
      '"Fix the broken navigation link on mobile"',
    ],
    accessPath: 'Admin Dashboard → Agents → Brand Consistency Guardian',
  },
  {
    id: 'cms_design_guardian',
    name: 'Theme Coordinator',
    icon: Palette,
    color: 'from-blue-500 to-cyan-500',
    badge: 'bg-blue-100 text-blue-700',
    category: 'CMS & Design',
    status: 'active',
    clearance: 'Super Admin / Delegated',
    tagline: 'Manages platform themes, branding identity, and design system compliance.',
    description: 'The Theme Coordinator is the delegated authority for all platform-wide visual identity changes. Super Admins can assign this agent to manage theme selection, site name/logo/favicon replacement, hero content, and footer settings — all without code changes. It also enforces the design system across all pages.',
    responsibilities: [
      'Changes the active color theme (7 options: Forge, Royal Violet, Emerald, Rose, Ocean Blue, Slate, Prestige Gold)',
      'Updates site name — replaces "BrandForge" everywhere instantly',
      'Manages logo_url and favicon_url across the entire platform',
      'Updates hero content: headline, subheadline, badge text, CTAs',
      'Audits pages against the design system (dark slate base, amber/violet accents, card styles)',
      'Flags bg-black usage, hardcoded colors, and off-system fonts',
    ],
    useCases: [
      '"Change the platform theme to Royal Violet"',
      '"Update the site name to Credit Sensi and upload our logo"',
      '"Audit the Dashboard page for design system compliance"',
      '"Set the hero headline to [new text]"',
    ],
    accessPath: 'Admin Dashboard → Theme & Brand tab',
  },
  {
    id: 'logo_standards_guardian',
    name: 'Logo Standards Guardian',
    icon: Star,
    color: 'from-yellow-400 to-amber-500',
    badge: 'bg-yellow-100 text-yellow-700',
    category: 'Visual Quality',
    status: 'active',
    clearance: 'Admin',
    tagline: 'Single source of truth for all logo assets — format, transparency, standards.',
    description: 'The Logo Standards Guardian ensures every logo across the platform meets agency-grade professional standards. It enforces true transparency (alpha channel, no white fills), correct formats (SVG/PNG/PDF), proper scaling, clear-space rules, and brand color accuracy. It is the last checkpoint before any logo is deployed to any surface.',
    responsibilities: [
      'Generates and normalizes logos within strict brand constraints',
      'Removes white backgrounds and enforces TRUE alpha-channel transparency',
      'Validates format compliance: SVG (master), PNG (multi-res), PDF (print)',
      'Checks logo deployment across: app UI, websites, documents, video, pitch decks',
      'Maintains the logo asset library with version control',
      'Issues logo compliance reports and usage guidelines',
    ],
    useCases: [
      'Upload a client logo and get a professional normalized version back',
      'Check if a logo will look correct on dark and light backgrounds',
      'Get a full logo asset package (all sizes, all formats) for a project',
      'Audit all saved project logos for transparency compliance',
    ],
    accessPath: 'Projects → Brand Assets → Logo Standards Guardian',
  },
  {
    id: 'business_assistant',
    name: 'Business Assistant',
    icon: Lightbulb,
    color: 'from-emerald-500 to-teal-500',
    badge: 'bg-emerald-100 text-emerald-700',
    category: 'Business Intelligence',
    status: 'active',
    clearance: 'All Users',
    tagline: 'Your AI business advisor — strategy, planning, and growth guidance.',
    description: 'The Business Assistant is the primary user-facing AI agent for business development guidance. It helps users with strategy, market positioning, competitive analysis, and business planning questions. It has deep context about the user\'s BusinessProject data and can provide tailored advice.',
    responsibilities: [
      'Answers business strategy questions using project-specific context',
      'Provides market research interpretation and competitive positioning advice',
      'Guides users through business plan sections and financial projections',
      'Suggests growth strategies based on industry and target audience',
      'Explains platform features and how to use them effectively',
    ],
    useCases: [
      '"How should I position my business against [competitor]?"',
      '"What\'s the best pricing strategy for my target market?"',
      '"Help me write my executive summary"',
      '"What features should I launch first?"',
    ],
    accessPath: 'Any project page → Business Assistant chat',
  },
  {
    id: 'market_intelligence',
    name: 'Market Intelligence',
    icon: BarChart2,
    color: 'from-cyan-500 to-blue-500',
    badge: 'bg-cyan-100 text-cyan-700',
    category: 'Research',
    status: 'active',
    clearance: 'All Users',
    tagline: 'Deep market research, trend analysis, and opportunity identification.',
    description: 'The Market Intelligence Agent specializes in real-time market research, trend analysis, and competitor intelligence. It synthesizes industry data to identify market gaps and growth opportunities specific to the user\'s business and geography.',
    responsibilities: [
      'Conducts industry trend analysis and market sizing',
      'Identifies competitor strengths, weaknesses, and market positions',
      'Finds under-served market segments and gaps',
      'Analyzes pricing benchmarks across the competitive landscape',
      'Provides demand signals and emerging opportunity alerts',
    ],
    useCases: [
      '"What are the top 5 competitors in [industry] in [city]?"',
      '"What market gaps exist that I can exploit?"',
      '"What\'s the current pricing benchmark for [service]?"',
    ],
    accessPath: 'Projects → Market Research tab',
  },
  {
    id: 'business_plan_architect',
    name: 'Business Plan Architect',
    icon: FileText,
    color: 'from-violet-500 to-purple-600',
    badge: 'bg-violet-100 text-violet-700',
    category: 'Business Intelligence',
    status: 'active',
    clearance: 'All Users',
    tagline: 'Generates comprehensive, investor-ready 30-year business plans.',
    description: 'The Business Plan Architect produces full investor-grade business plans including executive summary, market analysis, competitive strategy, 30-year financial projections, operations plan, and risk analysis. Plans are generated from the user\'s BusinessProject data and market research findings.',
    responsibilities: [
      '30-year financial projections with revenue, expense, and profit modeling',
      'Competitor-differentiated strategy recommendations',
      'Market opportunity sizing and penetration strategy',
      'Operations and organizational structure planning',
      'Risk analysis with mitigation strategies',
      'Fully formatted PDF export with brand customization',
    ],
    useCases: [
      'Generate a full business plan for investor presentations',
      'Create custom-branded business plan PDFs for clients',
      'Update financial projections with new data',
    ],
    accessPath: 'Projects → Business Plan tab',
  },
  {
    id: 'commercial_video_architect',
    name: 'Commercial Video Architect',
    icon: Video,
    color: 'from-red-500 to-pink-500',
    badge: 'bg-red-100 text-red-700',
    category: 'Content Creation',
    status: 'active',
    clearance: 'Starter+',
    tagline: 'Generates branded commercial video concepts and scripts.',
    description: 'The Commercial Video Architect generates complete commercial video concepts, scripts, and production briefs tailored to the business\'s brand identity, target audience, and competitive positioning. It produces content optimized for multiple platforms and durations.',
    responsibilities: [
      'Generates 15s, 30s, 60s, and 2-min commercial scripts',
      'Adapts scripts for different platforms (TV, YouTube, Instagram, TikTok)',
      'Incorporates brand voice, key differentiators, and CTAs',
      'Produces director notes and production briefs',
      'Aligns video tone with brand personality and audience demographics',
    ],
    useCases: [
      'Create a 30-second brand awareness commercial script',
      'Generate a YouTube pre-roll ad for a new service launch',
      'Write a social media video script for product showcase',
    ],
    accessPath: 'Projects → Video Creation tab',
  },
  {
    id: 'board_advisor',
    name: 'Board Advisor',
    icon: Crown,
    color: 'from-slate-600 to-slate-800',
    badge: 'bg-slate-100 text-slate-700',
    category: 'Executive Strategy',
    status: 'active',
    clearance: 'Professional+',
    tagline: 'Executive-level strategic counsel — your virtual board of advisors.',
    description: 'The Board Advisor operates as a virtual board of directors — providing C-suite level strategic guidance on major business decisions, expansion strategies, partnership opportunities, and critical pivots. It draws on deep business strategy frameworks and cross-industry expertise.',
    responsibilities: [
      'Strategic business decision analysis (expand, pivot, partner, acquire)',
      'Executive presentation preparation and board deck review',
      'Risk assessment for major business decisions',
      'Go-to-market strategy counsel',
      'Competitive response strategy (when a competitor makes a major move)',
      'Investor readiness assessment',
    ],
    useCases: [
      '"Should I expand to a second location or focus on digital?"',
      '"How do I respond to a major competitor launching a similar product?"',
      '"Am I ready for Series A funding?"',
    ],
    accessPath: 'Projects → Board Advisor (Professional+ plan)',
  },
  {
    id: 'seo_growth_engine',
    name: 'SEO Growth Engine',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-600',
    badge: 'bg-green-100 text-green-700',
    category: 'Marketing',
    status: 'active',
    clearance: 'Starter+',
    tagline: 'Keyword research, on-page SEO, and competitor gap analysis.',
    description: 'The SEO Growth Engine provides comprehensive SEO strategy tailored to outrank competitors in the user\'s specific market. It performs keyword research, on-page analysis, competitor SEO audits, and generates technical SEO files (sitemap, robots.txt).',
    responsibilities: [
      'Keyword research targeting gaps in competitor coverage',
      'On-page SEO analysis and optimization recommendations',
      'Competitor SEO strategy deconstruction',
      'Technical SEO: sitemap and robots.txt generation',
      'Content strategy for organic traffic growth',
      'Local SEO optimization for geo-specific businesses',
    ],
    useCases: [
      '"Find keywords my competitors rank for that I don\'t"',
      '"Analyze my homepage for SEO gaps"',
      '"Generate a sitemap for my website"',
    ],
    accessPath: 'Projects → SEO Tools tab',
  },
  {
    id: 'advertising_manager',
    name: 'Advertising Manager',
    icon: Megaphone,
    color: 'from-orange-500 to-amber-500',
    badge: 'bg-orange-100 text-orange-700',
    category: 'Marketing',
    status: 'active',
    clearance: 'Starter+',
    tagline: 'Multi-channel ad strategy, copy, and campaign management.',
    description: 'The Advertising Manager plans, writes, and optimizes advertising campaigns across Google Ads, Meta (Facebook/Instagram), LinkedIn, TikTok, and programmatic channels. It generates ad copy, audience targeting strategies, and budget allocation recommendations.',
    responsibilities: [
      'Multi-channel campaign strategy (Google, Meta, LinkedIn, TikTok)',
      'Ad copy generation for all formats (text, display, video, carousel)',
      'Audience targeting and lookalike audience recommendations',
      'Budget allocation and bid strategy guidance',
      'A/B testing frameworks and creative variation suggestions',
      'ROI optimization and performance improvement recommendations',
    ],
    useCases: [
      'Write 5 Google Ads headlines and descriptions for my service',
      'Create a Facebook ad campaign strategy for a product launch',
      'Recommend ad budget split across channels for a $2,000/month budget',
    ],
    accessPath: 'Projects → Advertising tab',
  },
  {
    id: 'seasonal_newsletter_strategist',
    name: 'Newsletter Strategist',
    icon: Mail,
    color: 'from-teal-500 to-cyan-500',
    badge: 'bg-teal-100 text-teal-700',
    category: 'Content Creation',
    status: 'active',
    clearance: 'Starter+',
    tagline: 'Seasonal and campaign-driven newsletter content strategist.',
    description: 'The Newsletter Strategist plans and writes branded email newsletters aligned to seasonal campaigns, business milestones, and content pillars. It generates complete newsletter content with subject lines, body copy, CTAs, and design recommendations — all matching the brand voice.',
    responsibilities: [
      'Seasonal content calendar creation (12-month editorial planning)',
      'Full newsletter drafts with subject line, preview text, body, and CTA',
      'Brand voice-aligned copywriting for all campaign types',
      'A/B subject line variations for open rate optimization',
      'Segmentation strategy by audience type',
      'Design layout recommendations for each campaign',
    ],
    useCases: [
      'Create a Black Friday campaign email series (3 emails)',
      'Write a monthly business update newsletter template',
      'Plan a 12-month seasonal content calendar for my industry',
    ],
    accessPath: 'Projects → Newsletter tab',
  },
  {
    id: 'performance_monitor',
    name: 'Performance Monitor',
    icon: BarChart2,
    color: 'from-blue-600 to-indigo-600',
    badge: 'bg-blue-100 text-blue-700',
    category: 'Analytics',
    status: 'active',
    clearance: 'Starter+',
    tagline: 'AI-powered performance analysis, anomaly detection, and growth insights.',
    description: 'The Performance Monitor analyzes business metrics and analytics data to surface actionable insights, detect anomalies, and predict trends. It produces monthly, quarterly, and annual performance summaries with AI-generated recommendations.',
    responsibilities: [
      'Revenue, expense, and profit trend analysis',
      'Customer acquisition and churn rate monitoring',
      'Conversion rate and funnel performance analysis',
      'Anomaly detection (sudden drops or spikes in key metrics)',
      'Predictive growth modeling (next month revenue, quarterly trajectory)',
      'Automated performance report generation',
    ],
    useCases: [
      '"Why did my conversion rate drop 15% this month?"',
      '"What does my Q1 performance predict for Q2?"',
      '"Generate my monthly performance report"',
    ],
    accessPath: 'Projects → Analytics tab → AI Insights',
  },
  {
    id: 'security_sentinel',
    name: 'Security Sentinel',
    icon: Lock,
    color: 'from-red-600 to-rose-700',
    badge: 'bg-red-100 text-red-700',
    category: 'Security',
    status: 'active',
    clearance: 'Super Admin Only',
    tagline: 'Constitutional authority of the platform — enforces Super Admin policy and access control.',
    description: 'The Security Sentinel is the platform\'s constitutional enforcement agent. Its primary mandate is immutable: the first registered user on any app instance is permanently and irrevocably the Super Admin. There is exactly one Super Admin per instance. They can never be deleted, demoted, or restricted. Only the Super Admin can add, remove, or modify other users and their permissions. Every security policy violation is detected, logged, and reported immediately.',
    responsibilities: [
      'PERMANENT RULE: First registered user = Super Admin — cannot be deleted, demoted, or duplicated',
      'Enforces exactly one Super Admin per app instance at all times',
      'Super Admin has complete, unrestricted access to all functions — no permission flag may limit them',
      'Only the Super Admin may invite users, assign roles, modify permissions, or delete accounts',
      'Admin-role users cannot manage other users unless explicitly granted manage_users by the Super Admin',
      'Detects and blocks any attempt to delete, demote, or restrict the Super Admin',
      'Monitors for unauthorized privilege escalation, duplicate Super Admin attempts, and access violations',
      'Logs all user management actions with actor, timestamp, and before/after state — audit logs are immutable',
      'Reports all CRITICAL and HIGH security violations immediately to the Super Admin',
    ],
    useCases: [
      '"Who is the Super Admin for this instance?"',
      '"Has anyone attempted to modify admin permissions without authorization?"',
      '"Show me the audit log for all user management actions this week"',
      '"Is our role hierarchy correctly configured per platform policy?"',
    ],
    accessPath: 'Admin Dashboard → Security Sentinel (Super Admin only)',
  },
  {
    id: 'project_manager',
    name: 'Project Manager',
    icon: Clipboard,
    color: 'from-slate-500 to-slate-700',
    badge: 'bg-slate-100 text-slate-700',
    category: 'Operations',
    status: 'active',
    clearance: 'All Users',
    tagline: 'Eyes & ears of the platform — monitors all agent activity, submits daily compliance reports.',
    description: 'The Project Manager AI Agent is the command center of BrandForge\'s AI infrastructure. Beyond task and project management, it functions as the platform\'s surveillance and accountability layer — monitoring every AI agent for activity, compliance, and output quality. It submits structured Daily Agent Activity Reports flagging any agent that is inactive, inconsistent, non-compliant, or non-existent, and escalates critical issues to Admin.',
    responsibilities: [
      'Creates and organizes tasks from business plan milestones',
      'Prioritizes tasks by impact and deadline and tracks project health',
      'Monitors ALL AI agents for activity, output quality, and compliance with defined roles',
      'Flags agents that are Inactive, Inconsistent, Non-Compliant, or Non-Existent',
      'Submits structured Daily Agent Activity Reports with a full agent status roster',
      'Escalates CRITICAL agent failures with specific corrective action recommendations',
      'Generates an overall Platform Agent Health score per reporting period',
      'Functions as the eyes and ears of the entire app — nothing escapes its watch',
    ],
    useCases: [
      '"Generate today\'s Daily Agent Activity Report"',
      '"Which agents have not produced compliant output in the last 24 hours?"',
      '"Create a task list for launching my website"',
      '"Show me all overdue tasks across my projects"',
    ],
    accessPath: 'Tasks page → Project Manager / Admin Dashboard → Agent Reports',
  },
];

// ── Category Filter Config ──────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'all', label: 'All Agents' },
  { id: 'Security', label: 'Security' },
  { id: 'Visual Quality', label: 'Visual Quality' },
  { id: 'Brand Integrity', label: 'Brand Integrity' },
  { id: 'CMS & Design', label: 'CMS & Design' },
  { id: 'Business Intelligence', label: 'Business Intelligence' },
  { id: 'Marketing', label: 'Marketing' },
  { id: 'Content Creation', label: 'Content Creation' },
  { id: 'Research', label: 'Research' },
  { id: 'Analytics', label: 'Analytics' },
  { id: 'Operations', label: 'Operations' },
  { id: 'Diagnostics', label: 'Diagnostics' },
  { id: 'Executive Strategy', label: 'Executive Strategy' },
];

const CLEARANCE_COLORS = {
  'Super Admin Only': 'bg-red-100 text-red-700',
  'Super Admin / Delegated': 'bg-purple-100 text-purple-700',
  'Admin': 'bg-blue-100 text-blue-700',
  'Professional+': 'bg-amber-100 text-amber-700',
  'Starter+': 'bg-emerald-100 text-emerald-700',
  'All Users': 'bg-slate-100 text-slate-600',
};

// ── Agent Card ──────────────────────────────────────────────────────────────

function AgentCard({ agent }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = agent.icon;

  return (
    <Card className="wizard-card border-0 overflow-hidden hover:shadow-lg transition-all duration-200">
      <button
        className="w-full text-left"
        onClick={() => setExpanded(v => !v)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-bold text-slate-900 text-base">{agent.name}</h3>
                <Badge className={`${agent.badge} text-[11px]`}>{agent.category}</Badge>
                <Badge className={`${CLEARANCE_COLORS[agent.clearance] || 'bg-slate-100 text-slate-600'} text-[11px]`}>
                  <Lock className="w-2.5 h-2.5 mr-1" />{agent.clearance}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{agent.tagline}</p>
            </div>
            <div className="flex-shrink-0 text-slate-400">
              {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </div>
          </div>
        </CardHeader>
      </button>

      {expanded && (
        <CardContent className="pt-0 border-t border-slate-100">
          <div className="pt-4 space-y-5">
            {/* Description */}
            <p className="text-sm text-slate-600 leading-relaxed">{agent.description}</p>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Responsibilities */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />Core Responsibilities
                </h4>
                <ul className="space-y-1.5">
                  {agent.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Use Cases */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />Example Prompts
                </h4>
                <ul className="space-y-2">
                  {agent.useCases.map((u, i) => (
                    <li key={i} className="text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100 italic">
                      {u}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center gap-2 text-xs text-violet-600 font-medium">
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>{agent.accessPath}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────

export default function AdminDocs() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSection, setActiveSection] = useState('agents');

  const filteredAgents = AGENTS.filter(a => {
    const matchCat = activeCategory === 'all' || a.category === activeCategory;
    const matchSearch = !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-violet-900 to-slate-900 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/30 flex-shrink-0">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-extrabold text-white tracking-tight">BrandForge Platform Documentation</h1>
                <Badge className="bg-white/20 text-white border-white/30 border text-xs">Admin & Staff Only</Badge>
              </div>
              <p className="text-violet-200 text-base mt-1 max-w-2xl">
                Complete internal reference for all AI agents, their roles, capabilities, access levels, and operational guidelines. This documentation ensures every team member understands how to leverage the platform's AI infrastructure.
              </p>
              <div className="flex items-center gap-4 mt-4 text-sm text-violet-300">
                <span className="flex items-center gap-1.5"><Bot className="w-4 h-4" />{AGENTS.length} AI Agents</span>
                <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" />Confidential — Internal Use Only</span>
                <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" />Last updated: March 2026</span>
              </div>
            </div>
          </div>

          {/* Section Nav */}
          <div className="flex gap-3 mt-8">
            {[
              { id: 'agents', icon: Bot, label: 'AI Agents' },
              { id: 'overview', icon: Layers, label: 'Platform Overview' },
              { id: 'image_standards', icon: Image, label: 'Image Standards' },
              { id: 'brand_rules', icon: ShieldCheck, label: 'Brand Rules' },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeSection === s.id
                    ? 'bg-white text-slate-900 shadow'
                    : 'bg-white/10 text-violet-200 hover:bg-white/20 hover:text-white'
                }`}
              >
                <s.icon className="w-4 h-4" />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">

        {/* ── AGENTS SECTION ── */}
        {activeSection === 'agents' && (
          <>
            {/* Search + Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search agents by name, category, or capability..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    activeCategory === cat.id
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total AI Agents', value: AGENTS.length, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-100' },
                { label: 'Visual Quality', value: AGENTS.filter(a => a.category === 'Visual Quality').length, color: 'text-pink-600', bg: 'bg-pink-50 border-pink-100' },
                { label: 'Admin Only', value: AGENTS.filter(a => a.clearance === 'Admin' || a.clearance === 'Super Admin / Delegated').length, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
                { label: 'User-Facing', value: AGENTS.filter(a => a.clearance === 'All Users').length, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
              ].map(stat => (
                <Card key={stat.label} className={`border ${stat.bg} shadow-none`}>
                  <CardContent className="p-4">
                    <p className="text-xs text-slate-500 mb-0.5">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Agent List */}
            <div className="space-y-4">
              <p className="text-sm text-slate-500">{filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''} • Click any agent to expand full documentation</p>
              {filteredAgents.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </>
        )}

        {/* ── PLATFORM OVERVIEW ── */}
        {activeSection === 'overview' && (
          <div className="space-y-6">
            <Card className="wizard-card border-0">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-slate-900 flex items-center gap-2"><Layers className="w-5 h-5 text-violet-500" />Platform Architecture Overview</CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-6">
                <p className="text-slate-600 leading-relaxed">BrandForge is a fully AI-native SaaS platform built for entrepreneurs and small business owners. The platform uses a multi-agent architecture where specialized AI agents handle distinct business functions — from brand creation to market research to financial planning. All agents operate within a governed content management system controlled by Admin and Super Admin roles.</p>

                {[
                  {
                    title: 'User Tier', color: 'bg-emerald-500', items: [
                      'Business Assistant, Market Intelligence, Project Manager — always available',
                      'Create and manage BusinessProject records',
                      'Access their own projects, tasks, and generated assets',
                      'Cannot access other users\' data (RLS enforced at database level)',
                    ]
                  },
                  {
                    title: 'Starter+ Tier', color: 'bg-blue-500', items: [
                      'All user features plus SEO Tools, Advertising Manager, Newsletter Strategist',
                      'Business Plan Architect with PDF export',
                      'Social media asset generation',
                      'Performance analytics with AI insights',
                    ]
                  },
                  {
                    title: 'Professional+ Tier', color: 'bg-violet-500', items: [
                      'All Starter features plus Board Advisor, Commercial Video Architect',
                      'White-label capabilities (custom domain, remove branding)',
                      'Advanced financial modeling (30-year projections)',
                      'Priority support access',
                    ]
                  },
                  {
                    title: 'Admin Level', color: 'bg-amber-500', items: [
                      'Brand Sentinel, Reliability & Diagnostics, Graphic Artist, Logo Standards Guardian',
                      'User management (invite, deactivate, reset passwords)',
                      'Brand Audit Dashboard with daily AI scoring',
                      'Platform-wide settings and CMS controls',
                    ]
                  },
                  {
                    title: 'Super Admin Level', color: 'bg-purple-600', items: [
                      'All Admin capabilities plus Theme Coordinator agent',
                      'Change user roles including promoting to Super Admin',
                      'Full platform theme and branding control',
                      'Cannot be deactivated or deleted by other admins',
                    ]
                  },
                ].map(tier => (
                  <div key={tier.title} className="flex gap-4">
                    <div className={`w-1 rounded-full flex-shrink-0 ${tier.color}`} />
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">{tier.title}</h4>
                      <ul className="space-y-1">
                        {tier.items.map((item, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── IMAGE STANDARDS ── */}
        {activeSection === 'image_standards' && (
          <div className="space-y-6">
            <Card className="wizard-card border-0">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-slate-900 flex items-center gap-2"><Image className="w-5 h-5 text-pink-500" />Image & Visual Asset Standards</CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-8">
                <p className="text-slate-600">All images across the BrandForge platform must meet these professional standards before being considered market-ready. The <strong>Graphic Artist AI Agent</strong> enforces these standards on every image it inspects.</p>

                {[
                  {
                    title: 'Logo Requirements',
                    icon: Star,
                    color: 'text-amber-500',
                    rules: [
                      { rule: 'True transparent background (alpha channel)', level: 'CRITICAL', note: 'Never a white fill or colored background' },
                      { rule: 'Available in SVG (master), PNG (multi-res), PDF (print)', level: 'HIGH', note: 'Minimum PNG sizes: 64px, 256px, 512px, 1024px' },
                      { rule: 'Minimum clear space equal to logo height on all sides', level: 'HIGH', note: 'No elements within the clear space zone' },
                      { rule: 'Brand colors match exact hex specifications', level: 'HIGH', note: 'No approximations or off-brand color shades' },
                      { rule: 'No distortion, stretching, rotation, or effects', level: 'CRITICAL', note: 'Use original proportions always' },
                      { rule: 'Readable on both dark (slate-900) and light (white) backgrounds', level: 'HIGH', note: 'Provide both versions if needed' },
                    ]
                  },
                  {
                    title: 'Hero Image Requirements',
                    icon: Layout,
                    color: 'text-violet-500',
                    rules: [
                      { rule: 'Minimum 1400×900px, ideally 1920×1080px', level: 'HIGH', note: 'Never stretch a small image to fill the hero' },
                      { rule: 'Subject occupies primary third of frame (rule of thirds)', level: 'MEDIUM', note: 'Avoid centered compositions that feel static' },
                      { rule: 'Sufficient dark/neutral area for text overlay', level: 'HIGH', note: 'White text must have 4.5:1 contrast minimum' },
                      { rule: 'Professional quality — no stock photo clichés', level: 'HIGH', note: 'Aspirational but authentic; target audience: entrepreneurs 25-50' },
                      { rule: 'Color palette harmonizes with brand theme (amber/slate)', level: 'MEDIUM', note: 'Clashing colors reduce brand cohesion' },
                    ]
                  },
                  {
                    title: 'General Image Standards',
                    icon: Eye,
                    color: 'text-blue-500',
                    rules: [
                      { rule: 'Minimum 72 DPI for web, 300 DPI for print/PDF', level: 'HIGH', note: 'Pixelated images are rejected immediately' },
                      { rule: 'Consistent photographic style across the platform', level: 'MEDIUM', note: 'Natural lighting, professional settings, diverse subjects' },
                      { rule: 'No watermarks, copyright violations, or demo content', level: 'CRITICAL', note: 'All images must be properly licensed or AI-generated' },
                      { rule: 'Cropping removes all unnecessary elements', level: 'MEDIUM', note: 'Tight, intentional crops — no accidental edge artifacts' },
                    ]
                  },
                ].map(section => (
                  <div key={section.title}>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                      <section.icon className={`w-5 h-5 ${section.color}`} />{section.title}
                    </h3>
                    <div className="space-y-2">
                      {section.rules.map((r, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <Badge className={r.level === 'CRITICAL' ? 'bg-red-100 text-red-700 flex-shrink-0 text-[10px]' : r.level === 'HIGH' ? 'bg-orange-100 text-orange-700 flex-shrink-0 text-[10px]' : 'bg-slate-100 text-slate-600 flex-shrink-0 text-[10px]'}>
                            {r.level}
                          </Badge>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{r.rule}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{r.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── BRAND RULES ── */}
        {activeSection === 'brand_rules' && (
          <div className="space-y-6">
            <Card className="wizard-card border-0">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-slate-900 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-violet-500" />Brand Standards & Design System Rules</CardTitle>
              </CardHeader>
              <CardContent className="pt-5 space-y-8">
                {[
                  {
                    title: 'Color System',
                    items: [
                      { label: 'Primary CTA (dark surfaces)', value: 'amber-500 → orange-500 gradient', code: '#f59e0b → #f97316' },
                      { label: 'Feature / Wizard accent', value: 'violet-600 → indigo-600 gradient', code: '#7c3aed → #4f46e5' },
                      { label: 'Page background (dark)', value: 'slate-900', code: '#0f172a' },
                      { label: 'Card background (dark)', value: 'slate-800 / slate-800/60', code: '#1e293b' },
                      { label: 'Body text on dark', value: 'slate-300 / slate-400', code: '#cbd5e1 / #94a3b8' },
                      { label: 'Wizard card (light)', value: 'bg-white', code: '#ffffff' },
                      { label: 'NEVER use', value: 'bg-black, text-black, #000000', code: 'Use slate-900 instead' },
                    ]
                  },
                  {
                    title: 'Typography',
                    items: [
                      { label: 'Primary Font', value: 'Inter', code: 'Google Fonts CDN' },
                      { label: 'Heading 1', value: 'text-3xl md:text-4xl font-bold tracking-tight', code: 'letter-spacing: -0.025em' },
                      { label: 'Heading 2', value: 'text-2xl font-bold', code: '' },
                      { label: 'Heading 3', value: 'text-xl font-semibold', code: '' },
                      { label: 'Body / Description', value: 'text-sm text-slate-400 leading-relaxed', code: 'line-height: 1.7' },
                      { label: 'NEVER use', value: 'Stretch, distort, or outline fonts', code: 'Approved weights only' },
                    ]
                  },
                  {
                    title: 'Component Standards',
                    items: [
                      { label: 'Dark page cards', value: 'rounded-xl border border-slate-700/50 bg-slate-800/60 backdrop-blur-sm', code: '' },
                      { label: 'Light wizard cards', value: 'wizard-card class → bg-white rounded-xl border-0 shadow-xl', code: '' },
                      { label: 'Primary button', value: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white', code: '' },
                      { label: 'Feature button', value: 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white', code: '' },
                      { label: 'Section spacing', value: 'py-16 md:py-24', code: 'max-w-7xl mx-auto px-4' },
                      { label: 'Stat cards', value: 'Gradient backgrounds with white text', code: 'violet→indigo, amber→orange, emerald→teal' },
                    ]
                  },
                ].map(section => (
                  <div key={section.title}>
                    <h3 className="font-bold text-slate-800 mb-3">{section.title}</h3>
                    <div className="overflow-hidden rounded-xl border border-slate-200">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Element</th>
                            <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Value / Class</th>
                            <th className="text-left px-4 py-2 text-xs font-semibold text-slate-500">Note</th>
                          </tr>
                        </thead>
                        <tbody>
                          {section.items.map((item, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                              <td className="px-4 py-2.5 font-medium text-slate-700">{item.label}</td>
                              <td className="px-4 py-2.5 text-slate-600 font-mono text-xs">{item.value}</td>
                              <td className="px-4 py-2.5 text-slate-400 text-xs">{item.code}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}