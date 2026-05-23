import { cookies } from 'next/headers';

export async function POST(req) {
  const { username, password } = await req.json();

  if (username === 'admin' && password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set('admin_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    return Response.json({ success: true });
  }

  return Response.json({ error: 'Invalid credentials' }, { status: 401 });
}
