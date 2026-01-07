'use client'

import { useState } from 'react'
import { Order } from '@/hooks/use-orders'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StatusBadge } from './StatusBadge'
import { Phone, MapPin, Package, Truck, Calendar, FileText, Printer } from 'lucide-react'
import { formatOrderForInvoice } from '@/lib/order-utils'

interface OrderDetailsDialogProps {
    order: Order | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpdateNotes?: (orderId: number, notes: string) => Promise<void>
}

export function OrderDetailsDialog({
    order,
    open,
    onOpenChange,
    onUpdateNotes
}: OrderDetailsDialogProps) {
    const [notes, setNotes] = useState(order?.notes || '')
    const [saving, setSaving] = useState(false)

    if (!order) return null

    const handleSaveNotes = async () => {
        if (!onUpdateNotes) return

        setSaving(true)
        try {
            await onUpdateNotes(order.id, notes)
        } catch (error) {
            console.error('Error saving notes:', error)
        } finally {
            setSaving(false)
        }
    }

    const handlePrintInvoice = () => {
        const invoiceData = formatOrderForInvoice(order)
        // Open invoice in new window for printing
        const printWindow = window.open('', '_blank')
        if (!printWindow) return

        printWindow.document.write(`
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <title>فاتورة طلب ${invoiceData.orderId}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        padding: 20px;
                        direction: rtl;
                    }
                    .invoice { 
                        max-width: 800px; 
                        margin: 0 auto;
                        border: 2px solid #000;
                        padding: 20px;
                    }
                    .header { 
                        text-align: center; 
                        margin-bottom: 30px;
                        border-bottom: 2px solid #000;
                        padding-bottom: 15px;
                    }
                    .header h1 { font-size: 28px; margin-bottom: 10px; }
                    .order-id { font-size: 20px; font-weight: bold; margin: 10px 0; }
                    .section { margin: 20px 0; }
                    .section-title { 
                        font-size: 18px; 
                        font-weight: bold; 
                        margin-bottom: 10px;
                        background: #f0f0f0;
                        padding: 8px;
                    }
                    .info-row { 
                        display: flex; 
                        padding: 8px 0;
                        border-bottom: 1px solid #eee;
                    }
                    .info-label { font-weight: bold; width: 150px; }
                    .info-value { flex: 1; }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin: 15px 0;
                    }
                    th, td { 
                        border: 1px solid #000; 
                        padding: 10px; 
                        text-align: right;
                    }
                    th { background: #f0f0f0; font-weight: bold; }
                    .total-row { 
                        font-size: 18px; 
                        font-weight: bold;
                        background: #f9f9f9;
                    }
                    .footer {
                        margin-top: 30px;
                        text-align: center;
                        font-size: 12px;
                        color: #666;
                    }
                    @media print {
                        body { padding: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="invoice">
                    <div class="header">
                        <h1>بوليصة شحن</h1>
                        <div class="order-id">رقم الطلب: ${invoiceData.orderId}</div>
                        <div>التاريخ: ${invoiceData.date}</div>
                    </div>

                    <div class="section">
                        <div class="section-title">معلومات العميل</div>
                        <div class="info-row">
                            <div class="info-label">الاسم:</div>
                            <div class="info-value">${invoiceData.customer.name}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">الهاتف:</div>
                            <div class="info-value">${invoiceData.customer.phone}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">العنوان:</div>
                            <div class="info-value">${invoiceData.customer.address}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">الولاية:</div>
                            <div class="info-value">${invoiceData.customer.wilaya}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">البلدية:</div>
                            <div class="info-value">${invoiceData.customer.commune}</div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">تفاصيل الطلب</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>المنتج</th>
                                    <th>الكمية</th>
                                    <th>السعر</th>
                                    <th>المجموع</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${invoiceData.items.map(item => `
                                    <tr>
                                        <td>${item.title}</td>
                                        <td>${item.quantity}</td>
                                        <td>${item.price.toLocaleString()} د.ج</td>
                                        <td>${(item.price * item.quantity).toLocaleString()} د.ج</td>
                                    </tr>
                                `).join('')}
                                <tr>
                                    <td colspan="3" style="text-align: left; font-weight: bold;">المجموع الفرعي:</td>
                                    <td style="font-weight: bold;">${invoiceData.subtotal.toLocaleString()} د.ج</td>
                                </tr>
                                <tr>
                                    <td colspan="3" style="text-align: left; font-weight: bold;">تكلفة الشحن:</td>
                                    <td style="font-weight: bold;">${invoiceData.shipping.toLocaleString()} د.ج</td>
                                </tr>
                                <tr class="total-row">
                                    <td colspan="3" style="text-align: left;">المجموع الإجمالي:</td>
                                    <td>${invoiceData.total.toLocaleString()} د.ج</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="section">
                        <div class="info-row">
                            <div class="info-label">نوع التوصيل:</div>
                            <div class="info-value">${invoiceData.deliveryType}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">شركة الشحن:</div>
                            <div class="info-value">${invoiceData.shippingCompany}</div>
                        </div>
                    </div>

                    <div class="footer">
                        <p>شكراً لتسوقكم معنا</p>
                    </div>
                </div>
                <script>
                    window.onload = function() { 
                        window.print(); 
                    }
                </script>
            </body>
            </html>
        `)
        printWindow.document.close()
    }

    const handleCall = () => {
        window.location.href = `tel:${order.customer_info?.phone}`
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <Package className="h-6 w-6" />
                        تفاصيل الطلب #{String(order.id).substring(0, 8)}
                    </DialogTitle>
                    <DialogDescription>
                        تم الإنشاء في {new Date(order.created_at).toLocaleString('ar-DZ')}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Status and Quick Actions */}
                    <div className="flex items-center justify-between">
                        <StatusBadge status={order.status} type="order" />
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCall}
                                className="gap-2"
                            >
                                <Phone className="h-4 w-4" />
                                اتصال
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrintInvoice}
                                className="gap-2"
                            >
                                <Printer className="h-4 w-4" />
                                طباعة
                            </Button>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            معلومات العميل
                        </h3>
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                            <div>
                                <p className="text-sm text-muted-foreground">الاسم</p>
                                <p className="font-medium">{order.customer_info?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">الهاتف</p>
                                <p className="font-medium font-mono" dir="ltr">{order.customer_info?.phone}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm text-muted-foreground">العنوان</p>
                                <p className="font-medium">{order.customer_info?.address}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">الولاية</p>
                                <p className="font-medium">{order.customer_info?.wilaya}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">البلدية</p>
                                <p className="font-medium">{order.customer_info?.commune}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            المنتجات
                        </h3>
                        <div className="space-y-2">
                            {order.items?.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        )}
                                        <div>
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-sm text-muted-foreground">الكمية: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold">{(item.price * item.quantity).toLocaleString()} د.ج</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2 border-t pt-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">المجموع الفرعي</span>
                            <span>{((order.total_amount || 0) - (order.shipping_cost || 0)).toLocaleString()} د.ج</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">تكلفة الشحن</span>
                            <span>{(order.shipping_cost || 0).toLocaleString()} د.ج</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                            <span>المجموع الإجمالي</span>
                            <span>{(order.total_amount || 0).toLocaleString()} د.ج</span>
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="grid grid-cols-2 gap-4 bg-blue-50 p-4 rounded-lg">
                        <div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <Truck className="h-4 w-4" />
                                نوع التوصيل
                            </p>
                            <p className="font-medium">
                                {order.delivery_type === 'home' ? 'توصيل للمنزل' : 'توصيل للمكتب'}
                            </p>
                        </div>
                        {order.shipping_company && (
                            <div>
                                <p className="text-sm text-muted-foreground">شركة الشحن</p>
                                <p className="font-medium">{order.shipping_company}</p>
                            </div>
                        )}
                    </div>

                    {/* Call Attempts */}
                    {order.call_attempts && order.call_attempts > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Phone className="h-5 w-5" />
                                محاولات الاتصال ({order.call_attempts})
                            </h3>
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <pre className="text-sm whitespace-pre-wrap font-sans">
                                    {order.call_notes || 'لا توجد ملاحظات'}
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            ملاحظات
                        </h3>
                        <Textarea
                            value={notes}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                            placeholder="أضف ملاحظات حول هذا الطلب..."
                            rows={4}
                            className="resize-none"
                        />
                        <Button
                            onClick={handleSaveNotes}
                            disabled={saving || notes === order.notes}
                            size="sm"
                        >
                            {saving ? 'جاري الحفظ...' : 'حفظ الملاحظات'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
