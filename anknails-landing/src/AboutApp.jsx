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
      className="relative min-h-screen flex flex-col text-center 
      bg-gradient-to-b from-[#a37bff] via-[#b388ff] to-[#e3c4ff]
      dark:from-[#1a1029] dark:via-[#2a1740] dark:to-[#3a2059]
      text-white overflow-x-clip"
    >
      {/* м’яке фіолетове сяйво */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-200px] left-[-100px] w-[500px] h-[500px] bg-purple-400/30 blur-[160px] rounded-full"></div>
        <div className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] bg-fuchsia-400/25 blur-[180px] rounded-full"></div>
        <div className="absolute top-[300px] right-[200px] w-[300px] h-[300px] bg-pink-400/20 blur-[120px] rounded-full"></div>
      </div>

      <Header />

      <main
        className={`flex-grow w-full flex flex-col items-center justify-center 
        px-4 sm:px-6 z-10 pt-24 sm:pt-28 transition-opacity duration-700 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="space-y-10 sm:space-y-12 w-full max-w-4xl">
          <MasterSection />
        </div>
      </main>

      <Footer />

      {/* ====== Глобальні стилі для плавного скролу ====== */}
      <style>{`
        html, body {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-y: contain;
        }
        * {
          scroll-margin: 0;
          scroll-padding: 0;
        }
      `}</style>
    </div>
  );
}
