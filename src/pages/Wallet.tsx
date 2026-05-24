import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGold } from '@/contexts/GoldContext';
import { BottomNav } from '@/components/BottomNav';
import { GoldRecord } from '@/types/gold';

const LOGO_URL = '/app-icon.png';

function formatDate(d?: Date) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('ar-EG', { day: '2-digit', month: 'long', year: 'numeric' });
}

function recordIcon(r: GoldRecord) {
  return r.type === 'Sabikah' ? 'pentagon' : 'monetization_on';
}

function recordIconFill(r: GoldRecord) {
  return r.type === 'Sabikah' ? "'FILL' 1" : "'FILL' 0";
}

function recordLabel(r: GoldRecord) {
  return r.type === 'Sabikah' ? `سبيكة ${r.karat}K` : 'جنيه ذهب';
}

export default function Wallet() {
  const { records } = useGold();
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-surface min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 glass-header bg-surface/80 shadow-sm">
        <div className="flex justify-between items-center px-container-margin h-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="سجل الذهب" className="w-8 h-8 rounded-md object-cover" />
            <h1 className="font-headline-md text-headline-md font-bold text-primary">المحفظة</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95">
              <span className="material-symbols-outlined text-on-surface-variant">search</span>
            </button>
            <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors active:scale-95">
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 px-container-margin max-w-7xl mx-auto space-y-section-gap">
        {/* Summary */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-xl ios-shadow flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-on-surface-variant font-label-md text-label-md">إجمالي السجلات</span>
              <span className="text-headline-lg font-headline-lg text-secondary">{records.length}</span>
            </div>
            <div className="w-12 h-12 rounded-full bg-secondary-container/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
            </div>
          </div>
        </section>

        {/* Transaction Log */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-headline-md text-headline-md text-on-surface">سجل العمليات</h2>
            <button className="text-primary font-label-md text-label-md flex items-center gap-1 hover:underline">
              تصفية
              <span className="material-symbols-outlined text-sm">filter_list</span>
            </button>
          </div>

          {records.length === 0 && (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-on-surface-variant/40" style={{ fontSize: 64 }}>inventory_2</span>
              <p className="font-body-md text-body-md text-on-surface-variant mt-4">لا توجد سجلات بعد</p>
            </div>
          )}

          <div className="space-y-4">
            {records.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm border border-transparent hover:border-primary-container/30 transition-all cursor-pointer"
                onClick={() => navigate(`/add-record/${r.id}`)}
              >
                {/* icon + info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center">
                    <span
                      className="material-symbols-outlined text-[28px] text-[#d4af37]"
                      style={{ fontVariationSettings: recordIconFill(r) }}
                    >
                      {recordIcon(r)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-label-md text-label-md font-bold text-on-surface">{recordLabel(r)}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-container/30 text-on-secondary-container text-[10px] font-bold">
                        {r.karat}K
                      </span>
                    </div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">{formatDate(r.purchaseDate)}</p>
                  </div>
                </div>
                {/* weight */}
                <p className="font-label-md text-label-md font-bold text-on-surface">{r.quantity} جم</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav active="wallet" />
    </div>
  );
}
