import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import StoreCard from "@/components/StoreCard";
import BottomNav from "@/components/BottomNav";
import { useLanguage } from "@/hooks/useLanguage";

const mockProducts = [
  { id: "1", nameAr: "حقيبة جلد كلاسيكية", nameEn: "Classic Leather Bag", price: 189, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop", storeName: "Luxe Goods", storeId: "s1", createdAt: new Date(Date.now() - 60000).toISOString() },
  { id: "2", nameAr: "ساعة ذهبية فاخرة", nameEn: "Gold Watch Elite", price: 459, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop", storeName: "TimeKeeper", storeId: "s2", createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "3", nameAr: "نظارات شمسية مصممة", nameEn: "Designer Sunglasses", price: 220, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop", storeName: "Shade Co", storeId: "s3", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "4", nameAr: "حذاء رياضي فاخر", nameEn: "Premium Sneakers", price: 310, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", storeName: "StepUp", storeId: "s4", createdAt: new Date(Date.now() - 172800000).toISOString() },
];

const mockStores = [
  { id: "s1", name: "Luxe Goods", descriptionAr: "منتجات جلدية فاخرة وإكسسوارات راقية.", descriptionEn: "Premium leather goods and luxury accessories.", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop" },
  { id: "s2", name: "TimeKeeper", descriptionAr: "مجموعة مختارة من الساعات الفاخرة.", descriptionEn: "Curated collection of fine timepieces.", image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=200&h=200&fit=crop" },
  { id: "s3", name: "Shade Co", descriptionAr: "نظارات مصممة ونظارات شمسية فاخرة.", descriptionEn: "Designer eyewear and premium sunglasses.", image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=200&h=200&fit=crop" },
  { id: "s4", name: "StepUp", descriptionAr: "أحذية رياضية محدودة الإصدار وأحذية فاخرة.", descriptionEn: "Limited edition sneakers and premium footwear.", image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=200&h=200&fit=crop" },
];

type Tab = "all" | "products" | "stores";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const { lang, t, isRtl } = useLanguage();

  const q = query.trim().toLowerCase();

  const storesWithDesc = mockStores.map(s => ({
    ...s,
    description: lang === "ar" ? s.descriptionAr : s.descriptionEn,
  }));

  const productsWithName = mockProducts.map(p => ({
    ...p,
    name: lang === "ar" ? p.nameAr : p.nameEn,
  }));

  const filteredStores = q
    ? [...storesWithDesc]
        .sort((a, b) => {
          const aStarts = a.name.toLowerCase().startsWith(q);
          const bStarts = b.name.toLowerCase().startsWith(q);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return 0;
        })
        .filter((s) => s.name.toLowerCase().includes(q))
    : [];

  const filteredProducts = q
    ? [...productsWithName]
        .sort((a, b) => {
          const aStarts = a.name.toLowerCase().startsWith(q) || a.storeName.toLowerCase().startsWith(q);
          const bStarts = b.name.toLowerCase().startsWith(q) || b.storeName.toLowerCase().startsWith(q);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return 0;
        })
        .filter((p) => p.name.toLowerCase().includes(q) || p.storeName.toLowerCase().includes(q))
    : productsWithName;

  const showStores = activeTab === "all" || activeTab === "stores";
  const showProducts = activeTab === "all" || activeTab === "products";
  const hasResults = (showStores && filteredStores.length > 0) || (showProducts && filteredProducts.length > 0);

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: t.all },
    { key: "products", label: t.products },
    { key: "stores", label: t.storesTab },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3 space-y-3">
        <div className="relative">
          <Search className={`absolute ${isRtl ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground`} />
          <Input
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`${isRtl ? "pr-10" : "pl-10"} bg-secondary border-none text-foreground placeholder:text-muted-foreground`}
          />
        </div>
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 pt-4">
        {showStores && filteredStores.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-display font-semibold text-muted-foreground mb-2">{t.storesTab}</h3>
            <div className="space-y-2">
              {filteredStores.map((store) => (
                <StoreCard key={store.id} {...store} />
              ))}
            </div>
          </div>
        )}

        {showProducts && filteredProducts.length > 0 && (
          <div>
            {(showStores && filteredStores.length > 0) && (
              <h3 className="text-sm font-display font-semibold text-muted-foreground mb-2">{t.products}</h3>
            )}
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} id={product.id} name={product.name} price={product.price} image={product.image} storeName={product.storeName} storeId={product.storeId} createdAt={product.createdAt} />
              ))}
            </div>
          </div>
        )}
      </div>

      {q && !hasResults && (
        <div className="flex flex-col items-center justify-center py-20">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t.noResults}</p>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default SearchPage;
