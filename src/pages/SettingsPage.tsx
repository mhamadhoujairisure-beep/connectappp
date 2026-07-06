import { ArrowLeft, Moon, Sun, Globe, User, Lock, LogOut, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import BottomNav from "@/components/BottomNav";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/lib/supabase";

const SettingsPage = () => {
  const { lang, setLang, t, isRtl } = useLanguage();
  
  // 1. إعدادات الثيم (كما كانت)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // 2. إعدادات الحساب (الجديدة والمربوطة بقاعدة البيانات)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // دالة تشغيل مرة واحدة عند فتح الصفحة للتحقق هل هو مسجل دخول؟
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setIsLoggedIn(true);
      // نحاول جلب تفاصيل المستخدم (الاسم) من جدول profiles
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id) // ملاحظة: هذا لن يعمل مباشرة لأن ID في Auth يختلف عن ID في الجدول، سنعالجه لاحقاً
        .single();
      
      // للتبسيط حالياً، سنعرض الإيميل كاسم
      setCurrentUser({ username: session.user.email });
    }
  };

  // دالة تسجيل الدخول
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    // ملاحظة: Supabase يعتمد على الإيميل وليس اسم المستخدم في تسجيل الدخول
    const email = username; 

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setErrorMsg(isRtl ? "بيانات الدخول غير صحيحة" : "Invalid login credentials");
    } else {
      // نجح الدخول
      // نحفظ الاسم في جدول profiles إذا لم يكن موجوداً (اختياري للتبسيط سنقفزه الآن)
      setIsLoggedIn(true);
      setCurrentUser({ username: data.user.email });
      setUsername("");
      setPassword("");
    }
    
    setIsLoading(false);
  };

  // دالة تسجيل الخروج
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 glass border-b border-border px-4 py-3 flex items-center gap-3">
        <Link to="/">
          <ArrowLeft className={`h-5 w-5 text-foreground ${isRtl ? "rotate-180" : ""}`} />
        </Link>
        <h1 className="font-display font-semibold text-foreground">{t.settings}</h1>
      </header>

      <div className="px-4 pt-4 space-y-3">
        
        {/* قسم الحساب */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-card border border-border"
        >
          {!isLoggedIn ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <h3 className="text-sm font-bold text-foreground mb-2">{t.myAccount || (isRtl ? "تسجيل الدخول" : "Login")}</h3>
              
              {errorMsg && (
                <div className="text-xs text-red-500 bg-red-50 p-2 rounded">{errorMsg}</div>
              )}
              
              <div className="relative">
                <User className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder={isRtl ? "البريد الإلكتروني" : "Email"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${isRtl ? "pr-9" : "pl-9"}`}
                />
              </div>

              <div className="relative">
                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder={isRtl ? "كلمة المرور" : "Password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${isRtl ? "pr-9" : "pl-9"}`}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isRtl ? "دخول" : "Login")}
              </button>
              
              <p className="text-[10px] text-center text-muted-foreground">
                {isRtl ? "ملاحظة: استخدم بريدك الإلكتروني في تسجيل الدخول" : "Note: Use your email to login"}
              </p>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{currentUser?.username}</p>
                  <p className="text-[10px] text-muted-foreground">{isRtl ? "مسجل الدخول" : "Logged in"}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Dark Mode */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center justify-between p-4 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center gap-3">
            {darkMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
            <div>
              <p className="text-sm font-medium text-foreground">{t.darkMode}</p>
              <p className="text-xs text-muted-foreground">{darkMode ? t.enabled : t.disabled}</p>
            </div>
          </div>
          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        </motion.div>

        {/* Language */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between p-4 rounded-xl bg-card border border-border"
        >
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">{t.language}</p>
              <p className="text-xs text-muted-foreground">{lang === "ar" ? t.arabic : t.english}</p>
            </div>
          </div>
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {lang === "ar" ? "English" : "العربية"}
          </button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default SettingsPage;
