import StoreCard from "@/components/StoreCard";
import BottomNav from "@/components/BottomNav";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

const mockStores = [
  { id: "s1", name: "Luxe Goods", descriptionAr: "منتجات جلدية فاخرة وإكسسوارات راقية.", descriptionEn: "Premium leather goods and luxury accessories.", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop" },
  { id: "s2", name: "TimeKeeper", descriptionAr: "مجموعة مختارة من الساعات الفاخرة.", descriptionEn: "Curated collection of fine timepieces.", image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=200&h=200&fit=crop" },
  { id: "s3", name: "Shade Co", descriptionAr: "نظارات مصممة ونظارات شمسية فاخرة.", descriptionEn: "Designer eyewear and premium sunglasses.", image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=200&h=200&fit=crop" },
  { id: "s4", name: "StepUp", descriptionAr: "أحذية رياضية محدودة الإصدار وأحذية فاخرة.", descriptionEn: "Limited edition sneakers and premium footwear.", image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=200&h=200&fit=crop" },
];

const StoresPage = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-4">
        <h1 className="text-xl font-display font-bold text-foreground">{t.stores}</h1>
        <p className="text-xs text-muted-foreground mt-1">{t.browseStores}</p>
      </header>

      <div className="px-4 pt-4 space-y-3">
        {mockStores.map((store, i) => (
          <motion.div
            key={store.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <StoreCard
              id={store.id}
              name={store.name}
              description={lang === "ar" ? store.descriptionAr : store.descriptionEn}
              image={store.image}
            />
          </motion.div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default StoresPage;
