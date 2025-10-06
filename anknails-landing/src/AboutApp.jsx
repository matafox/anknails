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
      text-white selection:bg-pink-500/30 selection:text-white
      bg-gradient-to-b from-[#3a0ca3] via-[#6a00f4] to-[#b5179e]
      dark:from-[#10041f] dark:via-[#22063d] dark:to-[#3b0a5e]"
    >
      {/* 💜 М’які фонові плями */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-180px] left-[-200px] w-[500px] h-[500px] bg-indigo-400/25 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-[-150px] right-[-150px] w-[600px] h-[600px] bg-fuchsia-500/30 blur-[200px] rounded-full"></div>
        <div className="absolute top-[280px] right-[100px] w-[250px] h-[250px] bg-pink-400/25 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[200px] left-[150px] w-[250px] h-[250px] bg-violet-400/20 blur-[100px] rounded-full"></div>
      </div>

      <Header />

      <main
        className={`flex flex-col items-center justify-start w-full 
        px-4 sm:px-6 z-10 pt-24 sm:pt-28 pb-20 transition-opacity duration-700 ${
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

        main {
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
