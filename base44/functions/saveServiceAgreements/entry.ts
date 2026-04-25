import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role || !['admin', 'super_admin'].includes(user.role)) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { clientInfo, agreements, timestamp } = await req.json();

    // In a production environment, you would save this to a database
    // For now, we're just validating and confirming receipt
    
    if (!clientInfo?.name || !agreements) {
      return Response.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Log to console for debugging
    console.log(`Saved agreements for ${clientInfo.name} at ${timestamp}`);

    return Response.json({
      success: true,
      message: 'Agreements saved successfully',
      clientName: clientInfo.name,
      timestamp
    });
  } catch (error) {
    console.error('Error saving agreements:', error);
    return Response.json(
      { error: error.message || 'Failed to save agreements' },
      { status: 500 }
    );
  }
});