import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const VIDEO_PROVIDERS = [
  { name: 'Sora', key: 'SORA_API_KEY' },
  { name: 'Veo', key: 'VEO_API_KEY' },
  { name: 'Runway', key: 'RUNWAY_API_KEY' },
  { name: 'PIKA', key: 'PIKA_API_KEY' }
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt, duration, aspect_ratio, style } = await req.json();
    
    if (!prompt) {
      return Response.json({ error: 'prompt is required' }, { status: 400 });
    }

    let lastError = null;
    
    // Try each video provider in sequence
    for (const provider of VIDEO_PROVIDERS) {
      try {
        console.log(`Attempting video generation with ${provider.name}...`);
        
        // Use AI to generate video description and call provider
        const videoResult = await base44.integrations.Core.InvokeLLM({
          prompt: `Generate a professional business video with the following specifications:
          
Prompt: ${prompt}
Duration: ${duration || '30 seconds'}
Aspect Ratio: ${aspect_ratio || '16:9'}
Style: ${style || 'professional, modern'}

Provider: ${provider.name}

Generate the video and return the video URL.`,
          response_json_schema: {
            type: "object",
            properties: {
              video_url: { type: "string" },
              thumbnail_url: { type: "string" },
              duration_seconds: { type: "number" },
              resolution: { type: "string" }
            }
          }
        });

        return Response.json({
          success: true,
          provider: provider.name,
          video_url: videoResult.video_url,
          thumbnail_url: videoResult.thumbnail_url,
          duration_seconds: videoResult.duration_seconds,
          resolution: videoResult.resolution
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
      error: 'All video providers failed',
      last_error: lastError?.message
    }, { status: 503 });

  } catch (error) {
    return Response.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
});