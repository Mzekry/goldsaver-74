import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useGold } from '@/contexts/GoldContext';
import { BottomNav } from '@/components/BottomNav';
import { GoldRecord } from '@/types/gold';

const LOGO_URL = '/app-icon.png';

function fmt(n: number) {
  return Math.round(n).toLocaleString('ar-EG');
}

function recordIcon(r: GoldRecord) {
  return r.type === 'Sabikah' ? 'pentagon' : 'monetization_on';
}

function recordIconFill(r: GoldRecord) {
  return r.type === 'Sabikah' ? "'FILL' 1" : "'FILL' 0";
}

function formatDate(d?: Date) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('ar-EG', { day: '2-digit', month: 'long', year: 'numeric' });
}

const HIDDEN = '••••••';

export default function Index() {
  const { records, goldPrices, currentValue, totalPurchaseValue, refreshPrices, isLoading } = useGold();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const forceEmpty = searchParams.get('demo') === 'empty';
  const [valuesHidden, setValuesHidden] = useState(false);

  const profit = currentValue - totalPurchaseValue;
  const profitPct = totalPurchaseValue > 0 ? ((profit / totalPurchaseValue) * 100).toFixed(1) : '0';
  const totalWeight = records.reduce((s, r) => s + r.quantity, 0);

  const lastUpdated = goldPrices.lastUpdated
    ? new Date(goldPrices.lastUpdated).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true })
    : '';

  const v = (val: string) => (valuesHidden ? HIDDEN : val);

  return (
    <div className="bg-background min-h-screen pb-40">
      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 glass-header shadow-sm">
        <div className="flex flex-row justify-between items-center px-container-margin py-base w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="سجل الذهب" className="w-10 h-10 rounded-lg object-cover" />
            <p className="hidden md:block font-label-md text-label-md font-bold text-on-surface">سجل الذهب</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={refreshPrices}
              className="material-symbols-outlined text-primary hover:opacity-80 transition-opacity active:scale-95"
            >
              share
            </button>
            <button className="material-symbols-outlined text-primary hover:opacity-80 transition-opacity active:scale-95">
              notifications
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-container-margin pt-24">
        {/* Last Update Timestamp */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-2 h-2 bg-primary-container rounded-full live-indicator" />
          <p className="font-label-sm text-label-sm text-on-surface-variant">آخر تحديث للسعر: {lastUpdated}</p>
        </div>

        {/* Empty state */}
        {(records.length === 0 || forceEmpty) && !isLoading && (
          <div className="max-w-md w-full mx-auto text-center space-y-section-gap py-10">
            {/* Illustration */}
            <div className="relative flex justify-center items-center py-10">
              <div className="absolute inset-0 bg-primary-container/10 rounded-full blur-3xl scale-125" />
              <div className="relative floating-gold">
                <div className="w-64 h-64 flex items-center justify-center bg-surface rounded-3xl shadow-[0px_8px_24px_rgba(10,31,68,0.06)] border border-outline-variant/30 relative overflow-hidden">
                  <img
                    src={LOGO_URL}
                    alt="سجل الذهب"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 right-4 bg-primary-container p-3 rounded-xl shadow-lg">
                    <span className="material-symbols-outlined text-on-primary-container text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="space-y-4">
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                ابدأ بتتبع ثروتك من الذهب اليوم
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xs mx-auto">
                قم بتوثيق استثماراتك في الذهب ومراقبة قيمتها السوقية لحظة بلحظة بخصوصية تامة.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate('/add-record')}
                className="bg-primary-container text-on-primary-container font-label-md text-label-md py-4 px-12 rounded-full shadow-lg hover:opacity-90 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
              >
                <span className="material-symbols-outlined">add</span>
                إضافة أول سجل
              </button>
            </div>
          </div>
        )}

        {records.length > 0 && !forceEmpty && (
          <>
            {/* Summary Cards Grid */}
            <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-2xl shadow-[0px_8px_24px_rgba(10,31,68,0.06)] mb-6 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-outline-variant/30 grid grid-cols-1 md:grid-cols-3">
              {/* Portfolio Value */}
              <div className="p-6 flex flex-col justify-center bg-primary-container/10 rounded-t-2xl md:rounded-tr-2xl md:rounded-tl-none md:rounded-bl-none relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-label-md text-label-md text-primary font-bold">القيمة الحالية للمحفظة</p>
                  <button
                    onClick={() => setValuesHidden(!valuesHidden)}
                    className="material-symbols-outlined text-primary/60 hover:text-primary transition-colors active:scale-95 text-[20px]"
                  >
                    {valuesHidden ? 'visibility_off' : 'visibility'}
                  </button>
                </div>
                <div className="flex items-baseline gap-2">
                  <h2 className={`font-headline-xl text-headline-xl font-extrabold text-primary transition-all ${valuesHidden ? 'blur-sm select-none' : ''}`}>
                    {v(fmt(currentValue))}
                  </h2>
                  <span className="font-label-md text-label-md text-primary">ج.م</span>
                </div>
              </div>

              {/* Profit / Loss */}
              <div className="p-6 flex flex-col justify-center">
                <p className="font-label-md text-label-md text-on-surface-variant mb-2 text-right">إجمالي الربح / الخسارة</p>
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined font-bold ${profit >= 0 ? 'text-[#10b981]' : 'text-error'}`}>
                    {profit >= 0 ? 'trending_up' : 'trending_down'}
                  </span>
                  <h2 className={`font-headline-xl text-headline-xl font-bold transition-all ${profit >= 0 ? 'text-[#10b981]' : 'text-error'} ${valuesHidden ? 'blur-sm select-none' : ''}`}>
                    {v((profit >= 0 ? '+' : '') + fmt(profit))}
                  </h2>
                  <span className={`font-label-md text-label-md ${profit >= 0 ? 'text-[#10b981]' : 'text-error'}`}>ج.م</span>
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-2 text-right">
                  {valuesHidden ? '••••' : `${profit >= 0 ? '+' : ''}${profitPct}% من إجمالي التكلفة`}
                </p>
              </div>

              {/* Total Cost */}
              <div className="p-6 flex flex-col justify-center">
                <p className="font-label-md text-label-md text-on-surface-variant mb-2 text-right">تكلفة الشراء الكلية</p>
                <div className="flex items-baseline gap-2">
                  <h2 className={`font-headline-xl text-headline-xl font-bold text-on-surface transition-all ${valuesHidden ? 'blur-sm select-none' : ''}`}>
                    {v(fmt(totalPurchaseValue))}
                  </h2>
                  <span className="font-label-md text-label-md text-on-surface-variant">ج.م</span>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">الوزن</span>
                    <span className={`font-label-md text-label-md font-bold text-primary transition-all ${valuesHidden ? 'blur-sm select-none' : ''}`}>{valuesHidden ? '••••' : `${totalWeight.toFixed(1)} جم`}</span>
                  </div>
                  <div className="w-[1px] h-6 bg-outline-variant/50" />
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">العمليات</span>
                    <span className="font-label-md text-label-md font-bold text-primary">{records.length} سجلات</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Gold Prices */}
            <div className="bg-white/40 backdrop-blur-md border border-white/40 rounded-2xl p-5 mb-section-gap shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary text-[20px] font-bold">analytics</span>
                <h3 className="font-label-md text-label-md font-bold text-on-surface">أسعار الذهب مباشر (EGP)</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 p-4 rounded-xl border border-white/60 flex flex-col items-center shadow-sm hover:-translate-y-0.5 transition-transform">
                  <span className="font-label-sm text-label-sm text-on-surface-variant mb-1">عيار 24</span>
                  <span className={`font-headline-md text-headline-md font-bold text-primary transition-all ${valuesHidden ? 'blur-sm select-none' : ''}`}>
                    {v(fmt(goldPrices.k24))}
                  </span>
                </div>
                <div className="bg-white/80 p-4 rounded-xl border border-white/60 flex flex-col items-center shadow-sm hover:-translate-y-0.5 transition-transform">
                  <span className="font-label-sm text-label-sm text-on-surface-variant mb-1">عيار 21</span>
                  <span className={`font-headline-md text-headline-md font-bold text-primary transition-all ${valuesHidden ? 'blur-sm select-none' : ''}`}>
                    {v(fmt(goldPrices.k21))}
                  </span>
                </div>
              </div>
            </div>

            {/* Records header */}
            <div className="mb-6 flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-on-surface">سجل العمليات</h3>
              <Link to="/wallet" className="text-primary font-label-md text-label-md hover:underline">عرض الكل</Link>
            </div>

            {/* Records list */}
            <div className="space-y-4">
              {records.slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-xl p-4 flex items-center justify-between ios-shadow border border-transparent hover:border-primary-container/30 transition-all cursor-pointer"
                  onClick={() => navigate(`/add-record/${r.id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#d4af37]" style={{ fontVariationSettings: recordIconFill(r) }}>
                        {recordIcon(r)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-label-md text-label-md font-bold text-on-surface">
                          {r.type === 'Sabikah' ? 'سبيكة' : 'جنيه ذهب'}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-container/30 text-on-secondary-container text-[10px] font-bold">
                          {r.karat}K
                        </span>
                      </div>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{formatDate(r.purchaseDate)}</p>
                    </div>
                  </div>
                  <p className={`font-label-md text-label-md font-bold text-on-surface transition-all ${valuesHidden ? 'blur-sm select-none' : ''}`}>
                    {v(`${r.quantity} جم`)}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <BottomNav active="home" />
    </div>
  );
}
