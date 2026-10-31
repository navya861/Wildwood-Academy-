import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth/session';
import { Repository } from '@/lib/db/repository';

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const materials = await Repository.getMaterials(session.id);
  const subjects = await Repository.getSubjects(session.id);

  return NextResponse.json({ materials, subjects });
}
