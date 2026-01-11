# EcoTrack API - استكشاف الأخطاء

## المشكلة الحالية: خطأ 403

الخطأ 403 يعني "Forbidden" - أي أن API Key غير صحيح أو طريقة المصادقة خاطئة.

## الحلول المحتملة

### 1. التحقق من API Key

تأكد من أن API Key في `.env.local` صحيح:

```env
ECOTRACK_API_KEY=N23tcUYTeZ2q1m8AHHIa9k6CsxG5t1fNudB5iyvqK9TtGozBlPqUOaPGG0hN
```

### 2. طرق المصادقة المختلفة

قمت بتحديث الكود ليستخدم Query Parameter بدلاً من Bearer Token:

**الطريقة الحالية:**
```
GET /api/orders?api_key=YOUR_KEY
```

**إذا لم تنجح، جرب هذه البدائل:**

#### البديل 1: في Header
```typescript
headers: {
    'X-API-Key': ECOTRACK_API_KEY,
    'Content-Type': 'application/json'
}
```

#### البديل 2: في Body
```typescript
body: JSON.stringify({
    ...ecotrackOrder,
    api_key: ECOTRACK_API_KEY
})
```

#### البديل 3: Authorization Header
```typescript
headers: {
    'Authorization': ECOTRACK_API_KEY,  // بدون Bearer
    'Content-Type': 'application/json'
}
```

### 3. التحقق من Console Logs

افتح Developer Tools في المتصفح (F12) وتحقق من:
- Console tab للرسائل
- Network tab لرؤية الطلب الفعلي المرسل

ستجد رسائل مثل:
```
Sending order to EcoTrack: { url: "...", order_id: "...", hasApiKey: true }
EcoTrack response status: 403
EcoTrack error response: ...
```

### 4. التواصل مع EcoTrack

إذا استمرت المشكلة، قد تحتاج إلى:
1. التحقق من توثيق EcoTrack API الرسمي
2. التواصل مع دعم EcoTrack للحصول على:
   - طريقة المصادقة الصحيحة
   - مثال على طلب صحيح
   - التحقق من أن API Key نشط وصالح

### 5. اختبار API مباشرة

يمكنك اختبار API باستخدام Postman أو curl:

```bash
curl -X POST "https://anderson-ecommerce.ecotrack.dz/api/orders?api_key=YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "TEST123",
    "receiver_name": "اسم تجريبي",
    "receiver_phone": "0555123456",
    "receiver_address": "عنوان تجريبي",
    "city": "الجزائر",
    "amount": 1000,
    "courier": "ANDERSON"
  }'
```

## الخطوات التالية

1. ✅ تحقق من Console في المتصفح
2. ✅ تأكد من صحة API Key
3. ✅ جرب الطلب مباشرة في Postman
4. ⏳ إذا استمرت المشكلة، راجع توثيق EcoTrack أو تواصل مع الدعم
