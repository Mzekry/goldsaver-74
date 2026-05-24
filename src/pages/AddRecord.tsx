import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGold } from '@/contexts/GoldContext';
import { GoldType } from '@/types/gold';

export default function AddRecord() {
  const navigate = useNavigate();
  const { id: recordId } = useParams<{ id?: string }>();
  const { records, addRecord, updateRecord, deleteRecord, isLoading } = useGold();

  const existing = recordId ? records.find((r) => r.id === recordId) : undefined;
  const isEdit = !!existing;

  const [goldType, setGoldType] = useState<GoldType>(existing?.type ?? 'Sabikah');
  const [quantity, setQuantity] = useState(existing?.quantity?.toString() ?? '');
  const [purchasePrice, setPurchasePrice] = useState(existing?.purchasePrice?.toString() ?? '');
  const [purchaseDate, setPurchaseDate] = useState(
    existing?.purchaseDate
      ? new Date(existing.purchaseDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [shopName, setShopName] = useState(existing?.shopName ?? '');
  const [company, setCompany] = useState(existing?.company ?? '');
  const [productionCost, setProductionCost] = useState(existing?.productionCost?.toString() ?? '');
  const [cashback, setCashback] = useState(existing?.cashback?.toString() ?? '');
  const [notes, setNotes] = useState(existing?.notes ?? '');
  // Optional section collapsed by default
  const [showOptional, setShowOptional] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const karat: 21 | 24 = goldType === 'Pound' ? 21 : 24;

  const pricePerGram =
    quantity && purchasePrice && parseFloat(quantity) > 0
      ? (parseFloat(purchasePrice) / parseFloat(quantity)).toFixed(2)
      : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || !purchasePrice) {
      alert('يرجى إدخال الكمية والسعر الإجمالي');
      return;
    }
    setIsSaving(true);
    const payload = {
      type: goldType,
      karat,
      quantity: parseFloat(quantity),
      purchasePrice: parseFloat(purchasePrice),
      purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
      shopName: shopName || undefined,
      company: company || undefined,
      productionCost: productionCost ? parseFloat(productionCost) : undefined,
      cashback: cashback ? parseFloat(cashback) : undefined,
      notes: notes || undefined,
    };
    try {
      if (isEdit && recordId) {
        await updateRecord(recordId, payload);
      } else {
        await addRecord(payload);
      }
      navigate(-1);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!recordId) return;
    if (window.confirm('هل أنت متأكد من حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء.')) {
      await deleteRecord(recordId);
      navigate(-1);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col items-center">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 glass-header shadow-sm border-b border-outline-variant/10">
        <div className="flex flex-row justify-between items-center px-container-margin py-base w-full max-w-7xl mx-auto">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-high transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-primary">arrow_forward</span>
          </button>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">
            {isEdit ? 'تعديل السجل' : 'إضافة سجل جديد'}
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-lg px-container-margin pt-24 pb-40 flex-grow overflow-y-auto">
        <form id="add-record-form" onSubmit={handleSubmit} className="space-y-section-gap">

          {/* ── Mandatory Section ── */}
          <section className="space-y-gutter">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1 h-6 bg-primary rounded-full" />
              <h2 className="font-headline-md text-lg text-primary">البيانات الأساسية</h2>
            </div>

            {/* Gold Type Selector */}
            <div className="space-y-base">
              <label className="font-label-md text-label-md text-on-surface-variant block px-1">نوع الذهب</label>
              <div className="grid grid-cols-2 gap-gutter">
                <button
                  type="button"
                  onClick={() => { setGoldType('Sabikah'); setQuantity(existing?.type === 'Sabikah' ? (existing.quantity?.toString() ?? '') : ''); }}
                  className={`flex flex-col items-center justify-center p-base rounded-xl border-2 transition-all duration-300 ${
                    goldType === 'Sabikah' ? 'border-primary bg-surface-container-high' : 'border-transparent bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-primary mb-1"
                    style={{ fontVariationSettings: goldType === 'Sabikah' ? "'FILL' 1" : "'FILL' 0" }}>
                    pentagon
                  </span>
                  <span className="font-label-md text-label-md">سبيكة</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setGoldType('Pound'); setQuantity('8'); }}
                  className={`flex flex-col items-center justify-center p-base rounded-xl border-2 transition-all duration-300 ${
                    goldType === 'Pound' ? 'border-primary bg-surface-container-high' : 'border-transparent bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-primary mb-1"
                    style={{ fontVariationSettings: goldType === 'Pound' ? "'FILL' 1" : "'FILL' 0" }}>
                    monetization_on
                  </span>
                  <span className="font-label-md text-label-md">جنيه ذهب</span>
                </button>
              </div>
            </div>

            {/* Quantity & Price */}
            <div className="grid grid-cols-2 gap-gutter">
              <div className="space-y-base">
                <label className="font-label-md text-label-md text-on-surface-variant block px-1" htmlFor="quantity">
                  الكمية (جرام)
                </label>
                {goldType === 'Pound' ? (
                  <div className="h-14 bg-surface-container rounded-xl px-4 flex items-center justify-between border-2 border-primary/20">
                    <span className="font-label-sm text-label-sm text-primary/60">ثابت</span>
                    <span className="font-body-md text-on-surface font-bold">٨ جم</span>
                  </div>
                ) : (
                  <div className="relative flex items-center">
                    <input id="quantity" type="number" step="any" value={quantity}
                      onChange={(e) => setQuantity(e.target.value)} placeholder="0.00" required
                      className="w-full h-14 bg-surface-container rounded-xl px-4 border-none focus:ring-2 focus:ring-primary-container font-body-md text-right" />
                    <span className="absolute left-4 text-outline font-label-sm text-label-sm">g</span>
                  </div>
                )}
              </div>
              <div className="space-y-base">
                <label className="font-label-md text-label-md text-on-surface-variant block px-1" htmlFor="total-price">
                  إجمالي السعر
                </label>
                <div className="relative flex items-center">
                  <input id="total-price" type="number" value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)} placeholder="0.00" required
                    className="w-full h-14 bg-surface-container rounded-xl px-4 border-none focus:ring-2 focus:ring-primary-container font-body-md text-right" />
                  <span className="absolute left-4 text-outline font-label-sm text-label-sm">EGP</span>
                </div>
              </div>
            </div>

            {/* Calculated PPG hint */}
            {pricePerGram && (
              <p className="font-label-sm text-label-sm text-primary px-1 text-right">
                سعر الجرام المحسوب: {pricePerGram} EGP/g
              </p>
            )}

            {/* Purchase Date */}
            <div className="space-y-base">
              <label className="font-label-md text-label-md text-on-surface-variant block px-1" htmlFor="purchase-date">
                تاريخ الشراء
              </label>
              <div className="relative flex items-center">
                <input id="purchase-date" type="date" value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)} required
                  className="w-full h-14 bg-surface-container rounded-xl px-4 border-none focus:ring-2 focus:ring-primary-container font-body-md text-right" />
                <span className="absolute left-4 text-outline material-symbols-outlined pointer-events-none">calendar_today</span>
              </div>
            </div>
          </section>

          {/* ── Optional Section (collapsed by default) ── */}
          <section>
            {/* Toggle header */}
            <button
              type="button"
              onClick={() => setShowOptional(!showOptional)}
              className="w-full flex items-center justify-between gap-3 bg-surface-container rounded-xl px-4 py-4 active:scale-[0.98] transition-transform"
            >
              <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
                {showOptional ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-headline-md text-[15px] font-semibold text-on-surface-variant">تفاصيل إضافية (اختياري)</span>
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">add_circle</span>
              </div>
            </button>

            {showOptional && (
              <div className="space-y-gutter mt-gutter">
                {/* Shop & Brand */}
                <div className="grid grid-cols-2 gap-gutter">
                  <div className="space-y-base">
                    <label className="font-label-md text-label-md text-on-surface-variant block px-1">اسم المحل</label>
                    <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)}
                      placeholder="مثال: فرع BTC"
                      className="w-full h-12 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 focus:border-primary transition-all text-sm text-right" />
                  </div>
                  <div className="space-y-base">
                    <label className="font-label-md text-label-md text-on-surface-variant block px-1">الشركة / العلامة</label>
                    <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                      placeholder="مثال: SAM أو BTC"
                      className="w-full h-12 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 focus:border-primary transition-all text-sm text-right" />
                  </div>
                </div>

                {/* Costs */}
                <div className="grid grid-cols-2 gap-gutter">
                  <div className="space-y-base">
                    <label className="font-label-md text-label-md text-on-surface-variant block px-1">المصنعية (الإجمالية)</label>
                    <div className="relative flex items-center">
                      <input type="number" value={productionCost} onChange={(e) => setProductionCost(e.target.value)}
                        placeholder="0.00"
                        className="w-full h-12 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 focus:border-primary transition-all text-sm text-right" />
                      <span className="absolute left-3 text-outline text-[10px]">EGP</span>
                    </div>
                  </div>
                  <div className="space-y-base">
                    <label className="font-label-md text-label-md text-on-surface-variant block px-1">كاش باك المصنعية</label>
                    <div className="relative flex items-center">
                      <input type="number" value={cashback} onChange={(e) => setCashback(e.target.value)}
                        placeholder="0.00"
                        className="w-full h-12 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 focus:border-primary transition-all text-sm text-right" />
                      <span className="absolute left-3 text-outline text-[10px]">EGP</span>
                    </div>
                  </div>
                </div>

                {/* PPG calculated */}
                <div className="space-y-base mt-4">
                  <label className="font-label-md text-label-md text-on-surface-variant block px-1">سعر الجرام (عند الشراء)</label>
                  <div className="relative flex items-center">
                    <input type="number" value={pricePerGram} readOnly placeholder="0.00"
                      className="w-full h-12 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 text-sm text-right cursor-not-allowed opacity-70" />
                    <span className="absolute left-3 text-outline text-[10px]">EGP/g</span>
                  </div>
                  <p className="text-[10px] text-outline px-1 text-right">حقل موصى به لمتابعة أداء استثمارك بدقة</p>
                </div>

                {/* Notes */}
                <div className="space-y-base">
                  <label className="font-label-md text-label-md text-on-surface-variant block px-1">ملاحظات</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                    placeholder="أي تفاصيل أخرى تود تذكرها..."
                    className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 focus:border-primary transition-all text-sm resize-none h-24 text-right" />
                </div>
              </div>
            )}
          </section>
        </form>

        {/* Delete button — edit mode only */}
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            className="w-full mt-8 flex items-center justify-center gap-3 py-4 rounded-xl text-error font-label-md text-label-md font-semibold border border-error/20 bg-error/5 hover:bg-error/10 active:scale-95 transition-all duration-200"
          >
            حذف هذا السجل
            <span className="material-symbols-outlined text-error">delete</span>
          </button>
        )}
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 w-full bg-surface/90 glass-header border-t border-outline-variant/20 z-50">
        <div className="max-w-lg mx-auto p-container-margin">
          <button
            form="add-record-form"
            type="submit"
            disabled={isSaving || isLoading}
            className="w-full h-16 bg-primary-container text-on-primary-container font-headline-md text-headline-md rounded-xl flex items-center justify-center gap-3 shadow-lg hover:brightness-110 active:scale-95 transition-all duration-200 disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <span className="material-symbols-outlined">sync</span>
                جاري الحفظ...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
                حفظ السجل
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
