import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { query } from '@/lib/db';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

export async function POST(request: NextRequest) {
  const session = await auth();
  const isAdmin = !!session?.user;

  // If not admin, require valid upload token
  if (!isAdmin) {
    const uploadToken = request.nextUrl.searchParams.get('token');
    if (!uploadToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await query(
      `SELECT id FROM bookings WHERE upload_token = $1 AND status IN ('pending_details', 'completed')
       AND NOT EXISTS (SELECT 1 FROM booking_drivers WHERE booking_id = bookings.id)`,
      [uploadToken]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG and PNG are allowed.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.type === 'image/png' ? '.png' : '.jpg';
    const filename = `${crypto.randomUUID()}${ext}`;
    const uploadDir = path.join(process.cwd(), 'storage', 'licenses');
    await mkdir(uploadDir, { recursive: true });
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    const url = `/api/licenses/${filename}`;

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
