import { useParams } from "react-router-dom";
import { Phone, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import BottomNav from "@/components/BottomNav";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";

const mockStoreData: Record<string, { name: string; descriptionAr: string; descriptionEn: string; phone: string; image: string; socials: { instagram?: string; twitter?: string; tiktok?: string; snapchat?: string }; products: any[] }> = {
  s1: {
    name: "Luxe Goods",
    descriptionAr: "منتجات جلدية فاخرة وإكسسوارات راقية للعملاء المميزين.",
    descriptionEn: "Premium leather goods and luxury accessories for the discerning customer.",
    phone: "+1 555-0123",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
    socials: { instagram: "luxegoods", twitter: "luxegoods", tiktok: "luxegoods" },
    products: [
      { id: "1", nameAr: "حقيبة جلد كلاسيكية", nameEn: "Classic Leather Bag", price: 189, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop", storeName: "Luxe Goods", storeId: "s1", createdAt: new Date(Date.now() - 60000).toISOString() },
      { id: "5", nameAr: "وشاح حرير", nameEn: "Silk Scarf", price: 95, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=400&fit=crop", storeName: "Luxe Goods", storeId: "s1", createdAt: new Date(Date.now() - 300000).toISOString() },
    ],
  },
  s2: {
    name: "TimeKeeper",
    descriptionAr: "مجموعة مختارة من الساعات الفاخرة وإكسسوارات الساعات.",
    descriptionEn: "Curated collection of fine timepieces and watch accessories.",
    phone: "+1 555-0456",
    image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400&h=400&fit=crop",
    socials: { instagram: "timekeeper", snapchat: "timekeeper" },
    products: [
      { id: "2", nameAr: "ساعة ذهبية فاخرة", nameEn: "Gold Watch Elite", price: 459, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop", storeName: "TimeKeeper", storeId: "s2", createdAt: new Date(Date.now() - 3600000).toISOString() },
    ],
  },
  s3: {
    name: "Shade Co",
    descriptionAr: "نظارات مصممة ونظارات شمسية فاخرة من أفضل الماركات.",
    descriptionEn: "Designer eyewear and premium sunglasses from top brands.",
    phone: "+1 555-0789",
    image: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400&h=400&fit=crop",
    socials: { instagram: "shadeco", tiktok: "shadeco", twitter: "shadeco" },
    products: [
      { id: "3", nameAr: "نظارات شمسية مصممة", nameEn: "Designer Sunglasses", price: 220, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop", storeName: "Shade Co", storeId: "s3", createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: "6", nameAr: "محفظة أنيقة", nameEn: "Minimalist Wallet", price: 75, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop", storeName: "Shade Co", storeId: "s3", createdAt: new Date(Date.now() - 7200000).toISOString() },
    ],
  },
  s4: {
    name: "StepUp",
    descriptionAr: "أحذية رياضية محدودة الإصدار ومجموعة أحذية فاخرة.",
    descriptionEn: "Limited edition sneakers and premium footwear collection.",
    phone: "+1 555-1234",
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop",
    socials: { instagram: "stepup", tiktok: "stepup", snapchat: "stepup" },
    products: [
      { id: "4", nameAr: "حذاء رياضي فاخر", nameEn: "Premium Sneakers", price: 310, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", storeName: "StepUp", storeId: "s4", createdAt: new Date(Date.now() - 172800000).toISOString() },
    ],
  },
};

const SocialIcon = ({ type, handle }: { type: string; handle: string }) => {
  const urls: Record<string, string> = {
    instagram: `https://instagram.com/${handle}`,
    twitter: `https://x.com/${handle}`,
    tiktok: `https://tiktok.com/@${handle}`,
    snapchat: `https://snapchat.com/add/${handle}`,
  };

  const icons: Record<string, JSX.Element> = {
    instagram: (<svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>),
    twitter: (<svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>),
    tiktok: (<svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V12.8a8.28 8.28 0 005.58 2.17V11.5a4.84 4.84 0 01-3.77-1.58V6.69h3.77z"/></svg>),
    snapchat: (<svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.922-.214.04-.012.06-.012.08-.012.16 0 .36.074.5.193a.49.49 0 01.13.38c-.03.21-.209.375-.349.459-.239.135-.832.332-1.148.384-.1.019-.18.06-.239.12-.12.12-.15.36-.239.63-.03.09-.061.18-.12.27-.174.39-.54.59-.899.59-.12 0-.24-.03-.36-.06a6.58 6.58 0 00-.659-.12 4.63 4.63 0 00-.63-.06c-.24 0-.48.03-.72.09-.72.15-1.199.57-1.649 1.02-.539.54-1.019 1.08-1.889 1.08s-1.349-.54-1.889-1.08c-.45-.45-.929-.87-1.649-1.02a4.84 4.84 0 00-.72-.09c-.21 0-.42.03-.63.06a6.4 6.4 0 01-.659.12c-.12.03-.24.06-.36.06-.36 0-.72-.21-.899-.59a1.67 1.67 0 01-.12-.27c-.09-.27-.12-.51-.239-.63-.06-.06-.135-.1-.239-.12-.316-.05-.909-.25-1.148-.39a.59.59 0 01-.349-.45.49.49 0 01.13-.39.54.54 0 01.5-.18c.02 0 .04 0 .08.015.263.09.622.21.922.21.198 0 .326-.045.401-.09a5.1 5.1 0 01-.03-.51l-.003-.06c-.104-1.628-.23-3.654.3-4.847C5.447 1.07 8.804.793 9.794.793h2.412z"/></svg>),
  };

  return (
    <a href={urls[type]} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
      {icons[type]}
    </a>
  );
};

const StorePage = () => {
  const { id } = useParams();
  const store = mockStoreData[id || ""] || mockStoreData.s1;
  const { lang, t, isRtl } = useLanguage();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3 flex items-center gap-3">
        <Link to="/stores">
          <ArrowLeft className={`h-5 w-5 text-foreground ${isRtl ? "rotate-180" : ""}`} />
        </Link>
        <h1 className="font-display font-semibold text-foreground">{store.name}</h1>
      </header>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-6">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-primary">
            <img src={store.image} alt={store.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-foreground">{store.name}</h2>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span className="text-xs">{store.phone}</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
          {lang === "ar" ? store.descriptionAr : store.descriptionEn}
        </p>

        {Object.keys(store.socials).length > 0 && (
          <div className="flex items-center gap-3 mt-4">
            {Object.entries(store.socials).map(([type, handle]) =>
              handle ? <SocialIcon key={type} type={type} handle={handle} /> : null
            )}
          </div>
        )}
      </motion.div>

      <div className="px-4 mt-6">
        <h3 className="font-display font-semibold text-foreground mb-3">{t.products}</h3>
        <div className="grid grid-cols-2 gap-3">
          {store.products.map((product: any) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={lang === "ar" ? product.nameAr : product.nameEn}
              price={product.price}
              image={product.image}
              storeName={product.storeName}
              storeId={product.storeId}
              createdAt={product.createdAt}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default StorePage;
