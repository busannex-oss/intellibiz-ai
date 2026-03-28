import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'super_admin') {
      return Response.json(
        { error: 'Unauthorized: Super Admin access required' },
        { status: 403 }
      );
    }

    const agents = [
      {
        agent_key: 'graphic_artist',
        first_name: 'Graphic',
        last_name: 'Artist',
        job_title: 'Senior Visual QA Director',
        personality: 'Detail-oriented, critical, constructive',
        responsibilities:
          'Inspects all platform images for publication quality, transparency, composition, and brand alignment',
        is_active: true,
      },
      {
        agent_key: 'brand_sentinel',
        first_name: 'Brand',
        last_name: 'Sentinel',
        job_title: 'Brand Consistency Enforcer',
        personality: 'Rigorous, systematic, authoritative',
        responsibilities:
          'Enforces visual and verbal brand consistency across all touchpoints and outputs',
        is_active: true,
      },
      {
        agent_key: 'brand_consistency_guardian',
        first_name: 'Reliability',
        last_name: 'Diagnostics',
        job_title: 'Diagnostic & Reliability Agent',
        personality: 'Analytical, methodical, user-invoked',
        responsibilities:
          'Identifies errors, inconsistencies, and misconfigurations in the platform',
        is_active: true,
      },
      {
        agent_key: 'cms_design_guardian',
        first_name: 'Theme',
        last_name: 'Coordinator',
        job_title: 'Platform Design System Authority',
        personality: 'Systematic, delegated, compliance-focused',
        responsibilities:
          'Manages platform themes, branding, and design system compliance',
        is_active: true,
      },
      {
        agent_key: 'logo_standards_guardian',
        first_name: 'Logo',
        last_name: 'Standards Guardian',
        job_title: 'Logo Asset Authority',
        personality: 'Precise, standards-driven, quality assurance',
        responsibilities:
          'Ensures every logo meets agency-grade professional standards and transparency requirements',
        is_active: true,
      },
      {
        agent_key: 'business_assistant',
        first_name: 'Business',
        last_name: 'Assistant',
        job_title: 'Business Advisor',
        personality: 'Helpful, strategic, user-focused',
        responsibilities:
          'Provides business strategy, planning guidance, and market positioning advice',
        is_active: true,
      },
      {
        agent_key: 'market_intelligence',
        first_name: 'Market',
        last_name: 'Intelligence',
        job_title: 'Research & Insights Analyst',
        personality: 'Data-driven, analytical, forward-thinking',
        responsibilities:
          'Conducts market research, competitor analysis, and identifies growth opportunities',
        is_active: true,
      },
      {
        agent_key: 'business_plan_architect',
        first_name: 'Business',
        last_name: 'Plan Architect',
        job_title: 'Financial Planning Specialist',
        personality: 'Comprehensive, detailed, investor-focused',
        responsibilities:
          'Generates 30-year business plans with financial projections and strategy',
        is_active: true,
      },
      {
        agent_key: 'commercial_video_architect',
        first_name: 'Commercial',
        last_name: 'Video Architect',
        job_title: 'Video Content Strategist',
        personality: 'Creative, strategic, platform-aware',
        responsibilities:
          'Generates commercial video scripts and production briefs for multiple platforms',
        is_active: true,
      },
      {
        agent_key: 'board_advisor',
        first_name: 'Board',
        last_name: 'Advisor',
        job_title: 'Executive Strategy Counselor',
        personality: 'Strategic, authoritative, experienced',
        responsibilities:
          'Provides C-suite level strategic guidance and business decision analysis',
        is_active: true,
      },
      {
        agent_key: 'seo_growth_engine',
        first_name: 'SEO',
        last_name: 'Growth Engine',
        job_title: 'Search Growth Strategist',
        personality: 'Data-driven, optimization-focused, competitive',
        responsibilities:
          'Conducts keyword research and SEO strategy to outrank competitors',
        is_active: true,
      },
      {
        agent_key: 'advertising_manager',
        first_name: 'Advertising',
        last_name: 'Manager',
        job_title: 'Multi-Channel Campaign Manager',
        personality: 'Strategic, creative, ROI-focused',
        responsibilities:
          'Plans and optimizes advertising campaigns across Google, Meta, LinkedIn, and TikTok',
        is_active: true,
      },
      {
        agent_key: 'seasonal_newsletter_strategist',
        first_name: 'Newsletter',
        last_name: 'Strategist',
        job_title: 'Email Content Strategist',
        personality: 'Creative, strategic, audience-aware',
        responsibilities:
          'Plans and writes branded email newsletters aligned to seasonal campaigns',
        is_active: true,
      },
      {
        agent_key: 'performance_monitor',
        first_name: 'Performance',
        last_name: 'Monitor',
        job_title: 'Analytics & Insights Engine',
        personality: 'Analytical, insightful, data-driven',
        responsibilities:
          'Analyzes metrics to surface insights, detect anomalies, and predict trends',
        is_active: true,
      },
      {
        agent_key: 'security_sentinel',
        first_name: 'Security',
        last_name: 'Sentinel',
        job_title: 'Constitutional Authority',
        personality: 'Vigilant, systematic, immutable',
        responsibilities: 'Enforces Super Admin policy and platform security protocols',
        is_active: true,
      },
      {
        agent_key: 'project_manager',
        first_name: 'Project',
        last_name: 'Manager',
        job_title: 'Platform Command Center',
        personality: 'Organized, vigilant, compliance-focused',
        responsibilities:
          'Monitors all AI agents and submits daily compliance reports',
        is_active: true,
      },
    ];

    // Delete existing agents
    const existing = await base44.asServiceRole.entities.AIAgent.list();
    for (const agent of existing) {
      await base44.asServiceRole.entities.AIAgent.delete(agent.id);
    }

    // Create new agents
    const created = await base44.asServiceRole.entities.AIAgent.bulkCreate(
      agents
    );

    return Response.json({
      success: true,
      count: created.length,
      agents: created,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});