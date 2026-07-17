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
