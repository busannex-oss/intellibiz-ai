import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const PLATFORM_NAME = 'BrandForge';
const PLATFORM_DESC = 'An AI-powered omni-channel business building platform that helps entrepreneurs launch and grow their businesses through AI-driven brand strategy, business planning, logo creation, social media, website generation, omnichannel communication, and white label licensing.';

const PROMPTS = {
  mission_statement: ({ tagline, values, audience }) => `
Write a compelling, authentic Mission Statement for ${PLATFORM_NAME}.
Platform Description: ${PLATFORM_DESC}
Core Tagline: ${tagline || 'Build. Launch. Grow.'}
Core Values: ${values || 'Innovation, Accessibility, Empowerment, Integrity'}
Target Audience: ${audience || 'Entrepreneurs, startups, and small business owners'}

Requirements:
- 2–4 impactful paragraphs
- Lead with WHY we exist, not what we do
- Include the core mission sentence (1 sentence, bold/memorable)
- Describe who we serve and the transformation we enable
- Close with our vision for the future
- Tone: Inspiring, bold, human, forward-thinking
Format as clean prose (no headers/bullets).`,

  white_paper: ({ focus }) => `
Write a comprehensive White Paper for ${PLATFORM_NAME}.
Platform Description: ${PLATFORM_DESC}
Focus Area: ${focus || 'The Future of AI-Powered Business Building'}

Structure:
1. Executive Summary (2 paragraphs)
2. The Problem: Barriers to Entrepreneurship (2–3 paragraphs)
3. The Solution: How ${PLATFORM_NAME} Works (overview of all pillars)
4. Key Technology & AI Architecture (how AI agents collaborate)
5. Market Opportunity & Competitive Landscape
6. The 8 Business Building Pillars (brief description of each)
7. Case Studies / Use Cases (3 hypothetical but realistic examples)
8. Business Model & Pricing Philosophy
9. Future Roadmap & Vision
10. Conclusion & Call to Action

Tone: Professional, authoritative, data-informed, forward-thinking.
Length: Detailed and thorough. Each section should be substantive.`,

  brand_style_guide: ({ colors, fonts, personality }) => `
Create a comprehensive Brand Style Guide document for ${PLATFORM_NAME}.
Platform Description: ${PLATFORM_DESC}
Primary Brand Colors: ${colors || 'Amber (#F59E0B), Orange (#F97316), Slate Dark (#0F172A), Slate Mid (#1E293B), White (#FFFFFF)'}
Typography: ${fonts || 'Inter (primary), system-ui fallback. Weights: 300, 400, 500, 600, 700, 800, 900'}
Brand Personality: ${personality || 'Bold, Modern, Trustworthy, Innovative, Empowering'}

Required Sections:
1. Brand Overview & Mission
2. Logo Usage Guidelines (primary, secondary, monochrome, clear space, minimum sizes, forbidden uses)
3. Color Palette (primary, secondary, accent, neutral, semantic colors — with hex codes and usage rules)
4. Typography System (headings scale, body text, UI labels, letter-spacing, line-height guidelines)
5. Imagery & Photography Style (mood, subject matter, composition rules, what to avoid)
6. Iconography Standards (style, size, usage context)
7. Voice & Tone Guidelines (personality traits, do/don't examples, tone by context)
8. UI Component Standards (buttons, cards, badges, form inputs — color and radius conventions)
9. Digital Application Examples (website, email, social media)
10. Brand Don'ts (common misuses to avoid)

Tone: Clear, prescriptive, professional. Write as if this will be handed to a design or marketing team.`,

  privacy_policy: ({ company, contact_email, effective_date }) => `
Generate a comprehensive Privacy Policy and Terms of Service document for ${PLATFORM_NAME}.
Company Legal Name: ${company || 'Business Annex LLC'}
Contact Email: ${contact_email || 'legal@brandforge.ai'}
Effective Date: ${effective_date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
Platform Type: AI-powered SaaS business building platform
Jurisdiction: State of Delaware, USA

PRIVACY POLICY sections required:
1. Information We Collect (account data, business data, usage data, AI-generated outputs, payment info)
2. How We Use Your Information
3. AI & Data Processing (how user data trains/improves AI — opt-in/opt-out)
4. Data Sharing & Third Parties (Stripe, OpenAI, Anthropic, Twilio, Resend — named)
5. Data Retention
6. User Rights (GDPR, CCPA)
7. Cookies & Tracking
8. Security Measures
9. Children's Privacy (13+)
10. Changes to This Policy
11. Contact Us

TERMS OF SERVICE sections required:
1. Acceptance of Terms
2. Platform License & Permitted Use
3. Account Registration & Security
4. Subscription, Billing & Refunds
5. AI-Generated Content (ownership: user owns outputs, platform owns models/algorithms)
6. White Label Terms
7. Intellectual Property
8. Prohibited Uses
9. Disclaimers & Limitation of Liability
10. Indemnification
11. Termination
12. Governing Law & Dispute Resolution
13. Contact Information

Write in plain, clear legal language. Be thorough and complete.`,

  service_agreement: ({ client_name, tier, date }) => {
    const tiers = {
      standard: 'Standard Client (Direct Platform Access)',
      whitelabel: 'White Label Licensee (License to Resell)',
      enterprise: 'Enterprise (Custom Deployment)'
    };
    const tierDesc = tiers[tier] || tiers.standard;
    return `Generate a professional Service Agreement for ${PLATFORM_NAME}.
CLIENT: ${client_name || '[Client Name]'}
AGREEMENT DATE: ${date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
TIER: ${tierDesc}

Platform Services: AI brand building, business plan generation, logo creation, social media assets, omnichannel communication, AI receptionist, newsletter management, website generation, white label licensing.

Include:
- Parties and recitals
- Scope of services specific to ${tierDesc}
- Deliverables and timelines
- Payment terms and billing cycle
- Intellectual property ownership (client owns outputs, platform retains algorithms)
- Client responsibilities
- Confidentiality
- Limitation of liability
- Termination conditions
- Governing law: Delaware, USA
- Signature block

${tier === 'whitelabel' ? 'Add: revenue share terms, sub-licensing restrictions, brand usage guidelines, minimum MRR commitments.' : ''}
${tier === 'enterprise' ? 'Add: SLA with 99.9% uptime, dedicated infrastructure, custom AI agent development, enterprise security obligations, quarterly reviews.' : ''}

Write as a complete, ready-to-sign legal document.`;
  }
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { doc_type, inputs } = await req.json();

    if (!doc_type || !PROMPTS[doc_type]) {
      return Response.json({ error: 'Invalid doc_type' }, { status: 400 });
    }

    const promptFn = PROMPTS[doc_type];
    const prompt = promptFn(inputs || {});

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      model: 'claude_sonnet_4_6'
    });

    return Response.json({ content: result, doc_type });
  } catch (error) {
    console.error('generatePlatformDocs error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});