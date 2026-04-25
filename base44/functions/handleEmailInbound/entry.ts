import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { from, to, subject, text, html, messageId } = body;
    const projectId = Deno.env.get('CURRENT_PROJECT_ID');

    // Get or create thread
    const threads = await base44.asServiceRole.entities.EmailSession.filter(
      { from_email: from, thread_id: { $exists: true } }
    );

    const threadId = threads[0]?.thread_id || `email_${Date.now()}`;

    // Assign to agent
    const agents = await base44.asServiceRole.entities.AIAgent.filter(
      { is_active: true },
      '-created_date',
      1
    );

    // Analyze sentiment
    const sentimentAnalysis = await base44.integrations.Core.InvokeLLM({
      prompt: `Analyze the sentiment of this email subject and body. Respond with only one word: positive, neutral, negative, or urgent. Subject: "${subject}" Body: "${text}"`,
      model: 'gemini_3_flash'
    });

    const sentiment = sentimentAnalysis.toLowerCase().trim();
    const isUrgent = sentiment === 'urgent';

    // Create email session
    const emailSession = await base44.asServiceRole.entities.EmailSession.create({
      message_id: messageId,
      project_id: projectId,
      from_email: from,
      to_email: to,
      direction: 'inbound',
      subject,
      body: text,
      html_body: html,
      assigned_agent_id: agents[0]?.id,
      assigned_agent_name: agents[0] ? `${agents[0].first_name} ${agents[0].last_name}` : 'Assistant',
      status: 'received',
      timestamp: new Date().toISOString(),
      thread_id: threadId,
      sentiment: isUrgent ? 'urgent' : sentiment,
      priority: isUrgent ? 'urgent' : 'medium',
      requires_response: true
    });

    // Generate AI summary
    const summary = await base44.integrations.Core.InvokeLLM({
      prompt: `Summarize this email in one sentence: "${text}"`,
      model: 'gemini_3_flash'
    });

    // Update with summary
    await base44.asServiceRole.entities.EmailSession.update(emailSession.id, {
      ai_summary: summary
    });

    // Generate auto-response if needed
    if (isUrgent) {
      const autoResponse = `Thank you for reaching out. We've received your email and will respond shortly as it's marked urgent. Our team will be in touch within 2 hours.`;
      
      await sendEmailResponse(to, from, 'RE: ' + subject, autoResponse);

      await base44.asServiceRole.entities.EmailSession.create({
        message_id: `${messageId}_auto_response`,
        project_id: projectId,
        from_email: to,
        to_email: from,
        direction: 'outbound',
        subject: 'RE: ' + subject,
        body: autoResponse,
        assigned_agent_id: agents[0]?.id,
        assigned_agent_name: agents[0] ? `${agents[0].first_name} ${agents[0].last_name}` : 'Assistant',
        status: 'sent',
        timestamp: new Date().toISOString(),
        thread_id: threadId,
        ai_generated: true
      });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error handling email:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});

async function sendEmailResponse(from, to, subject, body) {
  return await Deno.env.get('EMAIL_SERVICE_URL') 
    ? fetch(Deno.env.get('EMAIL_SERVICE_URL'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to, subject, body })
      })
    : Promise.resolve(new Response(JSON.stringify({ queued: true })));
}