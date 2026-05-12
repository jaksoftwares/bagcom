import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

/**
 * Safaricom M-PESA B2C (Business to Customer) Callback Endpoint
 * URL: /api/mpesa/b2c/callback
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { Result } = body;
    
    if (!Result) {
      console.error('M-PESA B2C Callback: Invalid payload structure', body);
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid payload' });
    }

    // M-PESA ConversationID maps to our tracking ID
    const mpesaPayoutId = Result.ConversationID; 
    const resultCode = Result.ResultCode;
    const resultDesc = Result.ResultDesc;

    // 1. Fetch the original payout record
    const { data: payout, error: fetchError } = await supabase
      .from('payouts')
      .select('*')
      .eq('mpesa_payout_id', mpesaPayoutId)
      .single();

    if (fetchError || !payout) {
      console.error('M-PESA B2C Callback: Payout record not found', mpesaPayoutId);
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Payout not found' });
    }

    const now = new Date().toISOString();

    if (resultCode === 0) {
      // Payout Success
      await supabase
        .from('payouts')
        .update({
          status: 'COMPLETED',
          processed_at: now
        })
        .eq('id', payout.id);

      // Update Order Status to COMPLETED if it was a product sale
      if (payout.order_id) {
        await supabase
          .from('orders')
          .update({
            status: 'COMPLETED',
            completed_at: now,
            updated_at: now
          })
          .eq('id', payout.order_id);
      }

    } else {
      // Payout Failed (ResultCode != 0)
      await supabase
        .from('payouts')
        .update({
          status: 'FAILED',
          processed_at: now
        })
        .eq('id', payout.id);
        
      console.error(`B2C Payout failed for PayoutID ${payout.id}: ${resultDesc}`);
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error: any) {
    console.error('B2C Callback Error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Internal Server Error' });
  }
}
