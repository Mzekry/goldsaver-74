import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const CATEGORIES = [
  { value: 'bug',        label: 'مشكلة تقنية',   icon: 'bug_report' },
  { value: 'suggestion', label: 'اقتراح تحسين',   icon: 'lightbulb' },
  { value: 'general',    label: 'تعليق عام',       icon: 'chat_bubble' },
  { value: 'other',      label: 'أخرى',            icon: 'more_horiz' },
];

export default function Feedback() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [rating, setRating]       = useState(0);
  const [hovered, setHovered]     = useState(0);
  const [category, setCategory]   = useState('');
  const [message, setMessage]     = useState('');
  const [email, setEmail]         = useState(user?.email ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      // 1. Save to Supabase
      const { error } = await supabase.from('feedback').insert({
        user_id:  user?.id ?? null,
        email:    email || null,
        category: category || null,
        rating:   rating || null,
        message:  message.trim(),
      });
      if (error) throw error;

      // 2. Trigger email notification via Edge Function
      await supabase.functions.invoke('notify-feedback', {
        body: { email, category, rating, message: message.trim() },
      });

      setSubmitted(true);
    } catch (err: any) {
      toast({
        title: 'فشل الإرسال',
        description: 'حدث خطأ أثناء إرسال ملاحظتك، حاول مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-primary-container/20 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 52, fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-3">شكراً لك!</h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-xs mb-10">
          تم إرسال ملاحظتك بنجاح. رأيك يساعدنا على تحسين التطبيق.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-primary-container text-on-primary-container font-label-md text-label-md py-3 px-8 rounded-full hover:opacity-90 active:scale-95 transition-all"
        >
          العودة للإعدادات
        </button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 glass-header shadow-sm">
        <div className="flex flex-row justify-between items-center px-container-margin py-base w-full max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-primary">arrow_forward</span>
          </button>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">إرسال ملاحظات</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="pt-24 pb-16 px-container-margin max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Star Rating */}
          <section className="bg-white rounded-2xl p-6 shadow-[0px_4px_16px_rgba(10,31,68,0.06)] border border-outline-variant/20 text-center">
            <p className="font-label-md text-label-md text-on-surface-variant mb-4">كيف تقيّم تجربتك؟</p>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="transition-transform active:scale-90 hover:scale-110"
                >
                  <span
                    className="material-symbols-outlined text-4xl"
                    style={{
                      color: star <= (hovered || rating) ? '#D4AF37' : '#e2e8f0',
                      fontVariationSettings: star <= (hovered || rating) ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    star
                  </span>
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="mt-3 font-label-sm text-label-sm text-primary">
                {['', 'سيء جداً', 'سيء', 'مقبول', 'جيد', 'ممتاز!'][rating]}
              </p>
            )}
          </section>

          {/* Category */}
          <section>
            <p className="font-label-md text-label-md text-on-surface-variant mb-3 px-1">نوع الملاحظة</p>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                    category === c.value
                      ? 'border-primary bg-primary-container/10'
                      : 'border-outline-variant/30 bg-white'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[22px] ${category === c.value ? 'text-primary' : 'text-on-surface-variant'}`}
                    style={{ fontVariationSettings: category === c.value ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {c.icon}
                  </span>
                  <span className={`font-label-md text-label-md ${category === c.value ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>
                    {c.label}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Message */}
          <section>
            <p className="font-label-md text-label-md text-on-surface-variant mb-3 px-1">
              رسالتك <span className="text-error">*</span>
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب ملاحظتك أو مقترحك هنا..."
              required
              rows={5}
              className="w-full bg-white border border-outline-variant/30 rounded-xl p-4 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface font-body-md text-body-md resize-none text-right"
            />
            <p className="text-left font-label-sm text-label-sm text-on-surface-variant/50 mt-1 px-1">
              {message.length} / 500
            </p>
          </section>

          {/* Email */}
          <section>
            <p className="font-label-md text-label-md text-on-surface-variant mb-3 px-1">بريدك الإلكتروني (للرد عليك)</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full bg-white border border-outline-variant/30 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-on-surface font-body-md text-right"
            />
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !message.trim()}
            className="w-full h-14 bg-primary-container text-on-primary-container font-headline-md text-headline-md rounded-xl flex items-center justify-center gap-3 shadow-md hover:brightness-110 active:scale-95 transition-all duration-200 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                جاري الإرسال...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                إرسال الملاحظة
              </>
            )}
          </button>

        </form>
      </main>
    </div>
  );
}
