import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Consolidated handler for all channel events (SMS, Email, Calls)
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { channel, event_type, data } = body;

    // Route to appropriate handler
    switch (channel) {
      case 'sms':
        return await handleSMS(base44, event_type, data);
      case 'email':
        return await handleEmail(base44, event_type, data);
      case 'call':
        return await handleCall(base44, event_type, data);
      default:
        return new Response(JSON.stringify({ error: 'Unknown channel' }), { status: 400 });
    }
  } catch (error) {
    console.error('Error in channel handler:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});

async function handleSMS(base44, eventType, data) {
  const { messageSid, from, to, body } = data;
  const projectId = Deno.env.get('CURRENT_PROJECT_ID');

  const agents = await base44.asServiceRole.entities.AIAgent.filter(
    { is_active: true },
    '-created_date',
    1
  );

  // Get AI response
  const aiResponse = await base44.integrations.Core.InvokeLLM({
    prompt: `Respond to SMS: "${body}" in under 160 chars`,
    model: 'gemini_3_flash'
  });

  // Create records
  await base44.asServiceRole.entities.SMSSession.create({
    message_sid: messageSid,
    project_id: projectId,
    from_number: from,
    to_number: to,
    direction: 'inbound',
    body,
    assigned_agent_id: agents[0]?.id,
    assigned_agent_name: agents[0] ? `${agents[0].first_name} ${agents[0].last_name}` : 'Assistant',
    status: 'received',
    timestamp: new Date().toISOString(),
    requires_response: true
  });

  await base44.asServiceRole.entities.SMSSession.create({
    message_sid: `${messageSid}_response`,
    project_id: projectId,
    from_number: to,
    to_number: from,
    direction: 'outbound',
    body: aiResponse,
    assigned_agent_id: agents[0]?.id,
    assigned_agent_name: agents[0] ? `${agents[0].first_name} ${agents[0].last_name}` : 'Assistant',
    status: 'sent',
    timestamp: new Date().toISOString(),
    ai_generated: true
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

async function handleEmail(base44, eventType, data) {
  const { messageId, from, to, subject, text, html } = data;
  const projectId = Deno.env.get('CURRENT_PROJECT_ID');
  const threadId = `email_${Date.now()}`;

  const agents = await base44.asServiceRole.entities.AIAgent.filter(
    { is_active: true },
    '-created_date',
    1
  );

  // Analyze sentiment
  const sentiment = await base44.integrations.Core.InvokeLLM({
    prompt: `Sentiment of: "${subject} ${text}" - respond with one word: positive, neutral, negative, or urgent`,
    model: 'gemini_3_flash'
  });

  // Create email record
  await base44.asServiceRole.entities.EmailSession.create({
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
    sentiment: sentiment.toLowerCase().trim(),
    priority: sentiment.toLowerCase().includes('urgent') ? 'urgent' : 'medium',
    requires_response: true
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}

async function handleCall(base44, eventType, data) {
  const { callSid, from, to, status } = data;
  const projectId = Deno.env.get('CURRENT_PROJECT_ID');

  const agents = await base44.asServiceRole.entities.AIAgent.filter(
    { is_active: true },
    '-created_date',
    1
  );

  await base44.asServiceRole.entities.CallSession.create({
    call_sid: callSid,
    project_id: projectId,
    caller_number: from,
    called_number: to,
    direction: 'inbound',
    assigned_agent_id: agents[0]?.id,
    assigned_agent_name: agents[0] ? `${agents[0].first_name} ${agents[0].last_name}` : 'Receptionist',
    status,
    started_at: new Date().toISOString()
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}