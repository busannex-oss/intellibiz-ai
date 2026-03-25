import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const AI_PROVIDERS = [
  { name: 'OpenAI', key: 'OPENAI_API_KEY' },
  { name: 'Anthropic Opus', key: 'ANTHROPIC_API_KEY' },
  { name: 'Deepseek', key: 'DEEPSEEK_API_KEY' },
  { name: 'Grok', key: 'GROK_API_KEY' },
  { name: 'Gemini', key: 'GEMINI_API_KEY' }
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, response_json_schema, add_context_from_internet, file_urls } = await req.json();
    
    if (!prompt) {
      return Response.json({ error: 'prompt is required' }, { status: 400 });
    }

    let lastError = null;
    
    // Try each provider in sequence
    for (const provider of AI_PROVIDERS) {
      try {
        console.log(`Attempting with ${provider.name}...`);
        
        const result = await base44.integrations.Core.InvokeLLM({
          prompt,
          response_json_schema,
          add_context_from_internet,
          file_urls
        });

        return Response.json({
          success: true,
          provider: provider.name,
          result
        });

      } catch (error) {
        console.error(`${provider.name} failed:`, error.message);
        lastError = error;
        continue;
      }
    }

    // All providers failed
    return Response.json({
      success: false,
      error: 'All AI providers failed',
      last_error: lastError?.message
    }, { status: 503 });

  } catch (error) {
    return Response.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
});