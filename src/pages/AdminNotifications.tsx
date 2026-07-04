import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Internal-only manual notification composer — replaces the Firebase Console
// for anything user-facing, since Console sends bypass our backend entirely
// (no history row, no tracking, unfixable after the fact). Gated by the same
// SEND_ADMIN_SECRET already used for send-notification/send-campaign — never
// baked into the bundle, only kept in this browser tab's sessionStorage after
// being typed in once.
const FUNCTIONS_URL = 'https://zvdkdisqavthbqmbkfvt.supabase.co/functions/v1';
const SECRET_KEY = 'gw_admin_secret';

const TARGETS = [
  { value: '/', label: 'الرئيسية' },
  { value: '/market', label: 'السوق' },
  { value: '/wallet', label: 'المحفظة' },
  { value: '/zakat', label: 'حاسبة الزكاة' },
  { value: '/settings', label: 'الإعدادات' },
  { value: '/notifications', label: 'الإشعارات' },
  { value: '/add-record', label: 'إضافة سجل' },
];

interface Campaign {
  id: number;
  title: string;
  body: string;
  status: string;
  resolved_count: number | null;
  sentCount: number;
  receivedCount: number;
  openedCount: number;
  created_at: string;
  scheduled_for: string;
  target: string;
}

function SecretGate({ onUnlock }: { onUnlock: (secret: string) => void }) {
  const [value, setValue] = useState('');
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <form
        onSubmit={(e) => { e.preventDefault(); if (value.trim()) onUnlock(value.trim()); }}
        className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-[0px_4px_16px_rgba(10,31,68,0.06)] border border-outline-variant/20 text-center"
      >
        <span className="material-symbols-outlined text-primary text-4xl mb-3">lock</span>
        <h1 className="font-headline-md text-headline-md font-bold text-primary mb-4">أداة الإشعارات</h1>
        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="كلمة المرور"
          autoFocus
          className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-3 mb-4 text-center focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        />
        <button
          type="submit"
          className="w-full h-12 bg-primary-container text-on-primary-container font-label-md text-label-md rounded-xl hover:brightness-110 active:scale-95 transition-all"
        >
          دخول
        </button>
      </form>
    </div>
  );
}

export default function AdminNotifications() {
  const { toast } = useToast();
  const [secret, setSecret] = useState<string | null>(() => sessionStorage.getItem(SECRET_KEY));

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [platform, setPlatform] = useState<'any' | 'ios' | 'android'>('any');
  const [appVersion, setAppVersion] = useState('');
  const [records, setRecords] = useState<'any' | 'has' | 'none'>('any');
  const [activity, setActivity] = useState<'any' | 'active' | 'dormant'>('any');
  const [zakat, setZakat] = useState<'any' | 'set' | 'unset'>('any');
  const [region, setRegion] = useState<'any' | 'egypt' | 'gulf'>('any');
  const [target, setTarget] = useState('/');
  const [testMode, setTestMode] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [scheduleMode, setScheduleMode] = useState<'now' | 'later'>('now');
  const [scheduleAt, setScheduleAt] = useState('');
  const [sending, setSending] = useState(false);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  const loadCampaigns = async (currentSecret: string) => {
    setLoadingCampaigns(true);
    try {
      const res = await fetch(`${FUNCTIONS_URL}/send-campaign`, {
        headers: { 'x-admin-secret': currentSecret },
      });
      const json = await res.json();
      if (res.ok) setCampaigns(json.campaigns ?? []);
    } catch {
      // best-effort — the results view just stays empty on a network blip
    } finally {
      setLoadingCampaigns(false);
    }
  };

  useEffect(() => {
    if (secret) loadCampaigns(secret);
  }, [secret]);

  const handleUnlock = (value: string) => {
    sessionStorage.setItem(SECRET_KEY, value);
    setSecret(value);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret || !title.trim() || !body.trim()) return;
    if (testMode && !testEmail.trim()) return;
    if (scheduleMode === 'later' && !testMode && !scheduleAt) return;
    setSending(true);
    try {
      const res = await fetch(`${FUNCTIONS_URL}/send-campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          target,
          // Scheduling is ignored server-side in test mode anyway (a test
          // send is always meant to confirm things NOW), so only send it
          // when relevant.
          ...(scheduleMode === 'later' && !testMode && scheduleAt
            ? { scheduleFor: new Date(scheduleAt).toISOString() }
            : {}),
          // Test mode bypasses platform/version/segment filters entirely on
          // the backend, so there's no point sending them along.
          ...(testMode
            ? { testEmail: testEmail.trim() }
            : {
                platform: platform === 'any' ? undefined : platform,
                appVersion: appVersion.trim() || undefined,
                segments: { records, activity, zakat, region },
              }),
        }),
      });
      const json = await res.json();
      if (!res.ok || json.ok === false) {
        // A 401 here means the entered password was wrong — let them retry.
        if (res.status === 401) {
          sessionStorage.removeItem(SECRET_KEY);
          setSecret(null);
        }
        toast({ title: 'فشل الإرسال', description: json.error ?? 'حدث خطأ غير متوقع', variant: 'destructive' });
        return;
      }
      toast({
        title: json.scheduled ? 'تمت الجدولة' : 'تم الإرسال',
        description: json.scheduled
          ? `ستُرسَل في ${new Date(json.scheduledFor).toLocaleString('ar-EG')}`
          : testMode
          ? `تم الإرسال إلى ${testEmail.trim()} فقط`
          : `تم استهداف ${json.resolvedCount} مستخدم`,
      });
      setTitle('');
      setBody('');
      setScheduleAt('');
      loadCampaigns(secret);
    } catch {
      toast({ title: 'فشل الإرسال', description: 'تعذّر الاتصال بالخادم', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  if (!secret) return <SecretGate onUnlock={handleUnlock} />;

  return (
    <div className="bg-background min-h-screen pb-20">
      <header className="fixed top-0 w-full z-50 bg-surface/80 glass-header shadow-sm">
        <div className="flex flex-row justify-between items-center px-container-margin py-base w-full max-w-7xl mx-auto">
          <span className="w-10" />
          <h1 className="font-headline-md text-headline-md font-bold text-primary">أداة الإشعارات</h1>
          <span className="material-symbols-outlined text-primary">campaign</span>
        </div>
      </header>

      <main className="pt-24 px-container-margin max-w-2xl mx-auto space-y-8">
        <form onSubmit={handleSend} className="bg-white rounded-2xl p-6 shadow-[0px_4px_16px_rgba(10,31,68,0.06)] border border-outline-variant/20 space-y-5">
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">العنوان</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-3 text-right focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">النص</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={3}
              className="w-full bg-white border border-outline-variant/30 rounded-xl p-4 text-right resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">عند الفتح، انتقل إلى</label>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-3 text-right"
            >
              {TARGETS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div className={testMode ? 'opacity-40 pointer-events-none' : ''}>
            <label className="font-label-md text-label-md text-on-surface-variant mb-2 block">التوقيت</label>
            <div className="flex gap-3 mb-3">
              <button
                type="button"
                onClick={() => setScheduleMode('now')}
                disabled={testMode}
                className={`flex-1 py-2 rounded-xl border-2 font-label-sm text-label-sm transition-all ${
                  scheduleMode === 'now' ? 'border-primary bg-primary-container/10 text-primary font-semibold' : 'border-outline-variant/30 text-on-surface-variant'
                }`}
              >
                الآن
              </button>
              <button
                type="button"
                onClick={() => setScheduleMode('later')}
                disabled={testMode}
                className={`flex-1 py-2 rounded-xl border-2 font-label-sm text-label-sm transition-all ${
                  scheduleMode === 'later' ? 'border-primary bg-primary-container/10 text-primary font-semibold' : 'border-outline-variant/30 text-on-surface-variant'
                }`}
              >
                جدولة لوقت لاحق
              </button>
            </div>
            {scheduleMode === 'later' && (
              <input
                type="datetime-local"
                value={scheduleAt}
                onChange={(e) => setScheduleAt(e.target.value)}
                required={scheduleMode === 'later' && !testMode}
                className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-3 text-right focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            )}
          </div>

          <div className="rounded-xl border border-primary/30 bg-primary-container/5 p-4">
            <label className="flex items-center gap-2 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={testMode}
                onChange={(e) => setTestMode(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="font-label-md text-label-md font-bold text-primary">وضع الاختبار — إرسال لي فقط</span>
            </label>
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-3">
              يتجاهل النظام/الإصدار/الفئات المستهدَفة ويرسل لهذا الحساب فقط.
            </p>
            {testMode && (
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="بريدك الإلكتروني المسجّل في التطبيق"
                required={testMode}
                className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-3 text-right focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            )}
          </div>

          <div className={`grid grid-cols-2 gap-4 ${testMode ? 'opacity-40 pointer-events-none' : ''}`}>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant mb-2 block">النظام</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value as typeof platform)} disabled={testMode} className="w-full bg-white border border-outline-variant/30 rounded-xl px-3 py-2 text-right">
                <option value="any">الكل</option>
                <option value="ios">iOS فقط</option>
                <option value="android">Android فقط</option>
              </select>
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant mb-2 block">إصدار التطبيق (اختياري)</label>
              <input
                value={appVersion}
                onChange={(e) => setAppVersion(e.target.value)}
                placeholder="مثال: 1.3.1"
                disabled={testMode}
                className="w-full bg-white border border-outline-variant/30 rounded-xl px-3 py-2 text-right"
              />
            </div>
          </div>

          <div className={`grid grid-cols-2 gap-4 ${testMode ? 'opacity-40 pointer-events-none' : ''}`}>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant mb-2 block">السجلات</label>
              <select value={records} onChange={(e) => setRecords(e.target.value as typeof records)} disabled={testMode} className="w-full bg-white border border-outline-variant/30 rounded-xl px-3 py-2 text-right">
                <option value="any">الكل</option>
                <option value="has">لديهم سجلات</option>
                <option value="none">بدون سجلات</option>
              </select>
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant mb-2 block">النشاط</label>
              <select value={activity} onChange={(e) => setActivity(e.target.value as typeof activity)} disabled={testMode} className="w-full bg-white border border-outline-variant/30 rounded-xl px-3 py-2 text-right">
                <option value="any">الكل</option>
                <option value="active">نشط (١٤ يوم)</option>
                <option value="dormant">غير نشط</option>
              </select>
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant mb-2 block">الزكاة</label>
              <select value={zakat} onChange={(e) => setZakat(e.target.value as typeof zakat)} disabled={testMode} className="w-full bg-white border border-outline-variant/30 rounded-xl px-3 py-2 text-right">
                <option value="any">الكل</option>
                <option value="set">مفعّلة</option>
                <option value="unset">غير مفعّلة</option>
              </select>
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant mb-2 block">المنطقة</label>
              <select value={region} onChange={(e) => setRegion(e.target.value as typeof region)} disabled={testMode} className="w-full bg-white border border-outline-variant/30 rounded-xl px-3 py-2 text-right">
                <option value="any">الكل</option>
                <option value="egypt">مصر</option>
                <option value="gulf">الخليج</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={
              sending || !title.trim() || !body.trim() ||
              (testMode && !testEmail.trim()) ||
              (scheduleMode === 'later' && !testMode && !scheduleAt)
            }
            className="w-full h-14 bg-primary-container text-on-primary-container font-headline-md text-headline-md rounded-xl flex items-center justify-center gap-3 shadow-md hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            {sending ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                {scheduleMode === 'later' && !testMode ? 'جاري الجدولة...' : 'جاري الإرسال...'}
              </>
            ) : scheduleMode === 'later' && !testMode ? (
              <>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>schedule_send</span>
                جدولة
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                إرسال
              </>
            )}
          </button>
        </form>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold text-primary mb-4">آخر الحملات</h2>
          {loadingCampaigns ? (
            <p className="text-on-surface-variant text-center py-8">جاري التحميل...</p>
          ) : campaigns.length === 0 ? (
            <p className="text-on-surface-variant text-center py-8">لا توجد حملات بعد</p>
          ) : (
            <div className="space-y-3">
              {campaigns.map((c) => (
                <div key={c.id} className="bg-white rounded-xl p-4 shadow-[0px_2px_8px_rgba(10,31,68,0.04)] border border-outline-variant/20">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-label-md text-label-md font-bold text-on-surface">{c.title}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${c.status === 'sent' ? 'bg-primary-container/20 text-primary' : c.status === 'failed' ? 'bg-error/10 text-error' : 'bg-outline-variant/20 text-on-surface-variant'}`}>
                      {c.status === 'sent' ? 'أُرسلت' : c.status === 'failed' ? 'فشلت' : 'قيد الانتظار'}
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-2">{c.body}</p>
                  {c.status === 'pending' && (
                    <p className="font-label-sm text-label-sm text-primary mb-2">
                      مجدولة لـ {new Date(c.scheduled_for).toLocaleString('ar-EG')}
                    </p>
                  )}
                  <div className="flex gap-4 text-xs text-on-surface-variant">
                    <span>مستهدَف: {c.resolved_count ?? '—'}</span>
                    <span>مُرسَل: {c.sentCount}</span>
                    <span>مستلَم: {c.receivedCount}</span>
                    <span>مفتوح: {c.openedCount}</span>
                    <span>{new Date(c.created_at).toLocaleString('ar-EG')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
