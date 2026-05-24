import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BottomNav } from '@/components/BottomNav';

const VERSION = '1.0.0';

const LOGO_URL = '/app-icon.png';

export default function Settings() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('هل أنت متأكد من تسجيل الخروج؟')) {
      await signOut();
    }
  };

  const items = [
    {
      icon: 'share',
      title: 'مشاركة التطبيق',
      subtitle: 'شارك التميز مع شركائك',
      onClick: () => {
        if (navigator.share) {
          navigator.share({ title: 'سجل الذهب', text: 'تتبع استثماراتك في الذهب مع سجل الذهب!' });
        }
      },
    },
    {
      icon: 'rate_review',
      title: 'إرسال ملاحظات',
      subtitle: 'نحن نقدر رأيك المهني',
      onClick: () => navigate('/feedback'),
    },
  ];

  return (
    <div className="bg-background text-on-surface min-h-screen">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 glass-header shadow-sm">
        <div className="flex flex-row-reverse justify-between items-center px-container-margin py-base w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="font-headline-md text-headline-md font-bold text-primary">سجل الذهب</span>
            <img src={LOGO_URL} alt="سجل الذهب" className="w-10 h-10 rounded-full object-cover" />
          </div>
          <button className="w-10 h-10 flex items-center justify-center text-primary active:scale-95 transition-transform">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      <main className="pt-24 pb-32 px-container-margin max-w-2xl mx-auto">
        {/* Page Title */}
        <div className="mb-section-gap">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-2">الإعدادات</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">قم بتخصيص تجربتك في إدارة أصولك الثمينة.</p>
        </div>

        {/* User Profile Card */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_8px_24px_rgba(10,31,68,0.06)] flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center flex-shrink-0">
            {user?.user_metadata?.avatar_url ? (
              <img
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata.full_name ?? 'profile'}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 36 }}>person</span>
            )}
          </div>
          <div className="text-right">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              {user?.user_metadata?.full_name ?? user?.email ?? 'مستخدم سجل الذهب'}
            </h2>
            <p className="font-label-md text-label-md text-on-surface-variant">{user?.email}</p>
          </div>
        </div>

        {/* Settings List */}
        <div className="bg-surface-container-lowest rounded-xl shadow-[0px_8px_24px_rgba(10,31,68,0.06)] overflow-hidden">
          {items.map((item, i) => (
            <button
              key={item.icon}
              onClick={item.onClick}
              className={`w-full flex items-center justify-between p-6 hover:bg-surface-container-low transition-colors active:scale-[0.98] group ${i < items.length - 1 ? 'inset-divider' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary-container/20 transition-colors">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <div className="text-right">
                  <span className="block font-headline-md text-headline-md text-on-surface">{item.title}</span>
                  <span className="block font-label-sm text-label-sm text-on-surface-variant">{item.subtitle}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_left</span>
            </button>
          ))}
        </div>

        {/* Logout */}
        <div className="mt-8 px-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl text-error font-headline-md text-headline-md border border-error/10 bg-error/5 hover:bg-error/10 active:scale-95 transition-all duration-200"
          >
            <span className="material-symbols-outlined">logout</span>
            تسجيل الخروج
          </button>
        </div>

        {/* Version */}
        <div className="mt-12 text-center">
          <p className="font-label-sm text-label-sm text-on-surface-variant opacity-40">الإصدار {VERSION} • سجل الذهب للأعمال</p>
        </div>
      </main>

      <BottomNav active="settings" />
    </div>
  );
}
