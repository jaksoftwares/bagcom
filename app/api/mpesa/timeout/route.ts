import { NextResponse } from 'next/server';

/**
 * Safaricom M-PESA Timeout Callback Endpoint
 * URL: /api/mpesa/timeout
 * 
 * Safaricom sends requests here if a transaction times out.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    
    // TODO: Handle M-PESA timeouts
    // 1. Identify the transaction
    // 2. Mark payment_status as TIMEOUT in the database
    // 3. Notify the user

    console.log('Received M-PESA Timeout:', payload);

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error) {
    console.error('M-PESA Timeout Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
