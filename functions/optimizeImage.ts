import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { image_url } = await req.json();
    
    if (!image_url) {
      return Response.json({ error: 'image_url is required' }, { status: 400 });
    }

    // Use AI to remove background and upscale image
    const optimizedImage = await base44.integrations.Core.InvokeLLM({
      prompt: `Process this image to:
1. Remove the background completely (make it transparent)
2. Upscale the image to the highest quality possible
3. Enhance image clarity and sharpness
4. Return the processed image URL

Original image: ${image_url}`,
      add_context_from_internet: true,
      file_urls: [image_url],
      response_json_schema: {
        type: "object",
        properties: {
          optimized_image_url: { type: "string" },
          dimensions: {
            type: "object",
            properties: {
              width: { type: "number" },
              height: { type: "number" }
            }
          },
          quality_improvement: { type: "string" }
        }
      }
    });

    return Response.json({
      success: true,
      optimized_image_url: optimizedImage.optimized_image_url,
      dimensions: optimizedImage.dimensions,
      quality_improvement: optimizedImage.quality_improvement
    });

  } catch (error) {
    return Response.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
});