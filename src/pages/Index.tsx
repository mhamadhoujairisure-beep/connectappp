import { motion } from "framer-motion";
import { Bell, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import BottomNav from "@/components/BottomNav";
import connectLogo from "@/assets/connect-logo.png";
import { useNotifications } from "@/hooks/useNotifications";
import { useLanguage } from "@/hooks/useLanguage";

const mockProducts = [
  { id: "1", nameAr: "حقيبة جلد كلاسيكية", nameEn: "Classic Leather Bag", price: 189, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop", storeName: "Luxe Goods", storeId: "s1", createdAt: new Date(Date.now() - 60000).toISOString() },
  { id: "2", nameAr: "ساعة ذهبية فاخرة", nameEn: "Gold Watch Elite", price: 459, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop", storeName: "TimeKeeper", storeId: "s2", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "3", nameAr: "نظارات شمسية مصممة", nameEn: "Designer Sunglasses", price: 220, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop", storeName: "Shade Co", storeId: "s3", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "4", nameAr: "حذاء رياضي فاخر", nameEn: "Premium Sneakers", price: 310, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", storeName: "StepUp", storeId: "s4", createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "5", nameAr: "وشاح حرير", nameEn: "Silk Scarf", price: 95, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=400&fit=crop", storeName: "Luxe Goods", storeId: "s1", createdAt: new Date(Date.now() - 300000).toISOString() },
  { id: "6", nameAr: "محفظة أنيقة", nameEn: "Minimalist Wallet", price: 75, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop", storeName: "Shade Co", storeId: "s3", createdAt: new Date(Date.now() - 7200000).toISOString() },
];

const Index = () => {
  const { hasUnread } = useNotifications();
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/settings" className="p-2">
              <Settings className="h-6 w-6 text-foreground" />
            </Link>
            <Link to="/notifications" className="relative p-2">
              <Bell className="h-6 w-6 text-foreground" />
              {hasUnread && (
                <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-background" />
              )}
            </Link>
          </div>
          <img src={connectLogo} alt="Connect" className="h-14 object-contain" />
        </div>
      </header>

      <div className="px-4 pt-4 grid grid-cols-2 gap-3">
        {mockProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <ProductCard
              id={product.id}
              name={lang === "ar" ? product.nameAr : product.nameEn}
              price={product.price}
              image={product.image}
              storeName={product.storeName}
              storeId={product.storeId}
              createdAt={product.createdAt}
            />
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default Index;
