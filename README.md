# تحدي نافس - متوسطة السيح

تطبيق ويب متكامل لتحدي نافس التعليمي لمتوسطة السيح بمحافظة الخرج.

## المميزات

### للطلاب
- ✅ تسجيل الدخول بالاسم
- ✅ أربعة أقسام اختبار (قراءة، رياضيات، علوم، اختبار شامل)
- ✅ اختيار عشوائي لـ 10 أسئلة من كل قسم
- ✅ ترتيب عشوائي للخيارات
- ✅ حساب النتيجة الفورية
- ✅ شهادة نجاح عند تحقيق 80% فأكثر

### للإدارة
- ✅ لوحة تحكم آمنة
- ✅ إضافة وتعديل وحذف الأسئلة
- ✅ عرض الطلاب الناجحين
- ✅ طباعة الأسئلة
- ✅ تنزيل نتائج الناجحين (CSV)
- ✅ مسح جميع الأسئلة

## المتطلبات

- Node.js 18+
- npm أو pnpm

## التثبيت والتشغيل محلياً

```bash
# تثبيت المكتبات
npm install

# تشغيل الخادم
npm run dev

# بناء المشروع
npm run build
```

الموقع سيكون متاحاً على: `http://localhost:3000`

## بيانات تسجيل الدخول للإدارة

- **اسم المستخدم:** nassr
- **كلمة المرور:** Abolama5025$

## النشر على الإنترنت

### باستخدام Docker

```bash
docker build -t nafes-challenge .
docker run -p 3000:3000 nafes-challenge
```

### على منصات النشر

#### Railway
1. ربط المستودع على GitHub
2. ربط Railway بالمستودع
3. تعيين متغيرات البيئة
4. النشر التلقائي

#### Render
1. إنشاء حساب على Render
2. ربط المستودع
3. إنشاء Web Service جديد
4. تعيين الأوامر والمتغيرات
5. النشر

#### Heroku
```bash
heroku login
heroku create nafes-challenge
git push heroku main
```

## هيكل المشروع

```
nafes_challenge_alseeh/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── QuizPage.jsx
│   │   ├── ResultPage.jsx
│   │   ├── AdminLogin.jsx
│   │   └── AdminDashboard.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   └── nafs-logo.png
├── server.js
├── vite.config.js
├── tailwind.config.js
├── package.json
└── Dockerfile
```

## قاعدة البيانات

يستخدم المشروع SQLite مع Prisma ORM

### الجداول الرئيسية
- **Category:** الأقسام (قراءة، رياضيات، علوم، اختبار شامل)
- **Question:** الأسئلة
- **Student:** الطلاب
- **Result:** نتائج الاختبارات
- **Answer:** إجابات الطلاب
- **Admin:** بيانات المسؤول

## API Endpoints

### للطلاب
- `GET /api/categories` - الحصول على الأقسام
- `GET /api/questions/category/:categoryId` - الأسئلة حسب القسم
- `POST /api/results` - حفظ النتيجة

### للإدارة
- `POST /api/admin/login` - تسجيل الدخول
- `POST /api/questions` - إضافة سؤال
- `PUT /api/questions/:id` - تعديل سؤال
- `DELETE /api/questions/:id` - حذف سؤال
- `DELETE /api/categories/:categoryId/questions` - حذف جميع الأسئلة
- `GET /api/results/passed` - الطلاب الناجحون
- `GET /api/results/category/:categoryId` - النتائج حسب القسم

## الترخيص

© 2025 متوسطة السيح - جميع الحقوق محفوظة

## التواصل

للدعم والاستفسارات:
- المعلم: ناصر بن رجيل العنزي
- مدير المدرسة: تركي بن مطير العنزي
