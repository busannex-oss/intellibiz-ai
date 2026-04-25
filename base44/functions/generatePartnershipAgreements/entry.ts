import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role || !['admin', 'super_admin'].includes(user.role)) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { partnerInfo, platformName } = await req.json();

    if (!partnerInfo?.name) {
      return Response.json({ error: 'Partner name is required' }, { status: 400 });
    }

    // Generate Technology Integration Agreement
    const technologyPrompt = `Generate a professional Technology Integration Partner Agreement for ${platformName} Platform.

PARTNER: ${partnerInfo.name}
AGREEMENT DATE: ${partnerInfo.date}
TYPE: Technology Integration Partner (e.g., Twilio, ElevenLabs, Adwizar, or future integrations)

This agreement is between Business Annex (Provider) and ${partnerInfo.name} (Partner).

REQUIREMENTS:
- Integration scope and technical specifications
- API access and usage limitations (rate limits, concurrent connections, data volume)
- Data sharing boundaries and handling (customer data, logs, analytics)
- Revenue sharing if applicable (typical 15-30% for integration partners)
- Co-marketing rights and brand usage guidelines
- Support and maintenance obligations (SLA, response times, documentation)
- Uptime and performance standards (99.5% minimum availability)
- IP ownership: Partner retains IP for their platform, Business Annex retains integration layer
- Termination clause: 30-day notice, API access removal, data handoff procedures
- Incident response and escalation procedures
- Compliance with data protection regulations
- Insurance and liability requirements

Generate a complete, professional technology integration agreement covering all points above.`;

    const technologyAgreement = await base44.integrations.Core.InvokeLLM({
      prompt: technologyPrompt,
      model: 'claude_opus_4_6'
    });

    // Generate Referral Partner Agreement
    const referralPrompt = `Generate a professional Referral Partner Agreement for ${platformName} Platform.

PARTNER: ${partnerInfo.name}
AGREEMENT DATE: ${partnerInfo.date}
TYPE: Referral Partner (individuals and organizations referring clients)

This agreement is between Business Annex (Provider) and ${partnerInfo.name} (Partner).

REQUIREMENTS:
- Referral definition: what constitutes a qualified referral (first-time client, conversion criteria)
- Commission structure: percentage or flat fee per referral (typical 15-30% for first-year revenue)
- Payment terms: net 30 after client payment, monthly reporting
- Referral tracking: unique referral codes or links, attribution window (90 days)
- Marketing material usage rights: pre-approved logos, copy, landing pages
- Brand representation standards: prohibition on misleading claims or unauthorized partnerships
- Prohibited referral practices: no false testimonials, no payment for referrals to other services, no spam
- Reporting requirements: monthly referral reports, client status updates
- Payment schedule: monthly invoicing and payments
- Termination: either party can terminate with 15 days notice
- Commission holdback: withholding commissions for chargebacks or refunds
- Confidentiality: protect referral data and client information
- Compliance: referral must comply with all applicable laws

Generate a complete, professional referral partner agreement covering all points above.`;

    const referralAgreement = await base44.integrations.Core.InvokeLLM({
      prompt: referralPrompt,
      model: 'claude_opus_4_6'
    });

    // Generate Strategic Alliance Agreement
    const strategicPrompt = `Generate a professional Strategic Alliance Agreement for ${platformName} Platform.

PARTNER: ${partnerInfo.name}
AGREEMENT DATE: ${partnerInfo.date}
TYPE: Strategic Alliance Partner (co-building or co-marketing)

This agreement is between Business Annex (Partner A) and ${partnerInfo.name} (Partner B).

REQUIREMENTS:
- Alliance scope and objectives: joint goals, deliverables, timeline
- Joint deliverable ownership: who owns what IP, joint ownership model if applicable
- Revenue sharing structure: percentage split of joint revenue (typical 50/50 for equal partners)
- Decision-making authority: governance structure, approval processes, escalation
- Exclusivity provisions: whether partners can work with competitors (if any)
- Co-marketing rights and obligations: joint campaigns, budget allocation, brand usage
- Confidentiality obligations: protection of confidential information, non-disclosure terms
- Performance milestones: specific targets, reporting requirements, performance metrics
- Resource commitment: staffing, budget allocation, support obligations
- Term: start date, duration (typically 1-3 years), renewal options
- Termination: termination conditions, notice periods, asset division, data return
- Liability and insurance requirements
- Dispute resolution procedures
- Governing law and jurisdiction

Generate a complete, professional strategic alliance agreement covering all points above.`;

    const strategicAgreement = await base44.integrations.Core.InvokeLLM({
      prompt: strategicPrompt,
      model: 'claude_opus_4_6'
    });

    return Response.json({
      technology_integration: technologyAgreement,
      referral: referralAgreement,
      strategic_alliance: strategicAgreement
    });
  } catch (error) {
    console.error('Error generating agreements:', error);
    return Response.json(
      { error: error.message || 'Failed to generate agreements' },
      { status: 500 }
    );
  }
});