export default function DeleteAccount() {
  return (
    <div dir="rtl" style={{ fontFamily: 'Arial, sans-serif', maxWidth: 780, margin: '0 auto', padding: '40px 24px 80px', color: '#111827', lineHeight: 1.8 }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: '#0A1F44', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <span style={{ color: '#D4AF37', fontSize: 28 }}>🗑️</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0A1F44', marginBottom: 8 }}>حذف الحساب</h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>سجل الذهب — تطبيق Muhammad Zekry</p>
      </div>

      <Section title="مقدمة">
        <p>
          نحن في تطبيق <strong>سجل الذهب</strong> نحترم حقك في إدارة بياناتك بالكامل. تشرح هذه الصفحة
          كيف يمكنك طلب حذف حسابك وجميع البيانات المرتبطة به نهائياً، سواء من داخل التطبيق أو من خلال
          التواصل المباشر.
        </p>
      </Section>

      <Section title="الطريقة الأولى: حذف الحساب من داخل التطبيق (موصى بها)">
        <p>هذه الطريقة الأسرع والأكثر أماناً، ويتم تنفيذ الحذف فوراً:</p>
        <ol>
          <li>افتح تطبيق <strong>سجل الذهب</strong> على جهازك.</li>
          <li>سجّل الدخول إلى حسابك إذا لم تكن مسجلاً بالفعل.</li>
          <li>اضغط على تبويب <strong>«الإعدادات»</strong> في شريط التنقل السفلي.</li>
          <li>انزل لأسفل الشاشة حتى تصل إلى زر <strong>«حذف الحساب»</strong>.</li>
          <li>اضغط على الزر، ثم أكّد رغبتك في الحذف من خلال الرسالتين التحذيريتين المتتاليتين.</li>
          <li>سيتم حذف حسابك وجميع بياناتك فوراً، وسيتم تسجيل خروجك تلقائياً.</li>
        </ol>
      </Section>

      <Section title="الطريقة الثانية: طلب الحذف عبر البريد الإلكتروني">
        <p>
          إذا تعذّر عليك الوصول إلى التطبيق لأي سبب (مثل فقدان كلمة المرور أو حذف التطبيق من جهازك)،
          يمكنك إرسال طلب حذف عبر البريد الإلكتروني:
        </p>
        <ol>
          <li>
            أرسل بريداً إلكترونياً إلى:
            {' '}
            <a href="mailto:muhammadzekry89@gmail.com?subject=طلب حذف حساب" style={{ color: '#D4AF37', fontWeight: 600 }}>
              muhammadzekry89@gmail.com
            </a>
          </li>
          <li>اجعل عنوان الرسالة: <strong>«طلب حذف حساب»</strong>.</li>
          <li>
            تأكد من الإرسال من نفس عنوان البريد الإلكتروني المستخدم لإنشاء الحساب، أو اذكر البريد المسجّل
            في نص الرسالة للتحقق من هويتك.
          </li>
          <li>سيتم الرد عليك خلال <strong>٧ أيام عمل</strong>، وسيتم تنفيذ الحذف فور التحقق من الطلب.</li>
        </ol>
      </Section>

      <Section title="البيانات التي يتم حذفها">
        <p>عند تنفيذ طلب الحذف، تُحذف البيانات التالية نهائياً من قواعد بياناتنا:</p>
        <ul>
          <li><strong>بيانات الحساب:</strong> البريد الإلكتروني، الاسم، صورة الملف الشخصي، ومعرّف المستخدم.</li>
          <li><strong>سجلات الذهب:</strong> جميع المعاملات التي أدخلتها — السبائك، جنيهات الذهب، الكميات، أسعار الشراء، التواريخ، والملاحظات.</li>
          <li><strong>سجل الإشعارات:</strong> جميع الإشعارات السابقة المرتبطة بحسابك.</li>
          <li><strong>رمز جهاز الإشعارات (FCM Token):</strong> لمنع وصول أي إشعارات إليك بعد الحذف.</li>
          <li><strong>الملاحظات والتعليقات:</strong> أي ملاحظات أرسلتها عبر نموذج الملاحظات داخل التطبيق.</li>
          <li><strong>تفضيلات الاستخدام:</strong> الإعدادات المخصصة التي أعددتها داخل التطبيق.</li>
        </ul>
      </Section>

      <Section title="البيانات التي قد يُحتفظ بها">
        <p>
          لا نحتفظ بأي بيانات شخصية بعد الحذف. الاستثناءات الوحيدة:
        </p>
        <ul>
          <li>
            <strong>بيانات إحصائية مجهولة الهوية:</strong> قد نحتفظ ببعض البيانات التجميعية المجهولة
            تماماً (مثل عدد المستخدمين النشطين الكلي، أو إجمالي عدد السجلات المُدخلة على مستوى التطبيق)،
            بحيث لا يمكن من خلالها التعرف عليك أو ربط هذه البيانات بهويتك بأي شكل.
          </li>
          <li>
            <strong>سجلات قانونية:</strong> في حالات نادرة جداً، قد نحتفظ ببعض السجلات إذا طلب منا ذلك
            رسمياً من جهة قضائية مختصة، وفقط في حدود ما يفرضه القانون.
          </li>
        </ul>
        <p>
          باستثناء ما سبق، <strong>لا توجد فترة احتفاظ ببياناتك بعد طلب الحذف</strong> — يتم الحذف فوراً
          عند استخدام الزر داخل التطبيق، أو خلال ٧ أيام عمل عند الطلب عبر البريد الإلكتروني.
        </p>
      </Section>

      <Section title="ماذا يحدث بعد الحذف؟">
        <ul>
          <li>سيتم تسجيل خروجك من جميع الأجهزة فوراً.</li>
          <li>لن تتلقى أي إشعارات جديدة من التطبيق.</li>
          <li>لا يمكن استرجاع أي بيانات بعد الحذف — العملية نهائية ولا يمكن التراجع عنها.</li>
          <li>يمكنك إنشاء حساب جديد بنفس البريد الإلكتروني لاحقاً إذا أردت، ولكنه سيكون حساباً جديداً تماماً دون أي بيانات سابقة.</li>
        </ul>
      </Section>

      <Section title="تواصل معنا">
        <p>
          لأي استفسار يتعلق بحذف الحساب أو معالجة بياناتك، يمكنك التواصل معنا في أي وقت:
        </p>
        <p>
          📧 <a href="mailto:muhammadzekry89@gmail.com" style={{ color: '#D4AF37', fontWeight: 600 }}>
            muhammadzekry89@gmail.com
          </a>
        </p>
        <p>
          للاطلاع على تفاصيل أكثر حول كيفية معالجة بياناتك، يرجى مراجعة
          {' '}
          <a href="/privacy" style={{ color: '#D4AF37', fontWeight: 600 }}>سياسة الخصوصية</a>.
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
