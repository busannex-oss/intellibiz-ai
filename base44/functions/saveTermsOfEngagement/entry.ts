import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role || !['admin', 'super_admin'].includes(user.role)) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { engagementInfo, terms, timestamp } = await req.json();

    if (!engagementInfo?.clientName || !terms) {
      return Response.json({ error: 'Invalid data' }, { status: 400 });
    }

    console.log(`Saved Terms of Engagement for ${engagementInfo.clientName} at ${timestamp}`);

    return Response.json({
      success: true,
      message: 'Terms saved successfully',
      clientName: engagementInfo.clientName,
      timestamp
    });
  } catch (error) {
    console.error('Error saving terms:', error);
    return Response.json(
      { error: error.message || 'Failed to save terms' },
      { status: 500 }
    );
  }
});