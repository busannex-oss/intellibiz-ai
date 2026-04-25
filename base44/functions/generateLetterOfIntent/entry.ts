import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role || !['admin', 'super_admin'].includes(user.role)) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { partyInfo, platformName } = await req.json();

    if (!partyInfo?.partyName) {
      return Response.json({ error: 'Party name is required' }, { status: 400 });
    }

    // Generate Investor LOI
    const investorPrompt = `Generate a professional Letter of Intent for an investment discussion.

PARTIES:
- Business Annex (Company)
- ${partyInfo.partyName} (Prospective Investor)

PROPOSED INVESTMENT: ${partyInfo.amount || 'To be determined'}
LOI DATE: ${partyInfo.date}

This Letter of Intent outlines the proposed investment terms and conditions for discussion.

REQUIRED SECTIONS:
- Opening/Introduction: Purpose of this LOI
- Investment Amount and Structure: ${partyInfo.amount} in equity/debt structure
- Proposed Equity or Debt Terms: percentage stake, dividend rights, preference shares if applicable
- Use of Funds Summary: how investment will be used (product development, marketing, operations, hiring)
- Due Diligence Timeline: expected timeline for financial, legal, and operational reviews (30-60 days)
- Exclusivity Period: exclusive negotiation period (30-45 days), investor cannot solicit competing investments
- Conditions to Closing: conditions that must be met before finalization (satisfactory due diligence, board approval, etc.)
- Non-Binding Disclaimer: clear statement that this LOI is non-binding except for confidentiality and exclusivity
- Governing Law: State of Delaware
- Signature blocks for both parties

Generate a professional, concise letter of intent covering all points above.`;

    const investorLOI = await base44.integrations.Core.InvokeLLM({
      prompt: investorPrompt,
      model: 'claude_opus_4_6'
    });

    // Generate White Label LOI
    const whitelabelPrompt = `Generate a professional Letter of Intent for white label licensing negotiations.

PARTIES:
- Business Annex (Platform Provider)
- ${partyInfo.partyName} (Prospective White Label Licensee)

PROPOSED TERMS: ${partyInfo.amount || 'To be determined'}
LOI DATE: ${partyInfo.date}

This Letter of Intent outlines the proposed white label licensing terms for discussion.

REQUIRED SECTIONS:
- Opening/Introduction: Purpose of this white label LOI
- Proposed Licensing Terms Summary: platform access, resale rights, white label capabilities
- Territory and Exclusivity Intent: geographic territory (exclusive or non-exclusive), market focus
- Fee Structure Outline: monthly licensing fees, revenue share percentage, setup costs
- Implementation Timeline: timeframe for platform deployment, training, go-live (typically 30-90 days)
- Due Diligence Requirements: financial verification, business plan review, market suitability assessment
- Support and Service Levels: technical support, uptime guarantees, training and documentation
- Exclusivity Period: exclusive negotiation period (45-60 days) for this licensing arrangement
- Non-Binding Disclaimer: clear statement that LOI is non-binding except for confidentiality
- Next Steps: expected timeline for full agreement execution
- Signature blocks for both parties

Generate a professional letter of intent covering all white label licensing points above.`;

    const whitelabelLOI = await base44.integrations.Core.InvokeLLM({
      prompt: whitelabelPrompt,
      model: 'claude_opus_4_6'
    });

    // Generate Acquisition/Strategic Partnership LOI
    const acquisitionPrompt = `Generate a professional Letter of Intent for an acquisition or strategic partnership discussion.

PARTIES:
- Business Annex (Target Company or Strategic Partner)
- ${partyInfo.partyName} (Prospective Acquirer or Strategic Partner)

PROPOSED TRANSACTION: ${partyInfo.amount || 'To be determined'}
LOI DATE: ${partyInfo.date}

This Letter of Intent outlines the proposed transaction structure for discussion.

REQUIRED SECTIONS:
- Opening/Introduction: Purpose of this transaction LOI
- Transaction Structure Summary: acquisition, merger, joint venture, or strategic partnership framework
- Proposed Valuation Framework: enterprise value, EBITDA multiples, comparable companies, earn-out provisions
- Key Terms and Conditions: purchase price, closing conditions, representations and warranties, indemnification
- Due Diligence Timeline and Scope: financial records, contracts, IP, compliance, customer data review (60-90 days)
- Exclusivity Period: exclusive negotiation window (60-90 days), party cannot solicit competing offers
- Confidentiality Obligations: protection of proprietary information, non-disclosure during discussions
- Governance and Transition: post-closing management, equity holders, employee considerations
- Termination Rights: conditions under which either party can terminate LOI
- Non-Binding Disclaimer: clear statement that LOI is non-binding except for confidentiality and exclusivity
- Next Steps and Timeline: path to definitive agreement, expected closing timeline
- Signature blocks for both parties

Generate a professional letter of intent covering all acquisition and strategic partnership points above.`;

    const acquisitionLOI = await base44.integrations.Core.InvokeLLM({
      prompt: acquisitionPrompt,
      model: 'claude_opus_4_6'
    });

    return Response.json({
      investor: investorLOI,
      whitelabel: whitelabelLOI,
      acquisition: acquisitionLOI
    });
  } catch (error) {
    console.error('Error generating LOIs:', error);
    return Response.json(
      { error: error.message || 'Failed to generate LOIs' },
      { status: 500 }
    );
  }
});