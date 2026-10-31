import { NextResponse } from 'next/server';
import { clearSessionResponse } from '@/lib/auth/session';

export async function POST() {
  return clearSessionResponse();
}
