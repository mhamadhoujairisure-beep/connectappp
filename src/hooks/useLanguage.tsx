import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "ar" | "en";

const translations = {
  ar: {
    home: "الرئيسية",
    search: "بحث",
    stores: "المتاجر",
    myAccount: "حسابي",
    notifications: "الإشعارات",
    settings: "الإعدادات",
    darkMode: "الوضع الليلي",
    enabled: "مفعّل",
    disabled: "معطّل",
    language: "اللغة",
    arabic: "العربية",
    english: "English",
    searchPlaceholder: "ابحث عن منتجات، متاجر...",
    all: "الكل",
    products: "المنتجات",
    storesTab: "المتاجر",
    noResults: "لا توجد نتائج",
    browseStores: "تصفح المتاجر المعتمدة",
    merchantLogin: "تسجيل دخول التاجر",
    merchantPortal: "بوابة التاجر",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    signIn: "تسجيل الدخول",
    signingIn: "جاري الدخول...",
    fillAllFields: "يرجى ملء جميع الحقول",
    loginFailed: "فشل تسجيل الدخول",
    loginSuccess: "تم تسجيل الدخول بنجاح ✅",
    onlyApproved: "يمكن فقط للتجار المعتمدين تسجيل الدخول.",
    contactAdmin: "تواصل مع المسؤول للحصول على صلاحية الدخول.",
    contactWhatsapp: "تواصل عبر واتساب",
    clickToContact: "اضغط للتواصل مع البائع مباشرة",
    deliveryAvailable: "التوصيل متاح",
    deliveryNotAvailable: "التوصيل غير متاح",
    free: "مجاني",
    lebanon: "لبنان",
  },
  en: {
    home: "Home",
    search: "Search",
    stores: "Stores",
    myAccount: "Account",
    notifications: "Notifications",
    settings: "Settings",
    darkMode: "Dark Mode",
    enabled: "Enabled",
    disabled: "Disabled",
    language: "Language",
    arabic: "العربية",
    english: "English",
    searchPlaceholder: "Search products, stores...",
    all: "All",
    products: "Products",
    storesTab: "Stores",
    noResults: "No results found",
    browseStores: "Browse approved merchants",
    merchantLogin: "Merchant Login",
    merchantPortal: "Merchant Portal",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    signingIn: "Signing in...",
    fillAllFields: "Please fill all fields",
    loginFailed: "Login failed",
    loginSuccess: "Login successful ✅",
    onlyApproved: "Only admin-approved merchants can log in.",
    contactAdmin: "Contact your administrator for access.",
    contactWhatsapp: "Contact via WhatsApp",
    clickToContact: "Tap to contact the seller directly",
    deliveryAvailable: "Delivery available",
    deliveryNotAvailable: "Delivery not available",
    free: "Free",
    lebanon: "Lebanon",
  },
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.ar;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ar",
  setLang: () => {},
  t: translations.ar,
  isRtl: true,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem("app_language") as Language) || "ar";
  });

  useEffect(() => {
    localStorage.setItem("app_language", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const t = translations[lang];
  const isRtl = lang === "ar";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRtl }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
