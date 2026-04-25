import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role || !['admin', 'super_admin'].includes(user.role)) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { partyInfo, lois, timestamp } = await req.json();

    if (!partyInfo?.partyName || !lois) {
      return Response.json({ error: 'Invalid data' }, { status: 400 });
    }

    console.log(`Saved LOIs for ${partyInfo.partyName} at ${timestamp}`);

    return Response.json({
      success: true,
      message: 'Letters of Intent saved successfully',
      partyName: partyInfo.partyName,
      timestamp
    });
  } catch (error) {
    console.error('Error saving LOIs:', error);
    return Response.json(
      { error: error.message || 'Failed to save LOIs' },
      { status: 500 }
    );
  }
});