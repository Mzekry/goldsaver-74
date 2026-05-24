import React from 'react';
import { useGold } from '@/contexts/GoldContext';
import { BottomNav } from '@/components/BottomNav';

const LOGO_URL = '/app-icon.png';

function fmt(n: number) {
  return Math.round(n).toLocaleString('ar-EG');
}

export default function Market() {
  const { goldPrices, refreshPrices } = useGold();

  const lastUpdated = goldPrices.lastUpdated
    ? new Date(goldPrices.lastUpdated).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true })
    : '';

  return (
    <div className="bg-background min-h-screen">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 glass-header shadow-sm">
        <div className="flex flex-row-reverse justify-between items-center px-container-margin py-base w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="font-headline-md text-headline-md font-bold text-primary">سجل الذهب</span>
            <img src={LOGO_URL} alt="سجل الذهب" className="w-10 h-10 rounded-full object-cover" />
          </div>
          <div className="flex items-center gap-4">
            <button className="text-primary hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 px-container-margin max-w-7xl mx-auto min-h-screen">
        {/* Header Section */}
        <section className="mb-section-gap">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">السوق</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-on-surface-variant bg-surface-container-low px-3 py-1.5 rounded-full w-fit">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>schedule</span>
              <span className="font-label-md text-label-md">آخر تحديث: {lastUpdated}</span>
            </div>
            <a
              href="https://gold-era.eg/gold-price/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-primary font-label-sm text-label-sm hover:underline underline-offset-4 transition-opacity hover:opacity-80"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>open_in_new</span>
              المصدر: gold-era.eg
            </a>
          </div>
        </section>

        {/* Live Price Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-section-gap">
          {/* 24K Card */}
          <div className="relative overflow-hidden group p-gutter rounded-xl bg-white shadow-[0px_8px_24px_rgba(10,31,68,0.06)] border border-outline-variant/30 flex flex-col justify-between h-48 active:scale-[0.98] transition-transform duration-300 cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-label-md text-label-md text-on-surface-variant mb-1">ذهب عيار 24</p>
                <h2 className="font-headline-md text-headline-md text-primary-container font-bold">{fmt(goldPrices.k24)} ج.م</h2>
              </div>
              <div className="flex items-center gap-1 text-[#008000] font-label-sm text-label-sm bg-[#008000]/10 px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>trending_up</span>
                <span>+1.2%</span>
              </div>
            </div>
            <div className="mt-auto flex items-center justify-between">
              <span className="text-on-surface-variant/40 font-label-sm text-label-sm">سعر الجرام الواحد</span>
              <span className="material-symbols-outlined text-primary-container/20 text-5xl opacity-50">workspace_premium</span>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-container/5 rounded-full blur-2xl group-hover:bg-primary-container/10 transition-colors" />
          </div>

          {/* 21K Card */}
          <div className="relative overflow-hidden group p-gutter rounded-xl bg-white shadow-[0px_8px_24px_rgba(10,31,68,0.06)] border border-outline-variant/30 flex flex-col justify-between h-48 active:scale-[0.98] transition-transform duration-300 cursor-pointer">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-label-md text-label-md text-on-surface-variant mb-1">ذهب عيار 21</p>
                <h2 className="font-headline-md text-headline-md text-primary-container font-bold">{fmt(goldPrices.k21)} ج.م</h2>
              </div>
              <div className="flex items-center gap-1 text-error font-label-sm text-label-sm bg-error/10 px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>trending_down</span>
                <span>-0.4%</span>
              </div>
            </div>
            <div className="mt-auto flex items-center justify-between">
              <span className="text-on-surface-variant/40 font-label-sm text-label-sm">سعر الجرام الواحد</span>
              <span className="material-symbols-outlined text-primary-container/20 text-5xl opacity-50">hotel_class</span>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary-container/5 rounded-full blur-2xl group-hover:bg-primary-container/10 transition-colors" />
          </div>
        </section>

        {/* Refresh */}
        <div className="flex justify-center mb-section-gap">
          <button
            onClick={refreshPrices}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-primary/30 text-primary font-label-md text-label-md hover:bg-primary/5 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
            تحديث الأسعار
          </button>
        </div>

        {/* Market Tools */}
        <section className="mb-section-gap">
          <div className="flex items-center justify-between mb-gutter">
            <h3 className="font-headline-md text-headline-md text-on-surface">أدوات السوق</h3>
            <span className="px-3 py-1 bg-secondary-container/30 text-secondary font-label-sm text-label-sm rounded-full">قريباً</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: 'monitoring', label: 'تحليل الرسوم' },
              { icon: 'notifications_active', label: 'تنبيهات الأسعار' },
              { icon: 'calculate', label: 'حاسبة الذهب' },
              { icon: 'volunteer_activism', label: 'حاسبة الزكاة' },
            ].map((tool) => (
              <div
                key={tool.icon}
                className="aspect-square glass-card rounded-xl border border-dashed border-outline-variant flex flex-col items-center justify-center gap-3 p-4 opacity-70 cursor-not-allowed"
              >
                <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant">{tool.icon}</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant text-center">{tool.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 p-gutter rounded-xl bg-primary-container/10 border border-primary-container/20 flex items-center gap-4">
            <span className="material-symbols-outlined text-primary text-3xl">info</span>
            <p className="font-body-md text-body-md text-on-primary-container">
              المزيد من الأدوات والتحليلات الاحترافية قادمة قريباً لمساعدتك في اتخاذ قرارات استثمارية أفضل.
            </p>
          </div>
        </section>

        {/* Aesthetic Banner */}
        <section className="relative h-48 rounded-2xl overflow-hidden shadow-sm bg-inverse-surface">
          <div className="absolute inset-0 flex flex-col justify-center p-gutter">
            <h4 className="text-white font-headline-md text-headline-md mb-2">استثمر بذكاء</h4>
            <p className="text-white/80 font-body-md text-body-md max-w-[240px]">تابع تحركات السوق لحظة بلحظة مع أدواتنا المتقدمة.</p>
          </div>
          <span className="material-symbols-outlined absolute left-8 top-1/2 -translate-y-1/2 text-white/15" style={{ fontSize: 96 }}>workspace_premium</span>
        </section>
      </main>

      <BottomNav active="market" />
    </div>
  );
}
