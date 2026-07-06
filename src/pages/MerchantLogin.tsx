"use client";

import React, { useState } from 'react';

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  // دالة التحقق: تقبل فقط 8 أرقام تبدأ بـ (03, 81, 70, 71, 76, 80)
  const validateLebaneseNumber = (number: string) => {
    const lebaneseRegex = /^(03|81|70|71|76|80)\d{6}$/;
    return lebaneseRegex.test(number);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // يسمح بإدخال أرقام فقط
    setPhone(value);
    
    if (value.length > 0) {
      setPhoneError(!validateLebaneseNumber(value));
    } else {
      setPhoneError(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLebaneseNumber(phone)) {
      setPhoneError(true);
      return;
    }

    setIsLoading(true);
    console.log("Logging in with:", `+961${phone}`);
    
    // هنا تضع كود الاتصال بـ Supabase لاحقاً
    setTimeout(() => {
      setIsLoading(false);
      alert("تم بنجاح");
    }, 1000);
  };

  return (
    /* تثبيت الشاشة ومنع التمرير */
    <div className="h-screen flex flex-col items-start bg-white px-4 overflow-hidden relative pt-12">
      
      {/* اللوغو */}
      <div className="mb-6 z-10 w-full flex justify-center">
        <img 
          src="logo.PNG" 
          alt="Logo" 
          className="w-32 h-32 object-contain mx-auto"
        />
      </div>

      {/* بطاقة تسجيل الدخول */}
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl border border-gray-100 z-10 mx-auto">
        
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* حقل رقم الهاتف */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 text-right">
              رقم الهاتف
            </label>
            
            <div className="flex gap-2">
              <div className="w-20 flex-shrink-0">
                <input
                  type="text"
                  value="+961"
                  disabled
                  className="w-full h-full px-2 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 text-sm font-medium text-center cursor-not-allowed"
                  dir="ltr"
                />
              </div>

              <div className="flex-1">
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                  maxLength={8}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors duration-200 text-left ${
                    phoneError 
                      ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                      : 'border-gray-300 focus:ring-black/20 focus:border-black'
                  }`}
                  placeholder="XX XXX XXX"
                  dir="ltr"
                />
              </div>
            </div>

            {/* رسالة خطأ عامة */}
            {phoneError && phone.length > 0 && (
              <p className="text-[11px] text-red-500 text-right mt-1">
                رقم الهاتف غير صحيح
              </p>
            )}
          </div>

          {/* حقل كلمة السر */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 text-right">
              كلمة السر
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black text-right transition-colors duration-200"
              placeholder="أدخل كلمة السر"
              dir="rtl"
            />
          </div>

          {/* زر تسجيل الدخول */}
          <button
            type="submit"
            disabled={isLoading || phoneError}
            className="w-full bg-black text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-black/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex justify-center items-center mt-2"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "تسجيل الدخول"
            )}
          </button>

        </form>

        {/* نسيت كلمة المرور */}
        <div className="mt-4 text-center">
          <button type="button" className="text-xs text-black hover:text-gray-700 font-medium transition-colors">
            نسيت كلمة المرور؟
          </button>
        </div>
      </div>

      {/* إنشاء حساب جديد في الأسفل */}
      <div className="mt-6 text-center z-10 w-full">
        <p className="text-gray-500 text-xs">
          ليس لديك حساب؟{' '}
          <button 
            type="button" 
            onClick={() => window.location.href = '/merchantregister'} 
            className="text-black font-bold hover:text-gray-700 transition-colors"
          >
            إنشاء حساب
          </button>
        </p>
      </div>

    </div>
  );
}
