import { NextResponse } from 'next/server';
import { getServerSession, clearSessionResponse } from '@/lib/auth/session';
import { Repository } from '@/lib/db/repository';

export async function POST() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await Repository.deleteUserAccount(session.id);
    return clearSessionResponse();
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Deletion failed' }, { status: 500 });
  }
}
