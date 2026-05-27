import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { create, getNumericDate } from 'https://deno.land/x/djwt@v3.0.2/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ──────────────────────────────────────────────────────────────────────
// Firebase service-account → OAuth2 access token
// ──────────────────────────────────────────────────────────────────────
// Cache the token in memory between invocations of the same worker.
let cachedToken: { token: string; expiresAt: number } | null = null;

interface ServiceAccount {
  client_email: string;
  private_key:  string;
  project_id:   string;
}

function getServiceAccount(): ServiceAccount {
  const raw = Deno.env.get('FCM_SERVICE_ACCOUNT_JSON');
  if (!raw) throw new Error('FCM_SERVICE_ACCOUNT_JSON env var is not set');
  return JSON.parse(raw);
}

async function importPrivateKey(pemKey: string): Promise<CryptoKey> {
  const pem = pemKey
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s+/g, '');
  const binary = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey(
    'pkcs8',
    binary,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );
}

async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt > now + 60) return cachedToken.token;

  const key = await importPrivateKey(sa.private_key);
  const jwt = await create(
    { alg: 'RS256', typ: 'JWT' },
    {
      iss:   sa.client_email,
      scope: 'https://www.googleapis.com/auth/firebase.messaging',
      aud:   'https://oauth2.googleapis.com/token',
      iat:   getNumericDate(0),
      exp:   getNumericDate(60 * 60),
    },
    key,
  );

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method:  'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body:    new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion:  jwt,
    }),
  });
  if (!res.ok) {
    throw new Error(`OAuth exchange failed: ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  cachedToken = { token: json.access_token, expiresAt: now + json.expires_in };
  return cachedToken.token;
}

// ──────────────────────────────────────────────────────────────────────
// Main handler
// ──────────────────────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user_id, title, body, data } = await req.json();
    if (!user_id || !title || !body) {
      return new Response(JSON.stringify({ error: 'user_id, title, body are required' }), {
        status:  400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch this user's FCM tokens
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Persist the notification BEFORE pushing so the history screen has a
    // record even if all FCM deliveries fail. The service-role key bypasses
    // RLS so the insert is allowed regardless of session.
    const { error: insertError } = await supabase.from('notifications').insert({
      user_id,
      title,
      body,
      data: data ?? {},
    });
    if (insertError) {
      // Non-fatal — log and keep going so the push still fires.
      console.error('[send-notification] failed to persist notification:', insertError);
    }

    const { data: tokens, error } = await supabase
      .from('push_tokens')
      .select('token')
      .eq('user_id', user_id);
    if (error) throw error;
    if (!tokens || tokens.length === 0) {
      return new Response(JSON.stringify({ ok: true, sent: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get a fresh OAuth2 access token for FCM
    const sa          = getServiceAccount();
    const accessToken = await getAccessToken(sa);
    const fcmEndpoint = `https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`;

    // FCM v1 has no batch endpoint — one request per token, fired in parallel.
    const stringData: Record<string, string> = {};
    for (const [k, v] of Object.entries(data ?? {})) stringData[k] = String(v);

    const results = await Promise.allSettled(
      tokens.map(({ token }) =>
        fetch(fcmEndpoint, {
          method:  'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type':  'application/json',
          },
          body: JSON.stringify({
            message: {
              token,
              notification: { title, body },
              data:    stringData,
              android: { priority: 'high', notification: { sound: 'default' } },
              apns:    { payload: { aps: { sound: 'default' } } },
            },
          }),
        }).then(async (r) => ({ ok: r.ok, status: r.status, body: await r.text() })),
      ),
    );

    const sent     = results.filter((r) => r.status === 'fulfilled' && (r as any).value.ok).length;
    const failures = results
      .map((r, i) => ({ r, token: tokens[i].token }))
      .filter(({ r }) => r.status === 'rejected' || !(r as any).value?.ok)
      .map(({ r, token }) => ({
        token:  token.slice(0, 12) + '…',
        detail: r.status === 'fulfilled' ? (r as any).value.body : (r as any).reason?.message,
      }));

    return new Response(
      JSON.stringify({ ok: true, sent, total: tokens.length, failures }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status:  500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
