import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { logAdminAction } from '@/lib/admin-audit';

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    
    // Verify admin access
    const { data: { user: admin }, error: authError } = await supabase.auth.getUser();
    if (authError || !admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminProfile } = await supabase
      .from('users')
      .select('role')
      .eq('id', admin.id)
      .single();

    if (adminProfile?.role !== 'ADMIN' && adminProfile?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Find all corrupted profiles
    const { data: corruptedUsers, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'legacy_user@placeholder.com');

    if (fetchError) throw fetchError;

    if (!corruptedUsers || corruptedUsers.length === 0) {
      return NextResponse.json({ success: true, message: 'No corrupted users found to repair', repairedCount: 0 });
    }

    let repairedCount = 0;
    const errors = [];

    // Repair each profile using the exact auth.users metadata
    for (const corrupted of corruptedUsers) {
      try {
        const { data: authUser, error: authUserError } = await supabase.auth.admin.getUserById(corrupted.id);
        
        if (authUserError || !authUser?.user) {
          errors.push({ id: corrupted.id, error: 'Auth user not found' });
          continue;
        }

        const authUserData = authUser.user;
        const metadata = authUserData.user_metadata || {};
        const role = metadata.role || 'BUYER';
        const sellerStatus = role === 'SELLER' ? 'PENDING' : 'APPROVED';

        const updateData = {
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
          seller_status: sellerStatus
        };

        // Clean up empty strings
        const dataToUpdate: Record<string, any> = { ...updateData };
        Object.keys(dataToUpdate).forEach((key) => {
          if (dataToUpdate[key] === '') {
            dataToUpdate[key] = null;
          }
        });

        const { error: updateError } = await supabase
          .from('users')
          .update(dataToUpdate)
          .eq('id', corrupted.id);

        if (updateError) {
          errors.push({ id: corrupted.id, error: updateError.message });
        } else {
          repairedCount++;
        }
      } catch (err: any) {
        errors.push({ id: corrupted.id, error: err.message });
      }
    }

    await logAdminAction(admin.id, 'SYSTEM_REPAIR', 'SYSTEM', admin.id, {
      repairedCount,
      totalFound: corruptedUsers.length,
      errors
    });

    return NextResponse.json({ 
      success: true, 
      message: `Successfully repaired ${repairedCount} corrupted profiles`,
      repairedCount,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error('Repair API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
