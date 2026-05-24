import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const LOGO_URL = '/app-icon.png';

export default function AuthPage() {
  const { signIn, signUp, signInWithGoogle, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      await signIn(email, password);
    } else {
      await signUp(email, password);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      {/* Top App Bar */}
      <header className="bg-surface/80 glass-header shadow-sm fixed top-0 w-full z-50">
        <div className="flex flex-row-reverse justify-between items-center py-base w-full max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2">
            <span className="font-headline-md text-headline-md font-bold text-primary">سجل الذهب</span>
            <img src={LOGO_URL} alt="سجل الذهب" className="w-8 h-8 rounded-md object-cover" />
          </div>
          <div className="w-10 h-10" />
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-12 glass-background relative overflow-hidden px-6">
        {/* Background blobs */}
        <div className="absolute -right-20 top-40 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl" />
        <div className="absolute -left-20 bottom-20 w-80 h-80 bg-secondary-container/10 rounded-full blur-3xl" />

        <div className="max-w-md w-full flex flex-col items-center z-10">
          {/* Hero Icon */}
          <div className="mb-section-gap relative">
            <div className="w-32 h-32 bg-white rounded-3xl shadow-[0px_8px_24px_rgba(10,31,68,0.06)] flex items-center justify-center floating-gold border border-surface-container">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 64, fontVariationSettings: "'FILL' 1" }}>savings</span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-primary-container text-on-primary-container p-2 rounded-xl shadow-lg">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
          </div>

          {/* Header Text */}
          <div className="text-center mb-10 space-y-4">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">مرحباً بك في سجل الذهب</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-full break-words">تتبع استثماراتك في الذهب وقيمة محفظتك</p>
          </div>

          {/* Login Card */}
          <div className="w-full bg-white rounded-xl shadow-[0px_8px_24px_rgba(10,31,68,0.06)] border border-surface-container p-6 md:p-8">
            <div className="space-y-6">
              {/* Google Sign-In */}
              <button
                type="button"
                onClick={signInWithGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-4 bg-white border border-outline-variant hover:bg-surface-container-low transition-all duration-300 py-4 px-6 rounded-xl active:scale-95 disabled:opacity-60"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.27.81-.57z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="font-label-md text-label-md text-on-surface font-semibold">المتابعة باستخدام Google</span>
              </button>

              {/* Divider */}
              <div className="relative py-4 flex items-center">
                <div className="flex-grow border-t border-outline-variant" />
                <span className="px-4 font-label-sm text-label-sm text-on-surface-variant bg-white">أو</span>
                <div className="flex-grow border-t border-outline-variant" />
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="البريد الإلكتروني"
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 text-right"
                  required
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="كلمة المرور"
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary focus:border-primary bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 text-right"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-on-primary font-semibold py-4 px-6 rounded-xl hover:opacity-90 transition-all duration-300 active:scale-95 shadow-md disabled:opacity-60"
                >
                  {loading ? 'جاري التحميل...' : mode === 'login' ? 'المتابعة عبر البريد الإلكتروني' : 'إنشاء حساب'}
                </button>
              </form>

              {/* Toggle login/signup */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="font-label-md text-label-md text-on-surface-variant"
                >
                  {mode === 'login' ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
                  <span className="text-primary-container font-semibold hover:underline underline-offset-4 px-1">
                    {mode === 'login' ? 'سجل الآن' : 'تسجيل الدخول'}
                  </span>
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="mt-8 text-center">
              <p className="font-label-sm text-label-sm text-on-surface-variant leading-relaxed">
                بتسجيل الدخول، أنت توافق على{' '}
                <a href="#" className="text-primary hover:underline underline-offset-4">شروط الخدمة</a>
                {' '}و{' '}
                <a href="#" className="text-primary hover:underline underline-offset-4">سياسة الخصوصية</a>
              </p>
            </div>
          </div>

          {/* Feature cards */}
          <div className="mt-section-gap grid grid-cols-2 gap-4 w-full">
            <div className="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-surface-container-high flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-primary mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
              <span className="font-label-sm text-label-sm text-on-surface">آمن تماماً</span>
            </div>
            <div className="bg-white/40 backdrop-blur-sm p-4 rounded-xl border border-surface-container-high flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-primary mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>update</span>
              <span className="font-label-sm text-label-sm text-on-surface">تحديثات فورية</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-container-margin border-t border-outline-variant/30 flex flex-col items-center gap-4 bg-surface">
        <div className="flex gap-6">
          <span className="font-label-sm text-label-sm text-on-surface-variant">عن التطبيق</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">الأسئلة الشائعة</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">الدعم الفني</span>
        </div>
        <p className="font-label-sm text-label-sm text-on-surface-variant opacity-50">© ٢٠٢٦ سجل الذهب. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
