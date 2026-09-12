import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Verify the request is made by the user themselves
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized to sync this profile' }, { status: 403 });
    }

    // Fetch the auth.users row to get the metadata using the admin API
    const { data: authUser, error: fetchError } = await supabase.auth.admin.getUserById(userId);
    
    if (fetchError || !authUser?.user) {
      return NextResponse.json({ error: 'Failed to fetch auth user' }, { status: 404 });
    }

    const authUserData = authUser.user;
    const metadata = authUserData.user_metadata || {};
    const role = metadata.role || 'BUYER';
    
    const sellerStatus = role === 'SELLER' ? 'PENDING' : 'APPROVED';

    // Prepare the insert payload explicitly mapping fields to avoid constraint violations
    const insertData = {
      id: authUserData.id,
      email: authUserData.email,
      first_name: metadata.first_name || null,
      last_name: metadata.last_name || null,
      role: role,
      business_name: metadata.business_name || null,
      id_number: metadata.id_number || null,
      planned_categories: metadata.planned_categories || null,
      store_description: metadata.store_description || null,
      physical_address: metadata.physical_address || null,
      phone_number: metadata.phone_number || null,
      city: metadata.city || null,
      seller_type: metadata.seller_type || null,
      business_registration_number: metadata.business_registration_number || null,
      id_document_url: metadata.id_document_url || null,
      business_certificate_url: metadata.business_certificate_url || null,
      seller_status: sellerStatus,
      is_active: true
    };

    // Clean up empty strings to be explicitly null to avoid UNIQUE constraint violations
    const dataToInsert: Record<string, any> = { ...insertData };
    Object.keys(dataToInsert).forEach((key) => {
      if (dataToInsert[key] === '') {
        dataToInsert[key] = null;
      }
    });

    const { data: syncedUser, error: syncError } = await supabase
      .from('users')
      .upsert(dataToInsert, { onConflict: 'id' })
      .select()
      .single();

    if (syncError) throw syncError;

    return NextResponse.json({ success: true, user: syncedUser });
  } catch (error: any) {
    console.error('Profile sync error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
