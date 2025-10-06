import Header from "./components/Header";
import Footer from "./components/Footer";
import MasterSection from "./components/MasterSection";

export default function AboutApp() {
  return (
    <div
      className="relative min-h-screen flex flex-col justify-between items-center 
      overflow-x-hidden text-center 
      bg-gradient-to-b from-[#fff2f5] via-[#fff] to-[#fff9fa] 
      dark:from-[#141414] dark:via-[#1b1b1b] dark:to-[#141414]"
    >
      <Header />

      <main className="flex-grow w-full flex flex-col items-center justify-center px-4 sm:px-6 z-10 pt-24 sm:pt-28">
        <div className="space-y-6">
          <MasterSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
