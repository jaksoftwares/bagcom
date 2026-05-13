import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Public Sellers API Endpoint
 * URL: /api/sellers
 * Returns a list of verified and active merchants
 */

export async function GET() {
  try {
    const supabase = createServerClient();
    
    // Fetch users who are sellers and have been approved by admin
    const { data: sellers, error } = await supabase
      .from('users')
      .select(`
        id,
        first_name,
        last_name,
        profile_photo_url,
        business_name,
        city,
        store_description,
        planned_categories,
        created_at,
        role,
        seller_status
      `)
      .eq('role', 'SELLER')
      .eq('seller_status', 'APPROVED')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(12);

    if (error) throw error;

    return NextResponse.json({ sellers });
  } catch (error: any) {
    console.error('Sellers GET Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
