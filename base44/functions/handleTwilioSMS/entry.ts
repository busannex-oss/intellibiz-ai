import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const formData = await req.formData();

    const messageSid = formData.get('MessageSid');
    const from = formData.get('From');
    const to = formData.get('To');
    const body = formData.get('Body');
    const direction = 'inbound';

    const projectId = Deno.env.get('CURRENT_PROJECT_ID');

    // Get or create conversation thread
    let conversation = await base44.asServiceRole.entities.SMSSession.filter(
      { 
        from_number: from,
        to_number: to,
        conversation_id: { $exists: true }
      }
    );

    const conversationId = conversation[0]?.conversation_id || `sms_${Date.now()}`;

    // Assign to available agent
    const agents = await base44.asServiceRole.entities.AIAgent.filter(
      { is_active: true },
      '-created_date',
      1
    );

    // Create SMS session record
    const smsSession = await base44.asServiceRole.entities.SMSSession.create({
      message_sid: messageSid,
      project_id: projectId,
      from_number: from,
      to_number: to,
      direction,
      body,
      assigned_agent_id: agents[0]?.id,
      assigned_agent_name: agents[0] ? `${agents[0].first_name} ${agents[0].last_name}` : 'Assistant',
      status: 'received',
      timestamp: new Date().toISOString(),
      conversation_id: conversationId,
      requires_response: true
    });

    // Generate AI response
    const aiResponse = await base44.integrations.Core.InvokeLLM({
      prompt: `You are ${agents[0]?.first_name || 'an'} AI assistant. Respond professionally to this SMS: "${body}". Keep response under 160 characters for SMS.`,
      model: 'gemini_3_flash'
    });

    // Send response via Twilio
    await sendSMSResponse(to, from, aiResponse);

    // Record the response
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
      ai_generated: true,
      conversation_id: conversationId
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Error handling SMS:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});

async function sendSMSResponse(fromNumber, toNumber, message) {
  const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${Deno.env.get('TWILIO_ACCOUNT_SID')}/Messages.json`;
  
  const formData = new URLSearchParams({
    From: fromNumber,
    To: toNumber,
    Body: message
  });

  const response = await fetch(twilioUrl, {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(`${Deno.env.get('TWILIO_ACCOUNT_SID')}:${Deno.env.get('TWILIO_AUTH_TOKEN')}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData
  });

  return response.json();
}