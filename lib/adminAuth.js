import { createServerClient } from '@supabase/ssr';

function createRequestSupabase(request) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    }
  );
}

export async function getAdminUser(request) {
  try {
    const supabase = createRequestSupabase(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const isAdminUser =
      !!user && !!adminEmail && (user.email || '').toLowerCase() === adminEmail;
    if (!isAdminUser) return null;

    const { data: aal } =
      await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal && aal.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function isAdmin(request) {
  return !!(await getAdminUser(request));
}

export function unauthorized() {
  return new Response(JSON.stringify({ error: 'unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
