import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createServerClient();
    
    // Fetch parent categories and their subcategories in a single query
    const { data, error } = await supabase
      .from('categories')
      .select('*, subcategories:categories(*)')
      .is('parent_id', null)
      .order('name');

    if (error) {
      console.error('Categories GET Error:', error);
      throw error;
    }

    return NextResponse.json({ 
      categories: data || [] 
    });
  } catch (error: any) {
    console.error('Categories GET Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}
