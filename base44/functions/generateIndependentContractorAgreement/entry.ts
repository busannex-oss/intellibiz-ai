import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role || !['admin', 'super_admin'].includes(user.role)) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { contractorInfo, platformName } = await req.json();

    if (!contractorInfo?.name) {
      return Response.json({ error: 'Contractor name is required' }, { status: 400 });
    }

    const workTypes = [
      'AI development (model training, algorithm optimization, prompt engineering)',
      'Platform building (frontend/backend development, database design, API development)',
      'Content creation (marketing content, technical documentation, copywriting)',
      'Brand strategy (brand positioning, market analysis, strategic recommendations)',
      'Integration development (third-party integrations, API implementations, webhooks)'
    ].join('\n');

    const prompt = `Generate a professional Independent Contractor Agreement for ${platformName} Platform.

CONTRACTOR: ${contractorInfo.name}
SCOPE OF WORK: ${contractorInfo.scope}
COMPENSATION: ${contractorInfo.compensation}
AGREEMENT DATE: ${contractorInfo.date}

This is a binding agreement between Business Annex (Client) and ${contractorInfo.name} (Contractor).

TYPES OF WORK:
${workTypes}

AGREEMENT REQUIREMENTS:
- Clear contractor classification statement (not an employee, no benefits, no withholding)
- Detailed scope of work and deliverables for ${contractorInfo.scope}
- Compensation structure: ${contractorInfo.compensation} with payment schedule
- Payment terms: Net 30 upon invoice, method of payment
- IP assignment: ALL work created, documents, code, designs, strategies owned by Business Annex
- Confidentiality and NDA: contractor must protect all confidential information
- Non-solicitation: contractor cannot solicit Business Annex clients or team members for 2 years post-termination
- Non-compete: contractor cannot compete with Business Annex services in same geographic area for 1 year
- Tools and equipment: contractor responsible for their own equipment, Business Annex provides access to necessary tools
- Quality standards: work must meet professional standards, revision policy up to 2 rounds per deliverable
- Term: start date and end date, or ongoing basis
- Termination: either party can terminate with 15 days written notice
- Indemnification: contractor indemnifies Business Annex from IP infringement claims
- Governing law: State of Delaware
- Dispute resolution: mediation before litigation
- Professional liability: contractor maintains professional insurance if applicable
- Signature blocks for both parties

Generate a complete, professional independent contractor agreement covering all points above.`;

    const agreement = await base44.integrations.Core.InvokeLLM({
      prompt,
      model: 'claude_opus_4_6'
    });

    return Response.json({ agreement });
  } catch (error) {
    console.error('Error generating agreement:', error);
    return Response.json(
      { error: error.message || 'Failed to generate agreement' },
      { status: 500 }
    );
  }
});