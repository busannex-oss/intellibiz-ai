import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user email from request
    const { email } = await req.json();
    
    // Find the user to promote
    const users = await base44.asServiceRole.entities.User.filter({ email });
    if (users.length === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const targetUser = users[0];

    // Update the user with super_admin role
    await base44.asServiceRole.entities.User.update(targetUser.id, {
      role: 'super_admin',
      is_active: true,
      permissions: {
        manage_users: true,
        manage_projects: true,
        manage_settings: true,
        view_analytics: true,
        manage_billing: true
      }
    });

    return Response.json({ 
      success: true,
      message: `User ${email} promoted to super_admin` 
    });
  } catch (error) {
    console.error('Error promoting user:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});