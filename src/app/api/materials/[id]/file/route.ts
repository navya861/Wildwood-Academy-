import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { Repository } from '@/lib/db/repository';
import { StorageProvider } from '@/lib/storage/storage-provider';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const material = await Repository.getMaterial(session.id, params.id);
  if (!material) {
    return NextResponse.json({ error: 'Material not found or access denied' }, { status: 404 });
  }

  try {
    const buffer = await StorageProvider.getFileBuffer(session.id, material.storage_path);

    const headers = new Headers();
    headers.set('Content-Type', material.file_type || 'application/octet-stream');
    headers.set('Content-Disposition', `inline; filename="${encodeURIComponent(material.original_filename)}"`);
    headers.set('Cache-Control', 'private, max-age=3600');

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'File access failed' }, { status: 500 });
  }
}
