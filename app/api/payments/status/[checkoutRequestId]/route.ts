import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { MpesaService } from '@/services/mpesa';

/**
 * M-PESA Transaction Status Query API
 * URL: /api/payments/status/[checkoutRequestId]
 * This endpoint queries Safaricom directly to check if a payment was successful, 
 * failed, or cancelled by the user.
 */
export async function GET(
  request: Request,
  { params }: { params: { checkoutRequestId: string } }
) {
  try {
    const supabase = createServerClient();
    const { checkoutRequestId } = params;

    if (!checkoutRequestId) {
      return NextResponse.json({ error: 'Checkout Request ID is required' }, { status: 400 });
    }

    // 1. Query Safaricom Daraja API directly
    const statusData = await MpesaService.checkSTKStatus(checkoutRequestId);
    
    /**
     * Safaricom Response Codes (ResultCode):
     * 0: Success
     * 1032: Request cancelled by user
     * 1037: DS timeout user cannot be reached
     * 2001: Invalid initiator password/unauthorized
     * 1: Insufficient funds
     * ...
     */
    
    const resultCode = statusData.ResultCode;
    const resultDesc = statusData.ResultDesc;

    // 2. If we got a final result (Success or Failure), update the DB if not already updated by callback
    if (resultCode !== undefined) {
      const { data: transaction } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('checkout_request_id', checkoutRequestId)
        .single();

      if (transaction && transaction.status === 'PENDING') {
        const now = new Date().toISOString();
        const finalStatus = resultCode === "0" ? 'SUCCESS' : 'FAILED';

        // Update Transaction
        await supabase
          .from('payment_transactions')
          .update({
            status: finalStatus,
            result_code: resultCode.toString(),
            result_description: resultDesc,
            callback_received_at: now,
            raw_callback: statusData // Storing the query result as fallback
          })
          .eq('id', transaction.id);

        // Update Order if successful
        if (finalStatus === 'SUCCESS') {
          await supabase
            .from('orders')
            .update({ status: 'PAYMENT_SUCCESS', updated_at: now })
            .eq('id', transaction.order_id);
          
          // Note: Escrow record creation is better handled by the actual callback
          // but we could trigger it here if we were certain of success.
        } else if (resultCode === "1032") {
          // Specifically mark as cancelled in order if possible or just leave as failed
          await supabase
            .from('orders')
            .update({ status: 'PENDING_PAYMENT', updated_at: now })
            .eq('id', transaction.order_id);
        }
      }
    }

    return NextResponse.json({ 
      status: statusData.ResultCode === "0" ? 'SUCCESS' : 
              statusData.ResultCode === "1032" ? 'CANCELLED' :
              statusData.ResultCode !== undefined ? 'FAILED' : 'PENDING',
      details: statusData 
    });

  } catch (error: any) {
    console.error('Status Query Error:', error.response?.data || error.message);
    // If Safaricom returns a 404/500 for the query, the transaction might still be processing
    return NextResponse.json({ status: 'PENDING', message: 'Transaction still in progress or not found' });
  }
}
