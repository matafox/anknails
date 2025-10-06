import Header from "./components/Header";
import Footer from "./components/Footer";
import MasterSection from "./components/MasterSection";
import { useEffect, useState } from "react";

export default function AboutApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="relative flex flex-col items-center text-center
      min-h-screen w-full overflow-x-hidden bg-gradient-to-b 
      from-[#8b5cf6] via-[#a855f7] to-[#f0abfc]
      dark:from-[#1b132d] dark:via-[#2a1740] dark:to-[#3b2059]
      text-white"
    >
      {/* фонові плями — тепер фіксовані, не обриваються */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-100px] left-[-150px] w-[600px] h-[600px] bg-purple-400/25 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-[-200px] right-[-150px] w-[700px] h-[700px] bg-fuchsia-500/25 blur-[200px] rounded-full"></div>
        <div className="absolute top-[250px] right-[100px] w-[300px] h-[300px] bg-pink-400/20 blur-[150px] rounded-full"></div>
      </div>

      <Header />

      <main
        className={`flex-grow w-full flex flex-col items-center justify-center 
        px-4 sm:px-6 z-10 pt-24 sm:pt-28 transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="space-y-10 sm:space-y-12 w-full max-w-4xl">
          <MasterSection />
        </div>
      </main>

      <Footer />

      <style>{`
        html, body {
          scroll-behavior: smooth;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          height: 100%;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
