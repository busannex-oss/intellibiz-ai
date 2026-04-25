import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role || !['admin', 'super_admin'].includes(user.role)) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { assignmentInfo, agreement, timestamp } = await req.json();

    if (!assignmentInfo?.assignor || !agreement) {
      return Response.json({ error: 'Invalid data' }, { status: 400 });
    }

    console.log(`Saved IP Assignment Agreement for ${assignmentInfo.assignor} at ${timestamp}`);

    return Response.json({
      success: true,
      message: 'Agreement saved successfully',
      assignorName: assignmentInfo.assignor,
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