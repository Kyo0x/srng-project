import { NextRequest, NextResponse } from 'next/server';
import { list, del } from '@vercel/blob';
import { auth } from '@/auth';
import { ADMIN_EMAILS } from '@/lib/constants';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { blobs } = await list({ prefix: 'site-images/' });

    const images = blobs.map(b => ({
      url: b.url,
      pathname: b.pathname,
      filename: b.pathname.replace('site-images/', '').replace(/-[a-z0-9]+(\.\w+)$/, '$1'),
      size: b.size,
      uploadedAt: b.uploadedAt,
    }));

    // Newest first
    images.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Image list error:', error);
    return NextResponse.json({ error: 'Failed to list images' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await request.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL required' }, { status: 400 });
    }

    await del(url);
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error('Image delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
