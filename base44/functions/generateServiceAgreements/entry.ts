import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role || !['admin', 'super_admin'].includes(user.role)) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { clientInfo, platformName } = await req.json();

    if (!clientInfo?.name) {
      return Response.json({ error: 'Client name is required' }, { status: 400 });
    }

    const servicesList = `
- AI brand building (market research, competitive analysis, UVP development, brand strategy)
- Business plan generation (comprehensive 30-year financial projections, market analysis)
- Logo creation (AI-generated, editable, transparent backgrounds, multiple formats)
- Social media assets (platform-optimized headers and profile images)
- Omnichannel communication infrastructure (unified inbox, routing, automation)
- AI receptionist deployment (voice, call handling, transcription, routing)
- Newsletter management (template design, subscriber management, campaign automation)
- Website generation (responsive, SEO-optimized, fully customizable)
- White label licensing (resell platform under your brand)`.trim();

    // Generate Standard Client Agreement
    const standardPrompt = `Generate a professional Service Agreement for ${platformName} Platform.

CLIENT: ${clientInfo.name}
AGREEMENT DATE: ${clientInfo.date}
TIER: Standard Client (Direct Platform Access)

This agreement is between Business Annex (Provider) and ${clientInfo.name} (Client).

SERVICES OFFERED:
${servicesList}

REQUIREMENTS:
- Professional legal document format
- Comprehensive 7-step AI business building pipeline description
- Client owns all generated brand assets and deliverables
- Platform access terms and limitations (account, concurrent users, storage)
- Monthly/annual subscription payment terms
- Revision and regeneration policy (unlimited iterations per service)
- Delivery timeline: Market Research (3 days), Business Plan (5 days), Logo (2 days), Assets (3 days), Infrastructure (7 days), Receptionist (3 days), Newsletter (2 days), Website (5 days)
- Client responsibilities: accurate business information, timely feedback, compliance with platform terms
- Intellectual property: Client owns deliverables, Platform retains IP for algorithms and tools
- Confidentiality: Both parties must protect confidential information
- Limitation of liability for AI-generated content (no guarantees on market performance)
- Dispute resolution through mediation
- Termination conditions: 30-day notice, account suspension for non-payment
- Governing law: State of Delaware, USA

Generate a complete, professional service agreement covering all points above.`;

    const standardAgreement = await base44.integrations.Core.InvokeLLM({
      prompt: standardPrompt,
      model: 'claude_opus_4_6'
    });

    // Generate White Label Agreement
    const whitelabelPrompt = `Generate a professional White Label Service Agreement for ${platformName} Platform.

CLIENT: ${clientInfo.name}
AGREEMENT DATE: ${clientInfo.date}
TIER: White Label Licensee (License to Resell)

This agreement is between Business Annex (Licensor) and ${clientInfo.name} (Licensee).

SERVICES OFFERED:
${servicesList}

REQUIREMENTS:
- White label licensing of Business Annex platform
- Licensee can rebrand platform UI, domain, email, but must maintain core algorithms
- Service delivery standards: 99.5% uptime, <30s response times, 24/7 support availability
- Client data ownership: All licensee client data owned by licensee, not by Business Annex
- AI Receptionist deployment obligations on licensed platform
- Pillar alignment and performance standards (conversion rates, retention metrics)
- Monthly revenue reporting requirements and revenue share terms (typically 70/30 split)
- Support tier: Dedicated account manager, priority escalation, quarterly reviews
- No sub-licensing or resale of IP to third parties
- IP boundaries: Licensee owns client deliverables, Business Annex retains platform algorithms
- Termination: 60-day notice, data export within 30 days, platform access removal
- Post-termination: Client data returned within 30 days, platform removed from licensee infrastructure
- Minimum user commitments and MRR targets
- Exclusivity restrictions if applicable
- Custom pricing and payment structure

Generate a complete, professional white label license agreement covering all points above.`;

    const whitelabelAgreement = await base44.integrations.Core.InvokeLLM({
      prompt: whitelabelPrompt,
      model: 'claude_opus_4_6'
    });

    // Generate Enterprise Agreement
    const enterprisePrompt = `Generate a professional Enterprise Service Agreement for ${platformName} Platform.

CLIENT: ${clientInfo.name}
AGREEMENT DATE: ${clientInfo.date}
TIER: Enterprise (Custom Deployment)

This agreement is between Business Annex (Provider) and ${clientInfo.name} (Enterprise Client).

SERVICES OFFERED:
${servicesList}

REQUIREMENTS:
- Custom scope of work definition and SOW addendum
- Dedicated infrastructure provisions (private cloud, isolated databases, custom domains)
- Custom AI agent development terms (brand personality, custom training, proprietary models)
- Service Level Agreement (SLA) with 99.9% uptime guarantee, 1-hour response times
- Enterprise data security obligations (encryption, SOC 2 compliance, annual audits)
- Custom integration development terms (API access, webhook support, third-party integrations)
- Dedicated support arrangements (24/7/365 support, dedicated success team, executive access)
- Custom pricing structure with volume discounts and long-term commitments
- Exclusivity terms if applicable (non-compete, geographic exclusivity)
- Executive escalation contacts and governance committees
- Custom contract terms for large organizations
- Enhanced security and compliance certifications
- Quarterly business reviews and performance metrics
- Custom training and onboarding programs
- Flexible payment terms and billing arrangements

Generate a complete, professional enterprise service agreement covering all points above with flexibility for custom terms.`;

    const enterpriseAgreement = await base44.integrations.Core.InvokeLLM({
      prompt: enterprisePrompt,
      model: 'claude_opus_4_6'
    });

    return Response.json({
      standard: standardAgreement,
      whitelabel: whitelabelAgreement,
      enterprise: enterpriseAgreement
    });
  } catch (error) {
    console.error('Error generating agreements:', error);
    return Response.json(
      { error: error.message || 'Failed to generate agreements' },
      { status: 500 }
    );
  }
});