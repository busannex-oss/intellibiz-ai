import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role || !['admin', 'super_admin'].includes(user.role)) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { assignmentInfo, platformName } = await req.json();

    if (!assignmentInfo?.assignor) {
      return Response.json({ error: 'Assignor name is required' }, { status: 400 });
    }

    const ipTypeMap = {
      platform_code: 'platform code and software',
      ai_systems: 'AI systems, machine learning models, and algorithms',
      brand_assets: 'brand assets, logos, and visual identities',
      workflows: 'proprietary workflows and processes',
      agent_architecture: 'AI agent architectures and configurations',
      training_data: 'training data, datasets, and knowledge bases',
      system_prompts: 'system prompts, instructions, and guardrails',
      methodologies: 'business methodologies and frameworks',
      multiple: 'all platform code, AI systems, brand assets, workflows, agent architectures, training data, system prompts, and business methodologies'
    };

    const contextMap = {
      contractor_work: 'contractor creating work for Business Annex',
      co_development: 'co-development partner',
      acquisition: 'acquired entity or assets'
    };

    const prompt = `Generate a professional IP Assignment Agreement for ${platformName} Platform.

ASSIGNOR: ${assignmentInfo.assignor}
ASSIGNEE: ${platformName}
IP TYPES: ${ipTypeMap[assignmentInfo.ipTypes] || 'comprehensive platform IP'}
CONTEXT: ${contextMap[assignmentInfo.context] || 'contractor work'}
AGREEMENT DATE: ${assignmentInfo.date}

This agreement is between ${assignmentInfo.assignor} (Assignor) and ${platformName} (Assignee).

REQUIRED SECTIONS:
- Title and Introduction: IP Assignment Agreement
- Definitions: Clearly define "Assigned IP" to include all ${ipTypeMap[assignmentInfo.ipTypes] || 'platform IP'} created under this relationship
- Assignment of IP: Full and irrevocable assignment of all Assigned IP from Assignor to Assignee effective upon creation or execution
- Ownership Confirmation: All Assigned IP is owned exclusively by Assignee upon creation, whether created alone or jointly
- Consideration: Compensation for IP assignment (salary, fees, equity, consideration already provided, or mutual promises)
- Representations and Warranties: 
  * Assignor confirms original ownership of all Assigned IP
  * No third-party claims or encumbrances on the IP
  * IP does not infringe third-party rights
  * Assignor has full authority to assign the IP
- Moral Rights Waiver: Assignor waives moral rights and paternity rights (where applicable by law) in the Assigned IP
- Further Assurances: Assignor agrees to execute any additional documents needed to perfect or confirm the assignment
- Retained Rights: Assignor may retain rights only as explicitly written in this agreement
- Confidentiality: Protection of proprietary information during the relationship
- Indemnification: Assignor indemnifies Assignee against third-party IP infringement claims
- Term and Survival: Assignment is effective upon execution and survives termination of underlying relationship
- Governing Law: State of Delaware
- Dispute Resolution: Mediation before litigation
- Signature blocks for both parties with titles and dates

Generate a complete, professional IP Assignment Agreement covering all points above.`;

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