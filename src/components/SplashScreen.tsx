import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import connectLogo from "@/assets/connect-logo.png";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 600);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
        >
          {/* Video */}
          <video
            src="/splash.mp4"
            autoPlay
            muted
            playsInline
            className="w-64 h-64 object-contain z-10 -ml-4"
          />

          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-white/30" />

          {/* Bottom branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute bottom-12 flex flex-col items-center gap-2 z-10"
          >
            <div className="flex flex-col items-center">
              <span className="text-gray-600 text-[9px] tracking-widest font-semibold">
                from
              </span>
              <span className="text-gray-600 text-[9px] tracking-widest font-semibold">
                MHMD HOUJAIRI
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
