import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const formData = await req.formData();
    
    const callSid = formData.get('CallSid');
    const from = formData.get('From');
    const to = formData.get('To');
    const callStatus = formData.get('CallStatus');
    const direction = from.startsWith('+1') ? 'inbound' : 'outbound';

    // Get project ID from environment or request
    const projectId = formData.get('projectId') || Deno.env.get('CURRENT_PROJECT_ID');

    // Create or update call session
    let callSession = await base44.asServiceRole.entities.CallSession.filter(
      { call_sid: callSid }
    );

    if (callSession.length === 0) {
      // New call - assign to available AI agent
      const agents = await base44.asServiceRole.entities.AIAgent.filter(
        { is_active: true },
        '-created_date',
        1
      );

      callSession = await base44.asServiceRole.entities.CallSession.create({
        call_sid: callSid,
        project_id: projectId,
        caller_number: from,
        called_number: to,
        direction,
        assigned_agent_id: agents[0]?.id,
        assigned_agent_name: agents[0] ? `${agents[0].first_name} ${agents[0].last_name}` : 'Receptionist',
        status: callStatus,
        started_at: new Date().toISOString()
      });
    } else {
      // Update existing call
      await base44.asServiceRole.entities.CallSession.update(callSession[0].id, {
        status: callStatus,
        ended_at: callStatus === 'completed' ? new Date().toISOString() : null
      });
    }

    // Generate TwiML response with ElevenLabs voice
    const twiml = generateCallResponse(callSession[0]);

    return new Response(twiml, {
      status: 200,
      headers: { 'Content-Type': 'application/xml' }
    });
  } catch (error) {
    console.error('Error handling Twilio call:', error);
    return new Response('<?xml version="1.0" encoding="UTF-8"?><Response><Say>There was an error processing your call. Please try again.</Say></Response>', {
      status: 200,
      headers: { 'Content-Type': 'application/xml' }
    });
  }
});

function generateCallResponse(callSession) {
  const greeting = `Hello! Thank you for calling. I'm ${callSession.assigned_agent_name}, your AI assistant. How can I help you today?`;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">${greeting}</Say>
  <Gather numDigits="1" action="/twilio/gather-input" method="POST">
    <Say voice="alice">Press 1 to speak with sales, 2 for support, or 3 to leave a message.</Say>
  </Gather>
</Response>`;
}