import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * M-PESA Account Balance Callback Handler
 * URL: /api/mpesa/balance/callback
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const Result = body.Result;

    if (!Result) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid payload' });
    }

    if (Result.ResultCode === 0) {
      const supabase = createServerClient();
      
      // The balance is returned in ResultParameters
      // [ { Key: "AccountBalance", Value: "Utility Account|KES|1200000.00|1200000.00|0.00|0.00" }, ... ]
      const params = Result.ResultParameters.ResultParameter;
      const balanceStr = params.find((p: any) => p.Key === 'AccountBalance')?.Value;

      if (balanceStr) {
        // Parse "Utility Account|KES|1200000.00|1200000.00|0.00|0.00"
        const parts = balanceStr.split('|');
        const accountType = parts[0];
        const currency = parts[1];
        const balance = parseFloat(parts[2]);

        await supabase.from('mpesa_account_status').insert({
          shortcode: process.env.MPESA_B2C_SHORTCODE,
          account_type: accountType,
          balance: balance,
          currency: currency,
          raw_response: Result
        });
      }
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error: any) {
    console.error('Balance Callback Error:', error);
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Internal Server Error' });
  }
}
