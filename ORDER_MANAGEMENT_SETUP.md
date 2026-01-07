# Advanced Order Management Dashboard - Setup Guide

## 📋 Overview

This update transforms the orders page into a comprehensive order management system specifically designed for Algerian COD e-commerce operations.

## 🚀 New Features

### 1. **Intelligent Status Workflow**
- ✅ `pending` - New orders awaiting confirmation
- ✅ `no_answer_1`, `no_answer_2`, `no_answer_3` - Call attempt tracking
- ✅ `confirmed` - Customer confirmed via phone
- ✅ `shipped` - Sent to delivery company
- ✅ `delivered` - Successfully delivered
- ✅ `returned` - Customer refused/not available
- ✅ `cancelled` - Fake/cancelled orders

### 2. **KPI Dashboard**
- Total orders count
- Delivery success rate
- Net profit calculation
- Top performing wilayas

### 3. **Advanced Filtering**
- Filter by wilaya (all 58 Algerian wilayas)
- Filter by shipping company
- Filter by delivery location (home/desk)
- Date range filtering
- Combined filters support

### 4. **Duplicate Order Detection**
- Automatic detection of orders with same phone number within 24 hours
- Visual warning alerts
- Previous order details display

### 5. **Order Details Dialog**
- Complete customer information
- Product list with images
- Pricing breakdown
- Call attempt history
- Notes management
- Quick actions (call, print invoice)

### 6. **Invoice Printing**
- Print-ready shipping labels
- Customer and product details
- Barcode-ready format
- Professional Arabic layout

### 7. **Real-time Updates**
- Live order status changes
- Automatic refresh across browser tabs
- Optimistic UI updates

## 📦 Installation Steps

### Step 1: Apply Database Migration

Run the SQL migration to add new fields to your orders table:

```bash
# Option 1: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `order_schema_update.sql`
4. Paste and run the SQL

# Option 2: Using Supabase CLI (if installed)
supabase db push
```

The migration adds:
- `call_attempts` (INTEGER) - Number of call attempts
- `call_notes` (TEXT) - Notes from call attempts
- `shipping_company` (TEXT) - Delivery company name
- `delivery_location` (TEXT) - Home or desk delivery
- `notes` (TEXT) - General order notes
- `last_status_update` (TIMESTAMP) - Last status change timestamp
- Performance indexes for filtering

### Step 2: Install Dependencies (if needed)

All required dependencies are already in your `package.json`. If you encounter any issues, run:

```bash
npm install
```

### Step 3: Start Development Server

```bash
npm run dev
```

### Step 4: Access the Orders Page

Navigate to: `http://localhost:3000/admin/orders`

## 🎯 Usage Guide

### Managing Orders

1. **View Orders by Status**
   - Click on status tabs at the top to filter orders
   - Each tab shows the count of orders in that status

2. **Update Order Status**
   - Use the dropdown in the "تحديث الحالة" column
   - Status updates in real-time across all open tabs

3. **View Order Details**
   - Click the "عرض" (View) button
   - See complete order information
   - Add notes and track call attempts
   - Print shipping label

4. **Call Customer**
   - Click the phone icon to initiate a call
   - Works on mobile devices with phone capability

5. **Filter Orders**
   - Click "فلترة متقدمة" to show advanced filters
   - Combine multiple filters for precise results
   - Clear all filters with one click

6. **Export Orders**
   - Click "تصدير" to download orders as CSV
   - Includes all visible orders based on current filters

### Call Attempt Workflow

1. When a customer doesn't answer:
   - Update status to "لم يرد 1"
   - Add notes in the order details dialog
   - Try again later

2. After second attempt:
   - Update to "لم يرد 2"
   - Add more notes

3. After third attempt:
   - Update to "لم يرد 3"
   - Consider marking as cancelled if no response

4. When customer confirms:
   - Update to "مؤكد" (Confirmed)
   - Add shipping company information

### Duplicate Order Handling

When you see a yellow warning alert:
1. Review the previous order(s) details
2. Check if it's a legitimate repeat customer or spam
3. Contact customer to verify
4. Mark as cancelled if it's spam

## 🔧 Customization

### Adding Shipping Companies

Edit `src/components/admin/OrderFilters.tsx`:

```typescript
const SHIPPING_COMPANIES = ['Yalidine', 'ZR Express', 'Procolis', 'Maystro Delivery', 'Your Company']
```

### Adjusting Duplicate Detection Window

Edit `src/components/admin/DuplicateOrderAlert.tsx`:

```typescript
const found = await detectDuplicateOrders(
    order.customer_info.phone,
    order.id,
    48 // Change to 48 hours instead of 24
)
```

### Customizing Status Colors

Edit `src/components/admin/StatusBadge.tsx` to change badge colors and labels.

## 📊 KPI Calculations

- **Delivery Rate**: (Delivered Orders / Total Completed Orders) × 100
- **Net Profit**: Sum of all delivered order amounts
- **Top Wilayas**: Sorted by total revenue from delivered orders

## 🐛 Troubleshooting

### Orders not showing
- Check if database migration was applied successfully
- Verify Supabase connection in `.env.local`
- Check browser console for errors

### Real-time updates not working
- Ensure Supabase Realtime is enabled in your project
- Check network connection
- Verify RLS policies allow read access

### Duplicate detection not working
- Verify the phone number index was created
- Check if orders have `customer_info.phone` field populated

## 📝 Files Created/Modified

### New Files
- `order_schema_update.sql` - Database migration
- `src/hooks/use-orders.ts` - Order management hook
- `src/lib/order-utils.ts` - Utility functions
- `src/components/admin/OrderKPICards.tsx` - KPI dashboard
- `src/components/admin/OrderDetailsDialog.tsx` - Order details modal
- `src/components/admin/OrderStatusUpdater.tsx` - Status dropdown
- `src/components/admin/OrderFilters.tsx` - Advanced filters
- `src/components/admin/DuplicateOrderAlert.tsx` - Duplicate detection
- `src/components/ui/alert.tsx` - Alert component
- `src/components/ui/dialog.tsx` - Dialog component

### Modified Files
- `src/components/admin/StatusBadge.tsx` - Added new statuses
- `src/app/(admin)/admin/orders/page.tsx` - Complete redesign

## 🎨 Design Features

- Modern gradient accents
- Smooth animations and transitions
- Responsive layout for mobile and desktop
- Arabic RTL support
- Print-optimized invoice layout
- Color-coded status badges
- Interactive hover effects

## 📱 Mobile Support

- Touch-friendly buttons
- Scrollable tables
- Click-to-call functionality
- Responsive filters
- Mobile-optimized dialogs

## 🔐 Security Notes

- All database operations use RLS policies
- Client-side validation for status updates
- Secure phone number handling
- No sensitive data in URLs

## 🚀 Next Steps

1. Apply the database migration
2. Test the new features
3. Customize shipping companies and settings
4. Train your team on the new workflow
5. Monitor KPIs and adjust as needed

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify database migration was successful
3. Ensure all dependencies are installed
4. Check Supabase project settings

---

**Built with**: Next.js, React, Supabase, Shadcn UI, Tailwind CSS
