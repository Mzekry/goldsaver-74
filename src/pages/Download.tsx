import { useEffect } from "react";
import { TrendingUp, Calculator, ShieldCheck, Coins, Sparkles } from "lucide-react";

/**
 * Arabic (RTL) download landing page — /download
 *
 * On-brand marketing page for "سجل الذهب": navy + gold palette, prominent logo
 * and title, app screenshots, and store-download CTAs. iOS links to the live
 * App Store listing; Android is shown as "قريباً" until the Play listing is live.
 */

const APP_STORE_URL =
  "https://apps.apple.com/eg/app/gold-wealth-%D8%B3%D8%AC%D9%84-%D8%A7%D9%84%D8%B0%D9%87%D8%A8/id6772691765";

const NAVY = "#0A1F44";
const GOLD = "#D4AF37";

const features = [
  {
    icon: TrendingUp,
    title: "قيمة لحظية لمحفظتك",
    body: "تابِع القيمة الحالية لذهبك وأرباحك أولًا بأول مع تحديث أسعار السوق تلقائيًا.",
  },
  {
    icon: Calculator,
    title: "حاسبة زكاة الذهب",
    body: "احسب زكاتك بدقّة وفق النِّصاب والحَول، بطريقة استرشادية واضحة وموثوقة.",
  },
  {
    icon: ShieldCheck,
    title: "خصوصية تامّة",
    body: "بياناتك مشفّرة وآمنة، ويمكنك إخفاء قيمك ونوع ذهبك عن أعين المتطفّلين بلمسة.",
  },
  {
    icon: Coins,
    title: "كل أنواع الذهب",
    body: "سبائك، جنيهات ذهب، ومشغولات بمختلف العيارات (18 و21 و24) في مكان واحد.",
  },
];

const shots = [
  { src: "/screenshots/home.jpg", caption: "لوحة تجمع كل ثروتك من الذهب" },
  { src: "/screenshots/wallet.jpg", caption: "سجل كامل لكل عملية شراء" },
  { src: "/screenshots/add.jpg", caption: "أضف مقتنياتك في ثوانٍ" },
];

export default function Download() {
  useEffect(() => {
    const prev = document.title;
    document.title = "حمّل تطبيق سجل الذهب";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div
      dir="rtl"
      style={{ fontFamily: "'Tajawal', 'Manrope', sans-serif" }}
      className="min-h-screen bg-[#f9f7f2] text-[#111827] overflow-x-hidden"
    >
      {/* ───────── Hero ───────── */}
      <header className="relative overflow-hidden">
        {/* navy gradient backdrop + gold glow */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% -10%, rgba(212,175,55,0.22), transparent 60%), linear-gradient(160deg, ${NAVY} 0%, #0d2a5c 55%, #081834 100%)`,
          }}
        />
        {/* soft gold orbs */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        <div className="absolute top-40 -left-24 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 pt-14 pb-20 md:pt-20 md:pb-28">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* copy */}
            <div className="text-center md:text-right">
              <img
                src="/app-icon.png"
                alt="شعار سجل الذهب"
                width={104}
                height={104}
                className="mx-auto md:mx-0 h-24 w-24 rounded-[24px] shadow-2xl ring-1 ring-white/10"
                style={{ boxShadow: "0 18px 48px rgba(0,0,0,0.45)" }}
              />

              <h1
                className="mt-7 text-5xl md:text-6xl font-extrabold leading-tight"
                style={{
                  background: `linear-gradient(180deg, #F6E27A 0%, ${GOLD} 60%, #B8902A 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                سجل الذهب
              </h1>

              <p className="mt-4 text-xl md:text-2xl font-bold text-white">
                محفظتك الذهبية… بين يديك
              </p>

              <p className="mx-auto md:mx-0 mt-4 max-w-md text-base md:text-lg leading-8 text-blue-100/80">
                سجّل مقتنياتك من الذهب، وتابِع قيمتها السوقية وأرباحك لحظيًا، واحسب
                زكاتك بثقة — كل ذلك في تطبيق واحد آمن وبسيط.
              </p>

              {/* CTAs */}
              <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap md:justify-start justify-center">
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="حمّل من App Store"
                  className="transition-transform duration-200 hover:scale-105 focus:outline-none"
                >
                  <img
                    src="/badges/app-store-ar.svg"
                    alt="حمّل من App Store"
                    className="h-[54px] w-auto"
                  />
                </a>

                <ComingSoonPlayBadge />
              </div>

              <p className="mt-4 text-sm text-blue-100/60">
                متاح الآن على iPhone — ونسخة أندرويد قادمة قريبًا.
              </p>
            </div>

            {/* hero phone */}
            <div className="relative flex justify-center md:justify-start">
              <div className="floating-gold">
                <PhoneFrame src="/screenshots/home.jpg" />
              </div>
            </div>
          </div>
        </div>

        {/* gentle curve into body */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#f9f7f2] [clip-path:ellipse(75%_100%_at_50%_100%)]" />
      </header>

      {/* ───────── Features ───────── */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/12 px-4 py-1.5 text-sm font-bold text-[#9a7d1f]">
            <Sparkles className="h-4 w-4" />
            لماذا سجل الذهب؟
          </span>
          <h2 className="mt-5 text-3xl md:text-4xl font-extrabold text-[#0A1F44]">
            كل ما تحتاجه لإدارة ذهبك
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-[#eee6cf] bg-white p-6 text-right shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:border-[#D4AF37]/40"
            >
              <div
                className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: "rgba(212,175,55,0.12)" }}
              >
                <f.icon className="h-6 w-6 text-[#B8902A]" />
              </div>
              <h3 className="text-lg font-bold text-[#0A1F44]">{f.title}</h3>
              <p className="mt-2 text-[15px] leading-7 text-[#6b7280]">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Screenshots ───────── */}
      <section className="relative bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0A1F44]">
              نظرة داخل التطبيق
            </h2>
            <p className="mt-3 text-[#6b7280]">
              تصميم عربي أنيق وبسيط، مصمَّم خصيصًا لمتابعة ذهبك.
            </p>
          </div>

          <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {shots.map((s) => (
              <figure key={s.src} className="flex flex-col items-center">
                <PhoneFrame src={s.src} />
                <figcaption className="mt-6 text-center text-base font-bold text-[#0A1F44]">
                  {s.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Final CTA ───────── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 120%, rgba(212,175,55,0.20), transparent 55%), linear-gradient(140deg, ${NAVY}, #0d2a5c)`,
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            ابدأ بتتبّع ذهبك اليوم
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-8 text-blue-100/80">
            انضمّ لمستخدمي سجل الذهب وامتلك صورة واضحة عن ثروتك الذهبية في أي وقت.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="حمّل من App Store"
              className="transition-transform duration-200 hover:scale-105"
            >
              <img
                src="/badges/app-store-ar.svg"
                alt="حمّل من App Store"
                className="h-[54px] w-auto"
              />
            </a>
            <ComingSoonPlayBadge />
          </div>
        </div>
      </section>

      {/* ───────── Footer ───────── */}
      <footer className="bg-[#081834] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-6 text-center">
          <div className="flex items-center gap-3">
            <img
              src="/app-icon.png"
              alt="سجل الذهب"
              className="h-9 w-9 rounded-lg"
            />
            <span className="text-lg font-bold text-[#D4AF37]">سجل الذهب</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-blue-100/70">
            <a href="/privacy" className="transition-colors hover:text-[#D4AF37]">
              سياسة الخصوصية
            </a>
            <a href="/terms" className="transition-colors hover:text-[#D4AF37]">
              شروط الخدمة
            </a>
            <a
              href="mailto:muhammadzekry89@gmail.com"
              className="transition-colors hover:text-[#D4AF37]"
            >
              تواصل معنا
            </a>
          </nav>
          <p className="text-sm text-blue-100/40">
            © 2026 سجل الذهب — جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ───────── Phone frame ───────── */
function PhoneFrame({ src }: { src: string }) {
  return (
    <div
      className="relative w-[230px] sm:w-[250px] rounded-[2.4rem] border-[6px] border-[#0A1F44] bg-[#0A1F44] p-0 shadow-2xl"
      style={{ boxShadow: "0 24px 60px rgba(10,31,68,0.30)" }}
    >
      {/* notch */}
      <div className="absolute left-1/2 top-0 z-10 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-[#0A1F44]" />
      <img
        src={src}
        alt="لقطة من التطبيق"
        className="block w-full rounded-[2rem]"
        loading="lazy"
      />
    </div>
  );
}

/* ───────── Google Play "coming soon" badge ───────── */
function ComingSoonPlayBadge() {
  return (
    <div className="relative inline-flex cursor-default select-none" aria-disabled="true">
      {/* "قريباً" ribbon */}
      <span className="absolute -top-2 -left-2 z-10 rounded-full bg-[#D4AF37] px-2.5 py-0.5 text-[11px] font-bold text-[#0A1F44] shadow">
        قريبًا
      </span>
      <div
        className="flex h-[54px] items-center gap-3 rounded-[10px] border border-[#9aa0a6] bg-black px-4 opacity-70"
        dir="ltr"
      >
        {/* Google Play triangle */}
        <svg viewBox="0 0 512 512" className="h-7 w-7" aria-hidden="true">
          <path fill="#00D3FF" d="M48 32 308 256 48 480c-9 5-20-2-20-13V45c0-11 11-18 20-13z" />
          <path fill="#00F076" d="M48 32c4-2 9-2 13 1l247 142-58 58L48 32z" />
          <path fill="#FF3A44" d="M250 291l58 58L61 479c-4 3-9 3-13 1l202-189z" />
          <path fill="#FFC700" d="M308 174l84 48c14 8 14 28 0 36l-84 48-58-58 58-58z" />
        </svg>
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] font-medium text-white/80">قريبًا على</span>
          <span className="mt-0.5 text-lg font-semibold tracking-wide text-white">
            Google Play
          </span>
        </div>
      </div>
    </div>
  );
}
