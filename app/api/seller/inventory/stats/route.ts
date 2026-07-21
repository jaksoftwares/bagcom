import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch only what's necessary (id, is_available, price) to calculate stats
    // This is much faster than fetching full product details with relations
    const { data: products, error } = await supabase
      .from('products')
      .select('id, is_available, price')
      .eq('seller_id', userId);

    if (error) {
      console.error('Inventory Stats Error:', error);
      return NextResponse.json({ error: 'Failed to fetch inventory stats' }, { status: 500 });
    }

    let active = 0;
    let drafts = 0;
    let totalValue = 0;

    if (products) {
      products.forEach((p) => {
        if (p.is_available) {
          active++;
        } else {
          drafts++;
        }
        totalValue += Number(p.price) || 0;
      });
    }

    return NextResponse.json({
      stats: {
        total: products ? products.length : 0,
        active,
        drafts,
        totalValue
      }
    });
  } catch (error: any) {
    console.error('Seller Inventory Stats API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
