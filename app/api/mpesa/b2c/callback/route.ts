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

    // M-PESA IDs for tracking
    const originatorConversationId = Result.OriginatorConversationID;
    const conversationId = Result.ConversationID;
    const resultCode = Result.ResultCode;
    const resultDesc = Result.ResultDesc;

    // 1. Fetch the original payout record
    // In v3, OriginatorConversationID is the most reliable tracking key
    const { data: payout, error: fetchError } = await supabase
      .from('payouts')
      .select('*')
      .or(`originator_conversation_id.eq.${originatorConversationId},conversation_id.eq.${conversationId}`)
      .single();

    if (fetchError || !payout) {
      console.error('M-PESA B2C Callback: Payout record not found', { originatorConversationId, conversationId });
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Payout not found' });
    }

    const now = new Date().toISOString();

    if (resultCode === 0) {
      // Payout Success
      await supabase
        .from('payouts')
        .update({
          status: 'SUCCESS',
          processed_at: now,
          completed_at: now,
          callback_payload: Result,
          raw_callback: body
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
          processed_at: now,
          callback_payload: Result,
          raw_callback: body
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
