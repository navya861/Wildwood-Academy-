import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { createToken, verifyToken } from './crypto';
import { UserProfile } from '../types';

export const AUTH_COOKIE_NAME = 'wildwood_session';

export interface SessionUser {
  id: string;
  email: string;
  display_name: string;
}

export async function getServerSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const { valid, payload } = verifyToken(token);
    if (!valid || !payload?.user) return null;

    return payload.user as SessionUser;
  } catch (error) {
    return null;
  }
}

export function createSessionResponse(user: SessionUser, destination?: string): NextResponse {
  const token = createToken({ user });
  const response = destination 
    ? NextResponse.redirect(new URL(destination, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
    : NextResponse.json({ success: true, user });

  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}

export function clearSessionResponse(): NextResponse {
  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
