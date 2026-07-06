import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  LogOut, Plus, Edit2, Trash2, Camera, Store, Package,
  Image as ImageIcon, X, Save, Phone, MapPin, Grid3X3,
  Settings, MoreHorizontal, Heart, MessageCircle, Bookmark,
  Share2, ChevronDown, ExternalLink
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image: string | null;
  is_active: boolean;
  delivery_available: boolean;
  delivery_price: number | null;
  location: string | null;
}

interface MerchantData {
  id: string;
  store_name: string;
  description: string | null;
  phone: string | null;
  city: string | null;
  profile_image: string | null;
  instagram: string | null;
  tiktok: string | null;
  whatsapp: string | null;
  facebook: string | null;
}

const MerchantDashboard = () => {
  const [merchant, setMerchant] = useState<MerchantData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ store_name: "", description: "", phone: "", city: "", instagram: "", tiktok: "", whatsapp: "", facebook: "" });
  const [productForm, setProductForm] = useState({ name: "", price: "", description: "", delivery_available: false, delivery_price: "", location: "" });
  const [productImage, setProductImage] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileFileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t, isRtl } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    loadMerchantData();
  }, []);

  const loadMerchantData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/login"); return; }

    const { data: merchantData } = await supabase
      .from("merchants")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!merchantData) { navigate("/login"); return; }

    setMerchant(merchantData);
    setProfileForm({
      store_name: merchantData.store_name,
      description: merchantData.description || "",
      phone: merchantData.phone || "",
      city: merchantData.city || "",
      instagram: merchantData.instagram || "",
      tiktok: merchantData.tiktok || "",
      whatsapp: merchantData.whatsapp || "",
      facebook: merchantData.facebook || "",
    });

    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .eq("merchant_id", merchantData.id)
      .order("created_at", { ascending: false });

    setProducts(productsData || []);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const uploadImage = async (file: File, path: string) => {
    const ext = file.name.split(".").pop();
    const fileName = `${path}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSaveProfile = async () => {
    if (!merchant) return;
    setSaving(true);
    try {
      let profileImageUrl = merchant.profile_image;
      if (profileImage) {
        profileImageUrl = await uploadImage(profileImage, `profiles/${merchant.id}`);
      }
      const { error } = await supabase
        .from("merchants")
        .update({ ...profileForm, profile_image: profileImageUrl })
        .eq("id", merchant.id);
      if (error) throw error;
      setMerchant({ ...merchant, ...profileForm, profile_image: profileImageUrl });
      setEditingProfile(false);
      setProfileImage(null);
      toast({ title: isRtl ? "تم حفظ الملف الشخصي ✅" : "Profile saved ✅" });
    } catch (e: any) {
      toast({ title: isRtl ? "خطأ في الحفظ" : "Save error", description: e.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const handleSaveProduct = async () => {
    if (!merchant || !productForm.name || !productForm.price) return;
    setSaving(true);
    try {
      let imageUrl: string | null = null;
      if (productImage) {
        imageUrl = await uploadImage(productImage, `products/${merchant.id}`);
      }

      if (editingProduct) {
        const updateData: any = {
          name: productForm.name,
          price: parseFloat(productForm.price),
          description: productForm.description || null,
          delivery_available: productForm.delivery_available,
          delivery_price: productForm.delivery_price ? parseFloat(productForm.delivery_price) : null,
          location: productForm.location || null,
        };
        if (imageUrl) updateData.image = imageUrl;

        const { error } = await supabase.from("products").update(updateData).eq("id", editingProduct.id);
        if (error) throw error;
        toast({ title: isRtl ? "تم تحديث المنتج ✅" : "Product updated ✅" });
      } else {
        const { error } = await supabase.from("products").insert({
          merchant_id: merchant.id,
          name: productForm.name,
          price: parseFloat(productForm.price),
          description: productForm.description || null,
          image: imageUrl,
          delivery_available: productForm.delivery_available,
          delivery_price: productForm.delivery_price ? parseFloat(productForm.delivery_price) : null,
          location: productForm.location || null,
        });
        if (error) throw error;
        toast({ title: isRtl ? "تمت إضافة المنتج ✅" : "Product added ✅" });
      }

      resetProductForm();
      loadMerchantData();
    } catch (e: any) {
      toast({ title: isRtl ? "خطأ" : "Error", description: e.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: isRtl ? "خطأ في الحذف" : "Delete error", variant: "destructive" });
    } else {
      setProducts(products.filter(p => p.id !== id));
      setSelectedProduct(null);
      toast({ title: isRtl ? "تم حذف المنتج" : "Product deleted" });
    }
  };

  const handleToggleActive = async (product: Product) => {
    const { error } = await supabase.from("products").update({ is_active: !product.is_active }).eq("id", product.id);
    if (!error) {
      setProducts(products.map(p => p.id === product.id ? { ...p, is_active: !p.is_active } : p));
    }
  };

  const resetProductForm = () => {
    setProductForm({ name: "", price: "", description: "", delivery_available: false, delivery_price: "", location: "" });
    setProductImage(null);
    setEditingProduct(null);
    setShowAddProduct(false);
  };

  const startEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description || "",
      delivery_available: product.delivery_available,
      delivery_price: product.delivery_price?.toString() || "",
      location: product.location || "",
    });
    setSelectedProduct(null);
    setShowAddProduct(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20" dir={isRtl ? "rtl" : "ltr"}>
      {/* Header - Instagram style */}
      <header className="sticky top-0 z-40 bg-background border-b border-border px-4 h-11 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <h1 className="text-base font-display font-bold text-foreground">
            {merchant?.store_name}
          </h1>
          <ChevronDown className="h-3.5 w-3.5 text-foreground" />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => { resetProductForm(); setShowAddProduct(true); }}>
            <Plus className="h-6 w-6 text-foreground" />
          </button>
          <button onClick={() => setEditingProfile(true)}>
            <Settings className="h-5 w-5 text-foreground" />
          </button>
          <button onClick={handleLogout}>
            <LogOut className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </header>

      {/* Profile Section */}
      <div className="px-4 pt-4 pb-2">
        {/* Centered Avatar */}
        <div className="flex flex-col items-center">
          <div className="h-24 w-24 rounded-full p-[3px] bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600">
            <div className="h-full w-full rounded-full border-[3px] border-background overflow-hidden bg-muted">
              {merchant?.profile_image ? (
                <img src={merchant.profile_image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-muted">
                  <Store className="h-10 w-10 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Name & Bio centered */}
          <h2 className="text-base font-bold text-foreground mt-3">{merchant?.store_name}</h2>

          {/* Products count */}
          <p className="text-xs text-muted-foreground mt-1">
            {products.length} {isRtl ? "منتجات" : "products"}
          </p>
          {merchant?.city && (
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {merchant.city}
              {merchant?.phone && <span className="ms-2">📞 {merchant.phone}</span>}
            </p>
          )}
          {merchant?.description && (
            <p className="text-sm text-foreground mt-1.5 leading-snug text-center">{merchant.description}</p>
          )}

          {/* Social links centered */}
          <div className="flex items-center justify-center gap-3 mt-2">
            {merchant?.instagram && (
              <a href={`https://instagram.com/${merchant.instagram}`} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            )}
            {merchant?.tiktok && (
              <a href={`https://tiktok.com/@${merchant.tiktok}`} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13.2a8.16 8.16 0 005.58 2.17V12a4.85 4.85 0 01-3.77-1.54V6.69h3.77z"/></svg>
              </a>
            )}
            {merchant?.whatsapp && (
              <a href={`https://wa.me/${merchant.whatsapp}`} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors">
                <Phone className="h-5 w-5" />
              </a>
            )}
            {merchant?.facebook && (
              <a href={`https://facebook.com/${merchant.facebook}`} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-3">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 h-8 text-xs font-semibold rounded-lg"
            onClick={() => setEditingProfile(true)}
          >
            {isRtl ? "تعديل الملف الشخصي" : "Edit profile"}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 h-8 text-xs font-semibold rounded-lg"
            onClick={() => { resetProductForm(); setShowAddProduct(true); }}
          >
            {isRtl ? "إضافة منتج" : "Add product"}
          </Button>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex border-b border-border mt-2">
        <button className="flex-1 py-2.5 flex items-center justify-center border-b-[1.5px] border-foreground">
          <Grid3X3 className="h-5 w-5 text-foreground" />
        </button>
      </div>

      {/* Products Grid - Instagram 3-col */}
      <div className="grid grid-cols-3 gap-[1px] bg-border">
        {products.map((product) => (
          <motion.button
            key={product.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-square bg-card overflow-hidden group"
            onClick={() => setSelectedProduct(product)}
          >
            {product.image ? (
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground/40" />
              </div>
            )}
            {!product.is_active && (
              <div className="absolute inset-0 bg-background/60" />
            )}
            {/* Hover overlay with price */}
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="text-primary-foreground font-bold text-sm drop-shadow-lg">${product.price}</span>
            </div>
          </motion.button>
        ))}

        {/* Add product placeholder */}
        <button
          onClick={() => { resetProductForm(); setShowAddProduct(true); }}
          className="aspect-square bg-card border border-dashed border-border flex flex-col items-center justify-center gap-1 hover:bg-muted/50 transition-colors"
        >
          <Plus className="h-6 w-6 text-muted-foreground/50" />
          <span className="text-[10px] text-muted-foreground/50">{isRtl ? "إضافة" : "Add"}</span>
        </button>
      </div>

      {products.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Camera className="h-16 w-16 mx-auto mb-4 opacity-20 stroke-1" />
          <p className="text-sm font-medium">{isRtl ? "شارك منتجاتك" : "Share Products"}</p>
          <p className="text-xs mt-1 text-muted-foreground/60">{isRtl ? "أضف أول منتج لك" : "Add your first product"}</p>
        </div>
      )}

      {/* Product Detail Modal - Instagram post style */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col"
            onClick={(e) => e.target === e.currentTarget && setSelectedProduct(null)}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-4 h-11 border-b border-border flex-shrink-0">
              <button onClick={() => setSelectedProduct(null)}>
                <X className="h-5 w-5 text-foreground" />
              </button>
              <span className="text-sm font-semibold text-foreground">{isRtl ? "المنتج" : "Product"}</span>
              <button onClick={() => startEditProduct(selectedProduct)}>
                <MoreHorizontal className="h-5 w-5 text-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Post header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="h-8 w-8 rounded-full overflow-hidden bg-muted border border-border">
                  {merchant?.profile_image ? (
                    <img src={merchant.profile_image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Store className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-semibold text-foreground">{merchant?.store_name}</span>
              </div>

              {/* Product image */}
              <div className="aspect-square bg-muted">
                {selectedProduct.image ? (
                  <img src={selectedProduct.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <Package className="h-16 w-16 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              {/* Action buttons row */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-4">
                  <button onClick={() => startEditProduct(selectedProduct)} className="hover:opacity-60 transition-opacity">
                    <Edit2 className="h-6 w-6 text-foreground" />
                  </button>
                  <button onClick={() => handleToggleActive(selectedProduct)} className="hover:opacity-60 transition-opacity">
                    <Package className={`h-6 w-6 ${selectedProduct.is_active ? 'text-primary' : 'text-muted-foreground'}`} />
                  </button>
                  <button onClick={() => handleDeleteProduct(selectedProduct.id)} className="hover:opacity-60 transition-opacity">
                    <Trash2 className="h-6 w-6 text-destructive" />
                  </button>
                </div>
                <div className="bg-primary text-primary-foreground text-sm font-bold px-4 py-1.5 rounded-full">
                  ${selectedProduct.price}
                </div>
              </div>

              {/* Product info */}
              <div className="px-4 pb-6">
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{merchant?.store_name}</span>{" "}
                  {selectedProduct.name}
                </p>
                {selectedProduct.description && (
                  <p className="text-sm text-muted-foreground mt-1">{selectedProduct.description}</p>
                )}
                {selectedProduct.location && (
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {selectedProduct.location}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  {selectedProduct.is_active ? (
                    <span className="text-primary">● {isRtl ? "نشط" : "Active"}</span>
                  ) : (
                    <span className="text-muted-foreground">○ {isRtl ? "غير نشط" : "Inactive"}</span>
                  )}
                  {selectedProduct.delivery_available && (
                    <span>🚚 {isRtl ? "توصيل" : "Delivery"} {selectedProduct.delivery_price ? `$${selectedProduct.delivery_price}` : ""}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editingProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-11 border-b border-border flex-shrink-0">
              <button onClick={() => { setEditingProfile(false); setProfileImage(null); }}>
                <X className="h-5 w-5 text-foreground" />
              </button>
              <span className="text-sm font-semibold text-foreground">{isRtl ? "تعديل الملف الشخصي" : "Edit profile"}</span>
              <button onClick={handleSaveProfile} disabled={saving} className="text-sm font-semibold text-primary disabled:opacity-50">
                {saving ? "..." : (isRtl ? "تم" : "Done")}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Profile image edit */}
              <div className="flex flex-col items-center py-5">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full overflow-hidden bg-muted">
                    {profileImage ? (
                      <img src={URL.createObjectURL(profileImage)} alt="" className="h-full w-full object-cover" />
                    ) : merchant?.profile_image ? (
                      <img src={merchant.profile_image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Store className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => profileFileRef.current?.click()}
                  className="text-xs font-semibold text-primary mt-3"
                >
                  {isRtl ? "تغيير الصورة" : "Change photo"}
                </button>
                <input ref={profileFileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setProfileImage(e.target.files?.[0] || null)} />
              </div>

              {/* Form fields - clean Instagram style */}
              <div className="border-t border-border">
                <div className="px-4 py-3 flex items-center border-b border-border">
                  <label className="text-sm text-muted-foreground w-28 flex-shrink-0">{isRtl ? "الاسم" : "Name"}</label>
                  <Input
                    value={profileForm.store_name}
                    onChange={(e) => setProfileForm({ ...profileForm, store_name: e.target.value })}
                    className="border-0 bg-transparent p-0 h-auto text-sm text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="px-4 py-3 flex items-start border-b border-border">
                  <label className="text-sm text-muted-foreground w-28 flex-shrink-0 pt-0.5">{isRtl ? "الوصف" : "Bio"}</label>
                  <Textarea
                    value={profileForm.description}
                    onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                    className="border-0 bg-transparent p-0 min-h-0 text-sm text-foreground resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    rows={2}
                  />
                </div>
                <div className="px-4 py-3 flex items-center border-b border-border">
                  <label className="text-sm text-muted-foreground w-28 flex-shrink-0">{isRtl ? "الهاتف" : "Phone"}</label>
                  <Input
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="border-0 bg-transparent p-0 h-auto text-sm text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="px-4 py-3 flex items-center border-b border-border">
                  <label className="text-sm text-muted-foreground w-28 flex-shrink-0">{isRtl ? "المدينة" : "City"}</label>
                  <Input
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="border-0 bg-transparent p-0 h-auto text-sm text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              {/* Social links section */}
              <div className="mt-4 border-t border-border">
                <p className="px-4 py-3 text-sm font-semibold text-foreground">{isRtl ? "مواقع التواصل" : "Social"}</p>
                <div className="px-4 py-3 flex items-center border-b border-border">
                  <label className="text-sm text-muted-foreground w-28 flex-shrink-0">Instagram</label>
                  <Input
                    value={profileForm.instagram}
                    onChange={(e) => setProfileForm({ ...profileForm, instagram: e.target.value })}
                    placeholder="username"
                    className="border-0 bg-transparent p-0 h-auto text-sm text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="px-4 py-3 flex items-center border-b border-border">
                  <label className="text-sm text-muted-foreground w-28 flex-shrink-0">TikTok</label>
                  <Input
                    value={profileForm.tiktok}
                    onChange={(e) => setProfileForm({ ...profileForm, tiktok: e.target.value })}
                    placeholder="username"
                    className="border-0 bg-transparent p-0 h-auto text-sm text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="px-4 py-3 flex items-center border-b border-border">
                  <label className="text-sm text-muted-foreground w-28 flex-shrink-0">WhatsApp</label>
                  <Input
                    value={profileForm.whatsapp}
                    onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                    placeholder="+961..."
                    className="border-0 bg-transparent p-0 h-auto text-sm text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="px-4 py-3 flex items-center border-b border-border">
                  <label className="text-sm text-muted-foreground w-28 flex-shrink-0">Facebook</label>
                  <Input
                    value={profileForm.facebook}
                    onChange={(e) => setProfileForm({ ...profileForm, facebook: e.target.value })}
                    placeholder="username"
                    className="border-0 bg-transparent p-0 h-auto text-sm text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showAddProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-11 border-b border-border flex-shrink-0">
              <button onClick={resetProductForm}>
                <X className="h-5 w-5 text-foreground" />
              </button>
              <span className="text-sm font-semibold text-foreground">
                {editingProduct ? (isRtl ? "تعديل المنتج" : "Edit product") : (isRtl ? "منتج جديد" : "New product")}
              </span>
              <button onClick={handleSaveProduct} disabled={saving || !productForm.name || !productForm.price}
                className="text-sm font-semibold text-primary disabled:opacity-30">
                {saving ? "..." : (isRtl ? "مشاركة" : "Share")}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Image upload area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square bg-muted flex flex-col items-center justify-center cursor-pointer hover:bg-muted/70 transition-colors relative overflow-hidden"
              >
                {productImage ? (
                  <img src={URL.createObjectURL(productImage)} alt="" className="h-full w-full object-cover" />
                ) : editingProduct?.image ? (
                  <img src={editingProduct.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <>
                    <Camera className="h-12 w-12 text-muted-foreground/30 stroke-1" />
                    <p className="text-sm text-muted-foreground/50 mt-2">{isRtl ? "اضغط لإضافة صورة" : "Tap to add photo"}</p>
                  </>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => setProductImage(e.target.files?.[0] || null)} />

              {/* Product form fields */}
              <div className="border-t border-border">
                <div className="px-4 py-3 border-b border-border">
                  <Input
                    placeholder={isRtl ? "اسم المنتج..." : "Product name..."}
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="border-0 bg-transparent p-0 h-auto text-sm text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="px-4 py-3 border-b border-border">
                  <Input
                    type="number"
                    placeholder={isRtl ? "السعر ($)" : "Price ($)"}
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="border-0 bg-transparent p-0 h-auto text-sm text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="px-4 py-3 border-b border-border">
                  <Textarea
                    placeholder={isRtl ? "وصف المنتج..." : "Write a description..."}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="border-0 bg-transparent p-0 min-h-0 text-sm text-foreground resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    rows={3}
                  />
                </div>
                <div className="px-4 py-3 border-b border-border">
                  <Input
                    placeholder={isRtl ? "الموقع" : "Add location"}
                    value={productForm.location}
                    onChange={(e) => setProductForm({ ...productForm, location: e.target.value })}
                    className="border-0 bg-transparent p-0 h-auto text-sm text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="px-4 py-3 flex items-center justify-between border-b border-border">
                  <span className="text-sm text-foreground">{isRtl ? "التوصيل متاح" : "Delivery"}</span>
                  <Switch
                    checked={productForm.delivery_available}
                    onCheckedChange={(checked) => setProductForm({ ...productForm, delivery_available: checked })}
                  />
                </div>
                {productForm.delivery_available && (
                  <div className="px-4 py-3 border-b border-border">
                    <Input
                      type="number"
                      placeholder={isRtl ? "سعر التوصيل ($)" : "Delivery price ($)"}
                      value={productForm.delivery_price}
                      onChange={(e) => setProductForm({ ...productForm, delivery_price: e.target.value })}
                      className="border-0 bg-transparent p-0 h-auto text-sm text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
};

export default MerchantDashboard;
