import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const APP_PAGES = [
  { name: 'Home', description: 'Main landing page with hero, features, process, and CTA sections. Dark slate-900 theme with amber/orange primary accents.' },
  { name: 'Dashboard', description: 'User project management page. Shows project cards, stats, and quick actions.' },
  { name: 'CreateBusiness', description: 'Multi-step business creation wizard with white card backgrounds on dark page.' },
  { name: 'Onboarding', description: 'New user onboarding flow collecting business info.' },
  { name: 'WhiteLabel', description: 'Subscription/white label plans and pricing page.' },
  { name: 'AdminDashboard', description: 'Admin CMS with slate-50 light background. Tabs for Users, Hero, Theme, Permissions, SEO, Social.' },
  { name: 'KnowledgeBase', description: 'Help articles page.' },
  { name: 'Services', description: 'Services listing page.' },
  { name: 'Analytics', description: 'Analytics dashboard with charts and metrics.' },
  { name: 'AccountSettings', description: 'User profile and account settings page.' },
];

const BRAND_RULES = `
PLATFORM: BrandForge — AI-powered business builder for entrepreneurs and small business owners.
TARGET AUDIENCE: Aspiring entrepreneurs, small business owners (ages 25-50), non-technical, growth-focused, want professional results fast.
DESIGN SYSTEM:
- Dark theme base: bg-slate-900/bg-slate-800 backgrounds
- Primary brand accent: amber-500/orange-500 gradient for all primary CTAs
- Feature/wizard accent: violet-600/indigo-600
- Typography: Inter font, tight letter-spacing (-0.025em headings), bold weights
- Cards: rounded-xl, subtle borders, backdrop-blur on dark surfaces
- White wizard cards on dark pages for content forms
- No pure black (#000), no harsh white-on-black contrast
- Responsive: mobile-first with md: and lg: breakpoints
- All navigation: dark sticky top bar
- Footer: dark, with social icons and 4-column links
TONE: Professional, confident, aspirational, approachable — NOT corporate, NOT generic SaaS
`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Allow both authenticated manual triggers and scheduled (service role) runs
    let triggeredBy = 'scheduled';
    let isAuthorized = false;

    // Check if there's a user auth
    try {
      const user = await base44.auth.me();
      if (user?.role === 'admin' || user?.role === 'super_admin') {
        isAuthorized = true;
        triggeredBy = 'manual';
      }
    } catch (_) {
      // No user auth — must be scheduled
    }

    // Also allow service role calls (from automation)
    const authHeader = req.headers.get('authorization') || '';
    if (!isAuthorized && authHeader) {
      isAuthorized = true; // Scheduled automation uses service role
    }

    if (!isAuthorized) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date().toISOString().split('T')[0];

    // Check if audit already ran today
    const existing = await base44.asServiceRole.entities.BrandAuditLog.filter({ audit_date: today });
    if (existing?.length > 0 && triggeredBy === 'scheduled') {
      return Response.json({ message: 'Audit already ran today', audit_id: existing[0].id });
    }

    // Get current AppSettings for context
    const settings = await base44.asServiceRole.entities.AppSettings.list();
    const appConfig = settings?.[0] || {};

    const prompt = `You are a professional brand auditor and UX consultant specializing in SaaS and AI startup platforms.

PLATFORM OVERVIEW:
${BRAND_RULES}

CURRENT APP CONFIGURATION:
- Site Name: ${appConfig.site_name || 'BrandForge'}
- Color Theme: ${appConfig.color_theme || 'amber'}
- Has custom logo: ${appConfig.logo_url ? 'YES' : 'NO — using default icon'}
- Hero headline: "${appConfig.hero?.headline || 'Build a Brand That Outperforms Competitors'}"
- Hero subheadline: "${appConfig.hero?.subheadline || 'AI-powered market research...'}"
- Social media configured: ${Object.values(appConfig.social_media || {}).filter(Boolean).length} platforms
- SEO meta title: "${appConfig.seo?.meta_title || 'NOT SET'}"
- Footer copyright: "${appConfig.footer_content?.copyright_text || 'NOT SET'}"

PAGES IN APP:
${APP_PAGES.map(p => `- ${p.name}: ${p.description}`).join('\n')}

AUDIT INSTRUCTIONS:
Perform a comprehensive daily brand audit covering these 8 categories. For EACH issue found, be specific about which page or component has the problem and give an actionable recommendation.

Categories to audit:
1. BRANDING — Logo presence, brand name consistency, favicon, brand personality match
2. COLOR_THEME — Color consistency, correct use of amber/violet accents, no off-brand colors
3. TYPOGRAPHY — Font consistency, heading hierarchy, letter-spacing, readability
4. CONTENT — Copy quality, tone, audience alignment, placeholder text, missing content
5. CONSISTENCY — Design system adherence across all pages (dark theme, card styles, button styles)
6. PROFESSIONALISM — Market-ready polish, missing states (loading/empty/error), visual quality
7. AUDIENCE_ALIGNMENT — Does the design/copy speak to entrepreneurs aged 25-50? Is it aspirational without being confusing?
8. UX — Navigation clarity, CTA placement, mobile responsiveness, user flow logic

For each issue provide:
- category (one of the 8 above, lowercase with underscore)
- severity: critical (blocks launch), high (significant problem), medium (polish issue), low (minor)
- page_or_component: which page or component has this issue
- title: short issue title (max 8 words)
- description: what exactly is wrong (2-3 sentences)
- recommendation: specific actionable fix (1-2 sentences)

Also provide:
- overall_score: 0-100 market readiness score
- category_scores: object with score 0-100 for each of the 8 categories
- summary: 2-3 sentence executive summary of the audit findings and top priorities
- status: "not_ready" (<40), "needs_work" (40-69), "almost_ready" (70-89), "market_ready" (90+)

Return valid JSON only.`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          overall_score: { type: 'number' },
          status: { type: 'string' },
          summary: { type: 'string' },
          category_scores: { type: 'object' },
          issues: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                category: { type: 'string' },
                severity: { type: 'string' },
                page_or_component: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string' },
                recommendation: { type: 'string' },
                resolved: { type: 'boolean' }
              }
            }
          }
        }
      }
    });

    // Add unique IDs to issues if missing
    const issues = (result.issues || []).map((issue, i) => ({
      ...issue,
      id: issue.id || `${today}-${i}`,
      resolved: false
    }));

    const auditRecord = {
      audit_date: today,
      overall_score: result.overall_score || 50,
      status: result.status || 'needs_work',
      summary: result.summary || 'Audit complete.',
      category_scores: result.category_scores || {},
      issues,
      triggered_by: triggeredBy
    };

    const created = await base44.asServiceRole.entities.BrandAuditLog.create(auditRecord);

    return Response.json({ success: true, audit_id: created.id, score: auditRecord.overall_score, issues_count: issues.length });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});