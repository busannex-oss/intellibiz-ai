import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role || !['admin', 'super_admin'].includes(user.role)) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { engagementInfo, platformName } = await req.json();

    if (!engagementInfo?.clientName) {
      return Response.json({ error: 'Client name is required' }, { status: 400 });
    }

    const engagementTypeMap = {
      consulting: 'consulting and advisory services',
      strategy: 'strategic planning and guidance',
      ai_deployment: 'AI system deployment and implementation',
      brand_building: 'brand development and positioning',
      white_label_setup: 'white label licensing and setup'
    };

    const prompt = `Generate a professional Terms of Engagement document for ${platformName}.

CLIENT: ${engagementInfo.clientName}
ENGAGEMENT TYPE: ${engagementTypeMap[engagementInfo.engagementType] || 'professional services'}
ENGAGEMENT SCOPE: ${engagementInfo.scope || 'To be defined in engagement'}
FEE STRUCTURE: ${engagementInfo.fees || 'To be determined'}
START DATE: ${engagementInfo.date}
PROVIDER: ${platformName}

This Terms of Engagement outlines the conditions, expectations, and responsibilities for the engagement between ${platformName} and ${engagementInfo.clientName}.

REQUIRED SECTIONS:

1. Engagement Scope and Objectives
   - Clear description of the engagement objectives and scope
   - Scope boundaries and exclusions
   - Duration of engagement

2. Roles and Responsibilities
   - ${platformName}'s responsibilities and deliverables
   - Client responsibilities and obligations
   - Decision-making authority and approvals
   - Points of contact and escalation paths

3. Communication Protocols
   - Response times for inquiries and communications
   - Reporting standards and frequency
   - Meeting cadence and format (in-person, virtual, hybrid)
   - Communication channels (email, calls, scheduled meetings)
   - Status reports and progress reviews

4. Deliverable Definitions and Acceptance Criteria
   - Specific definition of each deliverable
   - Acceptance criteria and quality standards for each deliverable
   - Timeline for delivery of each deliverable
   - Process for client feedback and approval

5. Fee Structure and Payment Schedule
   - Fees: ${engagementInfo.fees || 'As proposed'}
   - Payment schedule and milestones
   - Invoice procedures and payment terms (Net 30)
   - Currency and accepted payment methods
   - Late payment penalties (if applicable)

6. Expense Policy
   - Reimbursable expenses (travel, software, third-party services)
   - Documentation and approval requirements
   - Non-reimbursable expenses
   - Budget caps for various expense categories

7. Change Order Process
   - Process for requesting scope changes
   - How scope changes affect fees and timeline
   - Approval procedures for changes
   - Documentation requirements for change orders

8. Confidentiality Obligations
   - Definition of confidential information
   - Obligations of both parties regarding confidential information
   - Duration of confidentiality obligations
   - Permitted disclosures

9. Intellectual Property Ownership
   - ${platformName} retains all IP rights to pre-existing materials and methodologies
   - Client retains rights to their proprietary information
   - Joint ownership provisions for materials created during engagement
   - License grants for delivery materials

10. Quality Standards and Revision Policy
    - Quality standards for all deliverables
    - Number of revision rounds included
    - Process for additional revisions beyond included rounds
    - Timeline for feedback and revision requests

11. Termination Provisions
    - Termination for cause: breaches and remediation periods
    - Termination without cause: notice periods and procedures
    - Obligations upon termination
    - Survival of certain provisions post-termination

12. Governing Law and Jurisdiction
    - Governing law: State of Delaware
    - Dispute resolution: mediation before litigation
    - Venue and jurisdiction for any legal actions

13. General Provisions
    - Entire agreement clause
    - Amendment procedures
    - Severability clause
    - Force majeure

14. Signature Blocks
    - For ${platformName} (authorized representative)
    - For ${engagementInfo.clientName} (authorized representative)
    - Signature lines, printed names, titles, and dates

Generate a complete, professional Terms of Engagement document covering all sections above.`;

    const terms = await base44.integrations.Core.InvokeLLM({
      prompt,
      model: 'claude_opus_4_6'
    });

    return Response.json({ terms });
  } catch (error) {
    console.error('Error generating terms:', error);
    return Response.json(
      { error: error.message || 'Failed to generate terms' },
      { status: 500 }
    );
  }
});