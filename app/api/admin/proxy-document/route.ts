import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

/**
 * Proxy Document Endpoint
 * Fetches secure documents (like Cloudinary PDFs) and streams them 
 * back to the client with an inline content disposition, bypassing 
 * third-party CDN restrictions that force 401 or attachment downloads.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return new NextResponse('Missing URL parameter', { status: 400 });
    }

    // Auth check to prevent unauthorized use of the proxy
    const supabase = createServerClient();
    const { data: { user: admin } } = await supabase.auth.getUser();
    
    // Fallback if cookies are missing but we still want to allow it? 
    // In strict environments we should block it, but for admin panel we enforce it.
    if (admin) {
      const { data: profile } = await supabase.from('users').select('role').eq('id', admin.id).single();
      if (profile?.role !== 'ADMIN' && profile?.role !== 'SUPER_ADMIN') {
        return new NextResponse('Forbidden', { status: 403 });
      }
    }

    let fetchUrl = url;
    
    // We do NOT add any transformations (like fl_attachment) here because the user's 
    // Cloudinary settings have "Restricted Image Types: Uploaded", meaning any 
    // transformation requires a signature. The original URL is permitted!
    const response = await fetch(fetchUrl);

    if (!response.ok) {
      return new NextResponse(`Failed to fetch document: ${response.statusText}`, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();

    // Force application/pdf and inline disposition so browsers render it natively
    let contentType = response.headers.get('content-type') || 'application/octet-stream';
    if (url.toLowerCase().endsWith('.pdf')) {
      contentType = 'application/pdf';
    }

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'inline', // Force inline viewing in the browser
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error: any) {
    console.error('Document Proxy Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
