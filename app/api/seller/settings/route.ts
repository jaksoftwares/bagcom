import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { userId, first_name, last_name, shop_name, bio, mpesa_number, profile_photo_url, city, physical_address, id_document_url, business_certificate_url } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 1. Update Users Table
    const userUpdates: any = {
      first_name,
      last_name,
      profile_photo_url,
      phone_number: mpesa_number // We keep mpesa number synced with phone number for payouts
    };
    if (city) userUpdates.city = city;
    if (physical_address) userUpdates.physical_address = physical_address;
    
    // If new KYC docs are uploaded, update them and set status to PENDING for admin review
    let kycUpdated = false;
    if (id_document_url) {
      userUpdates.id_document_url = id_document_url;
      kycUpdated = true;
    }
    if (business_certificate_url) {
      userUpdates.business_certificate_url = business_certificate_url;
      kycUpdated = true;
    }
    if (kycUpdated) {
      userUpdates.seller_status = 'PENDING';
    }

    const { error: userError } = await supabase
      .from('users')
      .update(userUpdates)
      .eq('id', userId);

    if (userError) throw userError;

    // 2. Resolve location_id if city and physical_address are provided
    let location_id = null;
    if (city && physical_address) {
      const { data: existingLoc } = await supabase
        .from('locations')
        .select('id')
        .eq('city', city)
        .eq('formatted_address', physical_address)
        .maybeSingle();

      if (existingLoc) {
        location_id = existingLoc.id;
      } else {
        const { data: newLoc, error: locError } = await supabase
          .from('locations')
          .insert({ city, formatted_address: physical_address })
          .select('id')
          .single();
        if (!locError && newLoc) {
          location_id = newLoc.id;
        }
      }
    }

    // 3. Update Seller Profiles Table
    const sellerUpdates: any = {
      shop_name,
      bio,
      mpesa_number
    };
    if (location_id) sellerUpdates.location_id = location_id;

    const { error: sellerError } = await supabase
      .from('seller_profiles')
      .update(sellerUpdates)
      .eq('user_id', userId);

    if (sellerError) throw sellerError;

    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error: any) {
    console.error('Settings Update Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
