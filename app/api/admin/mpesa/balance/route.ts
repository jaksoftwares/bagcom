import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { MpesaService } from '@/services/mpesa';
import { logAdminAction } from '@/lib/admin-audit';

/**
 * Admin M-Pesa Balance Sync API
 * Triggers a balance query to Safaricom
 */
export async function POST() {
  try {
    const supabase = createServerClient();
    
    // 1. Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (profile?.role !== 'ADMIN' && profile?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Trigger M-Pesa Balance Query
    const response = await MpesaService.getAccountBalance();

    // 3. Log the action
    await logAdminAction(user.id, 'SYNC_MPESA_BALANCE', 'SYSTEM', 'MPESA', { conversation_id: response.ConversationID });

    return NextResponse.json({ 
      success: true, 
      message: 'Balance query initiated. This is an asynchronous process; the dashboard will update once the callback is received.',
      conversation_id: response.ConversationID 
    });

  } catch (error: any) {
    console.error('Balance Sync Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Get current cached balance
 */
export async function GET() {
  try {
    const supabase = createServerClient();
    const { data: balance } = await supabase
      .from('mpesa_account_status')
      .select('*')
      .order('last_updated', { ascending: false })
      .limit(1);

    return NextResponse.json({ balance: balance?.[0] || null });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
