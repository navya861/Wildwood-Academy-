import { NextRequest, NextResponse } from 'next/server';
import { Repository } from '@/lib/db/repository';
import { hashPassword } from '@/lib/auth/crypto';
import { createSessionResponse } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const { email, password, display_name } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid scholar email address.' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const passwordHash = hashPassword(password);
    const profile = await Repository.createUser(email, passwordHash, display_name || 'Woodland Scholar');

    return createSessionResponse({
      id: profile.id,
      email: profile.email,
      display_name: profile.display_name,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 400 });
  }
}
