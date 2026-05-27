export default function Privacy() {
  return (
    <div dir="rtl" style={{ fontFamily: 'Arial, sans-serif', maxWidth: 780, margin: '0 auto', padding: '40px 24px 80px', color: '#111827', lineHeight: 1.8 }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: '#0A1F44', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <span style={{ color: '#D4AF37', fontSize: 28 }}>🔒</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0A1F44', marginBottom: 8 }}>سياسة الخصوصية</h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>سجل الذهب — آخر تحديث: مايو 2026</p>
      </div>

      <Section title="مقدمة">
        <p>
          مرحباً بك في تطبيق <strong>سجل الذهب</strong>. نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.
          توضح هذه السياسة كيفية جمع بياناتك واستخدامها وتخزينها عند استخدامك لتطبيقنا.
        </p>
      </Section>

      <Section title="البيانات التي نجمعها">
        <p>عند استخدامك للتطبيق، قد نجمع الأنواع التالية من البيانات:</p>
        <ul>
          <li><strong>بيانات الحساب:</strong> عنوان بريدك الإلكتروني، واسمك الكامل (عند تسجيل الدخول عبر Google أو Apple).</li>
          <li><strong>سجلات الذهب:</strong> البيانات التي تدخلها بنفسك مثل نوع الذهب، الوزن، سعر الشراء، وتاريخ الشراء.</li>
          <li><strong>بيانات الاستخدام:</strong> كيفية تفاعلك مع التطبيق بشكل مجهول الهوية (عبر Firebase Analytics).</li>
          <li><strong>رمز الجهاز (FCM Token):</strong> لإرسال إشعارات الدفع في حال موافقتك على ذلك.</li>
          <li><strong>الملاحظات والتعليقات:</strong> ما ترسله طوعاً عبر نموذج الملاحظات.</li>
        </ul>
      </Section>

      <Section title="كيف نستخدم بياناتك">
        <ul>
          <li>تمكينك من تسجيل الدخول وإدارة حسابك.</li>
          <li>عرض وتخزين سجلات ذهبك بشكل آمن.</li>
          <li>إرسال إشعارات تتعلق بتحركات الأسعار أو تحديثات التطبيق (بموافقتك).</li>
          <li>تحسين أداء التطبيق وتجربة المستخدم استناداً إلى بيانات الاستخدام المجهولة.</li>
          <li>الرد على استفساراتك وملاحظاتك.</li>
        </ul>
      </Section>

      <Section title="مشاركة البيانات مع أطراف ثالثة">
        <p>نحن <strong>لا نبيع بياناتك</strong> لأي طرف ثالث. نعتمد على الخدمات التالية الموثوقة لتشغيل التطبيق:</p>
        <ul>
          <li><strong>Supabase:</strong> لتخزين بياناتك بشكل آمن في قاعدة بيانات مشفرة. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">سياسة الخصوصية</a></li>
          <li><strong>Firebase / Google Analytics:</strong> لتتبع الاستخدام بشكل مجهول وإرسال الإشعارات. <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">سياسة الخصوصية</a></li>
          <li><strong>تسجيل الدخول بـ Google:</strong> لتوفير خيار تسجيل دخول سريع. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">سياسة الخصوصية</a></li>
          <li><strong>تسجيل الدخول بـ Apple:</strong> لتوفير خيار تسجيل دخول خاص على iOS. <a href="https://www.apple.com/legal/privacy" target="_blank" rel="noopener noreferrer">سياسة الخصوصية</a></li>
          <li><strong>Resend:</strong> لإرسال إشعارات البريد الإلكتروني الداخلية. <a href="https://resend.com/privacy" target="_blank" rel="noopener noreferrer">سياسة الخصوصية</a></li>
        </ul>
      </Section>

      <Section title="أمان البيانات">
        <p>
          نتخذ إجراءات أمنية مناسبة لحماية بياناتك، تشمل:
        </p>
        <ul>
          <li>تشفير البيانات أثناء النقل باستخدام HTTPS.</li>
          <li>سياسات أمان على مستوى الصفوف (Row-Level Security) في قاعدة البيانات — لا يمكن لأي مستخدم الاطلاع على بيانات مستخدم آخر.</li>
          <li>المصادقة الآمنة عبر Supabase Auth.</li>
        </ul>
      </Section>

      <Section title="حقوقك">
        <p>يحق لك في أي وقت:</p>
        <ul>
          <li><strong>الاطلاع</strong> على البيانات المخزنة لحسابك.</li>
          <li><strong>تصحيح</strong> أي بيانات غير دقيقة.</li>
          <li><strong>حذف</strong> حسابك وجميع بياناتك المرتبطة به.</li>
          <li><strong>إلغاء الاشتراك</strong> في إشعارات الدفع من إعدادات جهازك.</li>
        </ul>
        <p>لممارسة أي من هذه الحقوق، تواصل معنا عبر البريد الإلكتروني أدناه.</p>
      </Section>

      <Section title="الاحتفاظ بالبيانات">
        <p>
          نحتفظ ببياناتك طالما حسابك نشط. عند حذف حسابك، يتم حذف جميع سجلاتك وبياناتك الشخصية خلال 30 يوماً.
          قد نحتفظ ببعض البيانات المجهولة لأغراض إحصائية.
        </p>
      </Section>

      <Section title="الأطفال">
        <p>
          تطبيق <strong>سجل الذهب</strong> غير موجه للأطفال دون سن 17 عاماً. لا نجمع بيانات من الأطفال عن قصد.
          إذا اكتشفنا أن طفلاً قد أنشأ حساباً، سنحذفه فوراً.
        </p>
      </Section>

      <Section title="التغييرات على هذه السياسة">
        <p>
          قد نحدّث هذه السياسة من وقت لآخر. سنُعلمك بأي تغييرات جوهرية عبر إشعار داخل التطبيق أو بريد إلكتروني.
          استمرارك في استخدام التطبيق بعد التحديث يعني موافقتك على السياسة الجديدة.
        </p>
      </Section>

      <Section title="تواصل معنا">
        <p>إذا كان لديك أي استفسار حول هذه السياسة أو بياناتك، يمكنك التواصل معنا على:</p>
        <p>
          📧 <a href="mailto:muhammadzekry89@gmail.com" style={{ color: '#D4AF37', fontWeight: 600 }}>
            muhammadzekry89@gmail.com
          </a>
        </p>
      </Section>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 56, paddingTop: 24, borderTop: '1px solid #e5e7eb' }}>
        <p style={{ color: '#9ca3af', fontSize: 13 }}>© 2026 سجل الذهب — جميع الحقوق محفوظة</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0A1F44', borderRight: '4px solid #D4AF37', paddingRight: 12, marginBottom: 12 }}>
        {title}
      </h2>
      <div style={{ color: '#374151', fontSize: 15 }}>{children}</div>
    </div>
  );
}
