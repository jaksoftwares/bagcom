import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Admin Audit Logs API
 * URL: /api/admin/logs
 */
export async function GET() {
  try {
    const supabase = createServerClient();
    
    const { data: logs, error } = await supabase
      .from('audit_logs')
      .select(`
        *,
        admin:users!audit_logs_admin_id_fkey(first_name, last_name, role)
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error('Audit Fetch Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
