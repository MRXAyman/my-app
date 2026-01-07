This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




قم بتحديث وتطوير الواجهة الرئيسية للموقع (Landing Page) ونظام إدارة العلامة التجارية في لوحة التحكم باستخدام  مع الالتزام بالمعايير التالية:

1. تصميم الصفحة الرئيسية (Modern & Clean UI):
الهوية البصرية: اعتماد تصميم عصري (Modern Minimalism) مع مساحات بيضاء مريحة للعين، واستخدام خطوط عربية أنيقة (مثل Tajawal أو Cairo).

قسم الـ Hero: واجهة جذابة تحتوي على (عنوان رئيسي قوي، وصف قصير، زر دعوة لاتخاذ إجراء CTA واضح، وصورة مميزة للمنتجات الأكثر مبيعاً).

عرض المنتجات: استخدام نظام الشبكة (Grid System) لعرض المنتجات مع تأثيرات حركية خفيفة (Hover Effects).

الأقسام الإضافية: إضافة قسم 'لماذا نحن؟' (مثلاً: توصيل سريع لـ 58 ولاية، دفع عند الاستلام، جودة مضمونة) باستخدام أيقونات عصرية.

التوافق التام: يجب أن تكون الصفحة سريعة جداً ومحسنة لمحركات البحث (SEO Optimized) ومتجاوبة 100% مع الهواتف الذكية.

2. نظام إدارة العلامة التجارية (Brand Management System):
لوحة التحكم (Settings Page): إضافة قسم خاص بإعدادات الموقع العامة يتيح للمدير القيام بما يلي:

تغيير اسم الموقع: حقل نصي لتعديل (Site Title) الذي يظهر في المتصفح وفي ترويسة الموقع.

إدارة الشعار (Logo Management): خاصية رفع شعار الموقع (Header Logo) وشعار مصغر للمتصفح (Favicon).

التخزين الديناميكي: عند رفع شعار جديد، يجب استبدال القديم في Supabase Storage وتحديث الرابط في قاعدة البيانات فوراً.

التحديث اللحظي: يجب أن ينعكس تغيير الاسم والشعار في كامل صفحات الموقع (Frontend) تلقائياً بمجرد الحفظ.

