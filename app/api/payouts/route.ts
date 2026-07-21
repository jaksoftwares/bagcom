import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Payouts API Endpoint
 * URL: /api/payouts
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get('sellerId');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    
    if (!sellerId) {
      return NextResponse.json({ error: 'Missing sellerId' }, { status: 400 });
    }

    const supabase = createServerClient();
    
    let query = supabase
      .from('payouts')
      .select('*', { count: 'exact' })
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    // Pagination
    if (page && limit) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const from = (pageNum - 1) * limitNum;
      const to = from + limitNum - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    return NextResponse.json({ payouts: data, count });
  } catch (error: any) {
    console.error('Payouts GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sellerId, amount } = body;

    if (!sellerId || !amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid withdrawal request' }, { status: 400 });
    }

    const supabase = createServerClient();

    // 1. Secure server-side balance validation
    const { data: statsData, error: statsError } = await supabase.rpc(
      'get_seller_dashboard_stats',
      { p_seller_id: sellerId }
    );

    if (statsError || !statsData) {
      console.error('Failed to verify balance:', statsError);
      return NextResponse.json({ error: 'Failed to verify account balance securely.' }, { status: 500 });
    }

    const availableBalance = Number(statsData.availableBalance || 0);

    if (amount > availableBalance) {
      return NextResponse.json({ error: 'Insufficient funds. You cannot withdraw more than your available balance.' }, { status: 403 });
    }
    
    // 2. Create payout record
    const { data: payout, error: payoutError } = await supabase
      .from('payouts')
      .insert({
        seller_id: sellerId,
        amount: Number(amount),
        status: 'PENDING',
        method: 'MPESA'
      })
      .select()
      .single();

    if (payoutError) throw payoutError;

    // 3. Initiate M-PESA B2C Payout (This is where the .env credentials are used)
    // For now, we'll return the pending record.
    // The actual M-PESA call would happen here or in a background worker.

    return NextResponse.json({ success: true, payout }, { status: 201 });
  } catch (error: any) {
    console.error('Payouts POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
