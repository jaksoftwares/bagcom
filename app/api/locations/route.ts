import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('county', { ascending: true })
      .order('city', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ locations: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const body = await request.json();
    const { county, city, formatted_address } = body;

    if (!city || !formatted_address) {
      return NextResponse.json({ error: 'City and formatted address are required' }, { status: 400 });
    }

    // Check if exact location already exists to prevent duplicates
    const { data: existing, error: searchError } = await supabase
      .from('locations')
      .select('id')
      .eq('city', city)
      .eq('formatted_address', formatted_address)
      .maybeSingle();

    if (searchError) throw searchError;

    if (existing) {
      return NextResponse.json({ location: existing });
    }

    // Insert new location
    const { data: newLocation, error: insertError } = await supabase
      .from('locations')
      .insert({
        county,
        city,
        formatted_address
      })
      .select('id')
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ location: newLocation });
  } catch (error: any) {
    console.error('Locations POST Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
