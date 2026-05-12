import { createServerClient } from './supabase/server';

/**
 * Utility to record administrative actions in the database
 * Used for compliance and platform transparency
 */
export async function logAdminAction(
  adminId: string,
  action: string,
  entityType: string,
  entityId: string,
  details: any = {}
) {
  try {
    const supabase = createServerClient();
    
    const { error } = await supabase.from('audit_logs').insert({
      admin_id: adminId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details
    });

    if (error) {
      console.error('Audit Log Error:', error);
    }
  } catch (err) {
    console.error('Failed to record audit log:', err);
  }
}
