import Header from "./components/Header";
import Footer from "./components/Footer";
import MasterSection from "./components/MasterSection";
import { useEffect, useState } from "react";

export default function AboutApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-between items-center overflow-hidden bg-gradient-to-b from-[#ffe6eb] via-[#fff] to-[#fff5f7] dark:from-[#1a1a1a] dark:via-[#232323] dark:to-[#1a1a1a] text-center">
      <Header />

      <main
        className={`flex-grow w-full flex flex-col items-center justify-center px-4 z-10 pt-24 sm:pt-28 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="space-y-2">
          <MasterSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
