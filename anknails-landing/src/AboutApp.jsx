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
      bg-gradient-to-b from-[#fdf5ff] via-[#fff] to-[#fef7fb]
      dark:from-[#141015] dark:via-[#1c1720] dark:to-[#141015]
      text-gray-900 dark:text-white"
    >
      {/* 💫 М’які розмиті плями */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-pink-200/25 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-150px] right-[-100px] w-[600px] h-[600px] bg-fuchsia-200/20 blur-[180px] rounded-full"></div>
        <div className="absolute top-[250px] right-[150px] w-[250px] h-[250px] bg-violet-200/25 blur-[100px] rounded-full"></div>
      </div>

      <Header />

      <main
        className={`flex flex-col items-center justify-start w-full 
        px-4 sm:px-6 z-10 pt-24 sm:pt-28 pb-20 transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="space-y-4 sm:space-y-6 w-full max-w-4xl text-center">
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
