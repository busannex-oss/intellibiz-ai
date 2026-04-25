import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role || !['admin', 'super_admin'].includes(user.role)) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { variation, partnerInfo, content } = await req.json();

    if (!variation || !content) {
      return Response.json({ error: 'Missing variation or content' }, { status: 400 });
    }

    const fileName = `${partnerInfo.name.replace(/\s+/g, '_')}_${variation}_Agreement_${new Date().getTime()}.pdf`;

    return Response.json({
      success: true,
      message: 'PDF export initiated',
      fileName,
      partnerName: partnerInfo.name,
      variation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error exporting PDF:', error);
    return Response.json(
      { error: error.message || 'Failed to export PDF' },
      { status: 500 }
    );
  }
});