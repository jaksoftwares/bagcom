import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

/**
 * Admin Analytics API Endpoint
 * URL: /api/admin/analytics
 */

export async function GET(request: Request) {
  try {
    // TODO: Verify user is authenticated and has ADMIN or SUPER_ADMIN role
    
    // 1. Fetch Financial Metrics from pre-calculated View
    const { data: financial, error: financialError } = await supabase
      .from('view_admin_financial_metrics')
      .select('*')
      .single();

    if (financialError) throw financialError;

    // 2. Fetch Platform Activity from pre-calculated View
    const { data: activity, error: activityError } = await supabase
      .from('view_platform_activity')
      .select('*')
      .single();

    if (activityError) throw activityError;
    
    return NextResponse.json({
      financial,
      activity
    });
  } catch (error: any) {
    console.error('Admin Analytics Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
