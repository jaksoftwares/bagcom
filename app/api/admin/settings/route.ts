import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { logAdminAction } from '@/lib/admin-audit';

/**
 * Admin System Settings API
 * URL: /api/admin/settings
 */
export async function GET() {
  try {
    const supabase = createServerClient();
    const { data: settings, error } = await supabase
      .from('system_settings')
      .select('*');

    if (error) throw error;
    
    // Convert to object for easier frontend use
    const settingsObj = settings.reduce((acc: any, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    return NextResponse.json({ settings: settingsObj });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const { settings } = await request.json(); // Object: { key: value }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value: String(value),
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase.from('system_settings').upsert(updates);
    if (error) throw error;

    await logAdminAction(user.id, 'UPDATE_SYSTEM_SETTINGS', 'SYSTEM', 'GLOBAL', settings);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
