import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="z-10 py-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
      <div className="flex items-center gap-2">
        <span>© {new Date().getFullYear()} ANK Studio — Beauty Academy</span>
        <span className="text-gray-400 dark:text-gray-600">•</span>
        <span className="flex items-center gap-1">
          Made with
          <Heart className="w-4 h-4 text-rose-500 animate-pulse" fill="currentColor" />
          by{" "}
          <a
            href="https://t.me/mosaert"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-pink-500 hover:text-rose-600 transition-colors"
          >
            @mosaert
          </a>
        </span>
      </div>
    </footer>
  );
}
