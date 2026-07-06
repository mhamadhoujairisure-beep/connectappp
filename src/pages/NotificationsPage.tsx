import { useState, useEffect } from "react";
import { Bell, ArrowRight, ArrowLeft } from "lucide-react"; // استيراد أسهم الرجوع
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { useNavigate } from "react-router-dom";

// بيانات تجريبية للإشعارات
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "خصم خاص لك!",
    message: "تم تفعيل كود الخصم LUXURY20 على طلباتك القادمة.",
    time: "منذ 5 دقائق",
    read: false,
    type: "promo"
  },
  {
    id: 2,
    title: "تم شحن طلبك",
    message: "طلبك #9821 في الطريق إليك وسيصلك قريباً.",
    time: "منذ ساعتين",
    read: true,
    type: "order"
  },
  {
    id: 3,
    title: "منتج جديد في متجرك المفضل",
    message: "تمت إضافة ساعة رولكس جديدة إلى كتالوج متجر Gold Time.",
    time: "منذ يوم",
    read: true,
    type: "update"
  }
];

const NotificationsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // التحقق من اتجاه اللغة لاختيار السهم المناسب
  // في العربية (RTL) نستخدم سهم يمين (ArrowRight)
  // في الإنجليزية (LTR) نستخدم سهم يسار (ArrowLeft)
  const isRTL = document.documentElement.dir === 'rtl';
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-background pb-20 pt-16">
      {/* رأس الصفحة مع زر الرجوع */}
      <header className="sticky top-0 z-40 w-full border-b glass px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          {/* زر الرجوع */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="h-9 w-9"
          >
            <BackIcon className="h-5 w-5" />
          </Button>

          {/* عنوان الصفحة */}
          <h1 className="text-xl font-display font-bold text-gradient-blue">
            {t.notifications || "الإشعارات"}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {notifications.length === 0 ? (
          // حالة عدم وجود إشعارات
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <div className="p-4 rounded-full bg-muted/50">
              <Bell className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold">لا توجد إشعارات حالياً</h2>
          </div>
        ) : (
          // قائمة الإشعارات (بدون أزرار حذف)
          <ScrollArea className="h-[calc(100vh-140px)] pr-4">
            <div className="space-y-3">
              {notifications.map((notif) => (
                <Card 
                  key={notif.id} 
                  className={cn(
                    "relative overflow-hidden transition-all hover:shadow-md cursor-pointer",
                    !notif.read && "bg-primary/5 border-primary/20"
                  )}
                  onClick={() => {
                    // عند الضغط نغير الحالة لمقروء فقط
                    if(!notif.read) {
                      setNotifications(prev => prev.map(n => n.id === notif.id ? {...n, read: true} : n));
                    }
                  }}
                >
                  <CardContent className="p-4 flex gap-4 items-start">
                    {/* أيقونة نوع الإشعار */}
                    <div className={cn(
                      "p-2 rounded-full mt-1 shrink-0",
                      notif.type === 'promo' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 
                      notif.type === 'order' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                      'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                    )}>
                      <Bell className="h-4 w-4" />
                    </div>

                    {/* محتوى الإشعار */}
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h3 className={cn("font-semibold text-sm", !notif.read && "text-foreground")}>
                          {notif.title}
                        </h3>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  </CardContent>
                  
                  {/* مؤشر الإشعار غير المقروء */}
                  {!notif.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />
                  )}
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </main>
    </div>
  );
};

export default NotificationsPage;
