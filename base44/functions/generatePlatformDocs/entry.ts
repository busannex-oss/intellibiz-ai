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
Write a focused White Paper for ${PLATFORM_NAME}.
Platform Description: ${PLATFORM_DESC}
Focus Area: ${focus || 'The Future of AI-Powered Business Building'}

Structure (keep each section concise but substantive):
1. Executive Summary
2. The Problem: Barriers to Entrepreneurship
3. The Solution: How ${PLATFORM_NAME} Works
4. Key Technology & AI Architecture
5. Market Opportunity
6. The 8 Business Building Pillars
7. Use Cases (2 examples)
8. Business Model
9. Future Roadmap
10. Conclusion & Call to Action

Tone: Professional, authoritative, forward-thinking.`,

  brand_style_guide: ({ colors, fonts, personality }) => `
Create a Brand Style Guide for ${PLATFORM_NAME}.
Platform Description: ${PLATFORM_DESC}
Primary Brand Colors: ${colors || 'Amber (#F59E0B), Orange (#F97316), Slate Dark (#0F172A), Slate Mid (#1E293B), White (#FFFFFF)'}
Typography: ${fonts || 'Inter (primary), system-ui fallback. Weights: 300–900'}
Brand Personality: ${personality || 'Bold, Modern, Trustworthy, Innovative, Empowering'}

Sections:
1. Brand Overview
2. Logo Usage Guidelines
3. Color Palette (with hex codes and usage rules)
4. Typography System
5. Voice & Tone Guidelines (with do/don't examples)
6. UI Component Standards
7. Brand Don'ts

Tone: Clear, prescriptive, professional — as if handed to a design team.`,

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
      model: 'gpt_5_mini'
    });

    return Response.json({ content: result, doc_type });
  } catch (error) {
    console.error('generatePlatformDocs error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});