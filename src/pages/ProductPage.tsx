import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Truck, MapPin } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { motion } from "framer-motion";
import { timeAgo } from "@/lib/timeAgo";
import { useLanguage } from "@/hooks/useLanguage";

const allProducts: Record<string, { nameAr: string; nameEn: string; price: number; image: string; storeName: string; storeId: string; phone: string; descriptionAr: string; descriptionEn: string; createdAt: Date; deliveryAvailable: boolean; deliveryPrice: number | null; locationAr: string; locationEn: string }> = {
  "1": { nameAr: "حقيبة جلد كلاسيكية", nameEn: "Classic Leather Bag", price: 189, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop", storeName: "Luxe Goods", storeId: "s1", phone: "+15550123", descriptionAr: "حقيبة جلد طبيعي مصنوعة يدوياً من أجود أنواع الجلود الإيطالية.", descriptionEn: "Handcrafted genuine leather bag made from the finest Italian leather.", createdAt: new Date(Date.now() - 60000), deliveryAvailable: true, deliveryPrice: 5, locationAr: "بيروت", locationEn: "Beirut" },
  "2": { nameAr: "ساعة ذهبية فاخرة", nameEn: "Gold Watch Elite", price: 459, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop", storeName: "TimeKeeper", storeId: "s2", phone: "+15550456", descriptionAr: "ساعة ذهبية فاخرة بحركة سويسرية أوتوماتيكية.", descriptionEn: "Luxury gold watch with Swiss automatic movement.", createdAt: new Date(Date.now() - 3600000), deliveryAvailable: true, deliveryPrice: 0, locationAr: "طرابلس", locationEn: "Tripoli" },
  "3": { nameAr: "نظارات شمسية مصممة", nameEn: "Designer Sunglasses", price: 220, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop", storeName: "Shade Co", storeId: "s3", phone: "+15550789", descriptionAr: "نظارات شمسية بتصميم عصري مع عدسات مستقطبة.", descriptionEn: "Modern design sunglasses with polarized lenses.", createdAt: new Date(Date.now() - 86400000), deliveryAvailable: false, deliveryPrice: null, locationAr: "صيدا", locationEn: "Sidon" },
  "4": { nameAr: "حذاء رياضي فاخر", nameEn: "Premium Sneakers", price: 310, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop", storeName: "StepUp", storeId: "s4", phone: "+15551234", descriptionAr: "حذاء رياضي فاخر بتقنية توسيد متطورة.", descriptionEn: "Premium sneakers with advanced cushioning technology.", createdAt: new Date(Date.now() - 172800000), deliveryAvailable: true, deliveryPrice: 3, locationAr: "جبيل", locationEn: "Byblos" },
  "5": { nameAr: "وشاح حرير", nameEn: "Silk Scarf", price: 95, image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=600&fit=crop", storeName: "Luxe Goods", storeId: "s1", phone: "+15550123", descriptionAr: "وشاح حرير طبيعي 100% بطباعة فنية حصرية.", descriptionEn: "100% natural silk scarf with exclusive artistic print.", createdAt: new Date(Date.now() - 300000), deliveryAvailable: false, deliveryPrice: null, locationAr: "جونية", locationEn: "Jounieh" },
  "6": { nameAr: "محفظة أنيقة", nameEn: "Minimalist Wallet", price: 75, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop", storeName: "Shade Co", storeId: "s3", phone: "+15550789", descriptionAr: "محفظة بتصميم بسيط وأنيق من الجلد الطبيعي.", descriptionEn: "Minimalist genuine leather wallet with elegant design.", createdAt: new Date(Date.now() - 7200000), deliveryAvailable: true, deliveryPrice: 2, locationAr: "بعلبك", locationEn: "Baalbek" },
};

const ProductPage = () => {
  const { id } = useParams();
  const product = allProducts[id || ""] || allProducts["1"];
  const { lang, t, isRtl } = useLanguage();

  const name = lang === "ar" ? product.nameAr : product.nameEn;
  const description = lang === "ar" ? product.descriptionAr : product.descriptionEn;
  const location = lang === "ar" ? product.locationAr : product.locationEn;
  const country = t.lebanon;

  const whatsappUrl = `https://wa.me/${product.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(lang === "ar" ? `مرحباً، أريد الاستفسار عن: ${name}` : `Hi, I'd like to inquire about: ${name}`)}`;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3 flex items-center gap-3">
        <Link to="/">
          <ArrowLeft className={`h-5 w-5 text-foreground ${isRtl ? "rotate-180" : ""}`} />
        </Link>
        <h1 className="font-display font-semibold text-foreground truncate">{name}</h1>
      </header>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="aspect-square w-full overflow-hidden">
          <img src={product.image} alt={name} className="h-full w-full object-cover" />
        </div>

        <div className="px-4 pt-4 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-display font-bold text-foreground">{name}</h2>
              <Link to={`/store/${product.storeId}`} className="text-sm text-primary hover:underline">
                {product.storeName}
              </Link>
            </div>
            <span className="text-xl font-bold bg-primary text-primary-foreground px-3 py-1 rounded-full">${product.price}</span>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs">{timeAgo(product.createdAt)}</span>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span className="text-sm text-foreground">{location}، {country}</span>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border">
            <Truck className="h-4 w-4 shrink-0 text-primary" />
            {product.deliveryAvailable ? (
              <div className="flex-1">
                <span className="text-sm text-foreground">{t.deliveryAvailable}</span>
                <span className="text-sm text-primary font-bold mx-2">
                  {product.deliveryPrice === 0 ? t.free : `$${product.deliveryPrice}`}
                </span>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">{t.deliveryNotAvailable}</span>
            )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[hsl(142,70%,45%)] to-[hsl(142,60%,38%)] p-4 shadow-lg transition-transform active:scale-[0.98]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white font-display font-bold text-base">{t.contactWhatsapp}</p>
                  <p className="text-white/70 text-xs">{t.clickToContact}</p>
                </div>
                <div className="text-white/60">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </a>
        </div>
      </motion.div>

      <BottomNav />
    </div>
  );
};

export default ProductPage;
