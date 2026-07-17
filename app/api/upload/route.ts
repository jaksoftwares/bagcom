import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Cloudinary Upload Signature Endpoint
 * URL: /api/upload
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const folder = body.folder || 'bagcom_products';

    const timestamp = Math.round(new Date().getTime() / 1000);
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!apiSecret) {
      return NextResponse.json({ error: 'Missing API Secret' }, { status: 500 });
    }

    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');

    return NextResponse.json({ 
      signature,
      timestamp,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
      folder
    });
  } catch (error: any) {
    console.error('Upload Signature Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
