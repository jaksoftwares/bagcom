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
    
    if (!sellerId) {
      return NextResponse.json({ error: 'Missing sellerId' }, { status: 400 });
    }

    const supabase = createServerClient();
    
    const { data, error } = await supabase
      .from('payouts')
      .select('*')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ payouts: data });
  } catch (error: any) {
    console.error('Payouts GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sellerId, amount } = body;

    if (!sellerId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createServerClient();

    // 1. Check seller balance
    // This would typically involve summing up COMPLETED orders and subtracting previous payouts
    // For now, we'll assume the client-side validation handles the balance check
    
    // 2. Create payout record
    const { data: payout, error: payoutError } = await supabase
      .from('payouts')
      .insert({
        seller_id: sellerId,
        amount,
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
