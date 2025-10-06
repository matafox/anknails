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
      className="relative w-full min-h-screen overflow-x-hidden 
      bg-gradient-to-b from-[#8b5cf6] via-[#a855f7] to-[#f0abfc]
      dark:from-[#1b132d] dark:via-[#2a1740] dark:to-[#3b2059]
      text-white"
    >
      {/* Фонові плями — тепер всередині scrollable контейнера */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-purple-400/25 blur-[160px] rounded-full"></div>
        <div className="absolute bottom-[-200px] right-[-150px] w-[700px] h-[700px] bg-fuchsia-500/25 blur-[200px] rounded-full"></div>
        <div className="absolute top-[300px] right-[120px] w-[250px] h-[250px] bg-pink-400/25 blur-[120px] rounded-full"></div>
      </div>

      <Header />

      <main
        className={`flex flex-col items-center justify-start w-full 
        px-4 sm:px-6 z-10 pt-24 sm:pt-28 pb-20 transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="space-y-10 sm:space-y-12 w-full max-w-4xl text-center">
          <MasterSection />
        </div>
      </main>

      <Footer />

      <style>{`
        html, body {
          height: auto;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
