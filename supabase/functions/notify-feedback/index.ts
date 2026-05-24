import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!;
const NOTIFY_EMAIL   = 'lifekit396@gmail.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, category, rating, message } = await req.json();

    const categoryLabels: Record<string, string> = {
      bug:        'مشكلة تقنية',
      suggestion: 'اقتراح تحسين',
      general:    'تعليق عام',
      other:      'أخرى',
    };

    const stars = rating ? '⭐'.repeat(rating) : 'لم يُحدد';
    const categoryLabel = categoryLabels[category] ?? category ?? 'لم يُحدد';

    const html = `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 24px; border-radius: 12px;">
        <div style="background: #0A1F44; padding: 20px 24px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: #D4AF37; margin: 0; font-size: 20px;">📬 ملاحظة جديدة — سجل الذهب</h1>
        </div>
        <div style="background: white; padding: 24px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #6b7280; width: 120px;">البريد</td>
              <td style="padding: 10px 0; color: #111827; font-weight: bold;">${email || 'غير محدد'}</td>
            </tr>
            <tr style="border-top: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">النوع</td>
              <td style="padding: 10px 0; color: #111827;">${categoryLabel}</td>
            </tr>
            <tr style="border-top: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280;">التقييم</td>
              <td style="padding: 10px 0;">${stars}</td>
            </tr>
            <tr style="border-top: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #6b7280; vertical-align: top;">الرسالة</td>
              <td style="padding: 10px 0; color: #111827; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</td>
            </tr>
          </table>
        </div>
        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">سجل الذهب • إشعار تلقائي</p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:    'سجل الذهب <onboarding@resend.dev>',
        to:      [NOTIFY_EMAIL],
        subject: `💬 ملاحظة جديدة${rating ? ` — ${stars}` : ''}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Resend error: ${err}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
