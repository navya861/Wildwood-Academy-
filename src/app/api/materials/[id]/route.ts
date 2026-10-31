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
    return NextResponse.json({ error: 'Material not found or unauthorized' }, { status: 404 });
  }

  const chunks = await Repository.getChunks(session.id, params.id);

  return NextResponse.json({ material, chunks });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, subject_id } = await req.json();
    const updated = await Repository.updateMaterial(session.id, params.id, {
      title,
      subject_id,
    });
    return NextResponse.json({ material: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Update failed' }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const material = await Repository.getMaterial(session.id, params.id);
  if (!material) {
    return NextResponse.json({ error: 'Material not found or unauthorized' }, { status: 404 });
  }

  try {
    // Delete file from storage
    await StorageProvider.deleteFile(session.id, material.storage_path);
    // Delete record & chunks from DB
    await Repository.deleteMaterial(session.id, params.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Deletion failed' }, { status: 500 });
  }
}
