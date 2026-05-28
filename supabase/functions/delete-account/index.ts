import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// ──────────────────────────────────────────────────────────────────────
// Account deletion (Apple Guideline 5.1.1(v) compliance)
// ──────────────────────────────────────────────────────────────────────
// A logged-in user calls this with their access token in the Authorization
// header. We verify the token, delete every row tied to that user across all
// app tables, then delete the auth user itself (which only the service-role
// key can do). The whole flow runs server-side so the client never needs the
// service-role key.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '').trim();
    if (!token) {
      return json({ error: 'Missing Authorization header' }, 401);
    }

    const admin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    // Verify the caller's JWT and resolve their user id. This guarantees a
    // user can only ever delete THEIR OWN account, never someone else's.
    const { data: { user }, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !user) {
      return json({ error: 'Invalid or expired session' }, 401);
    }
    const userId = user.id;

    // Delete app data first. Order doesn't matter (no FKs between these),
    // but we collect errors so a single failure doesn't strand the account.
    const tables = ['gold_records', 'push_tokens', 'notifications', 'feedback'];
    const dataErrors: Record<string, string> = {};
    for (const table of tables) {
      const { error } = await admin.from(table).delete().eq('user_id', userId);
      if (error) dataErrors[table] = error.message;
    }

    // Finally delete the auth user. If this fails the request fails — the
    // account must actually be gone for Apple compliance.
    const { error: deleteErr } = await admin.auth.admin.deleteUser(userId);
    if (deleteErr) {
      return json({ error: `Failed to delete account: ${deleteErr.message}`, dataErrors }, 500);
    }

    return json({ ok: true, deleted: userId, dataErrors });
  } catch (err) {
    console.error('[delete-account]', err);
    return json({ error: String(err) }, 500);
  }
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
