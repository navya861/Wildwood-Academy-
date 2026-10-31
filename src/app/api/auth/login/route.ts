import { NextRequest, NextResponse } from 'next/server';
import { Repository } from '@/lib/db/repository';
import { verifyPassword } from '@/lib/auth/crypto';
import { createSessionResponse } from '@/lib/auth/session';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Please provide both email and password.' }, { status: 400 });
    }

    const scholar = await Repository.getUserByEmail(email);
    if (!scholar) {
      return NextResponse.json({ error: 'No scholar account found with this email.' }, { status: 401 });
    }

    const isValid = verifyPassword(password, scholar.user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password. Please check your scrolls and try again.' }, { status: 401 });
    }

    return createSessionResponse({
      id: scholar.profile.id,
      email: scholar.profile.email,
      display_name: scholar.profile.display_name,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Authentication failed.' }, { status: 500 });
  }
}
