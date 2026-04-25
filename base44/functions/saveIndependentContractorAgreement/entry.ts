import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role || !['admin', 'super_admin'].includes(user.role)) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { contractorInfo, agreement, timestamp } = await req.json();

    if (!contractorInfo?.name || !agreement) {
      return Response.json({ error: 'Invalid data' }, { status: 400 });
    }

    console.log(`Saved agreement for ${contractorInfo.name} at ${timestamp}`);

    return Response.json({
      success: true,
      message: 'Agreement saved successfully',
      contractorName: contractorInfo.name,
      timestamp
    });
  } catch (error) {
    console.error('Error saving agreement:', error);
    return Response.json(
      { error: error.message || 'Failed to save agreement' },
      { status: 500 }
    );
  }
});