// src/hooks/usePlatform.js
import { useState, useEffect } from "react";

const API_URL =
  import.meta.env.VITE_PLATFORM_API_URL || "https://pltfrm.up.railway.app";

// Витягуємо slug з URL:
// /ankstudio/login → "ankstudio"
// /login → null (без мультитенанта)
export function getCurrentSlug() {
  if (typeof window === "undefined") return null;

  const segments = window.location.pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const first = segments[0];

  // Якщо перший сегмент уже є route (login/admin/profile) — slug нема
  if (["login", "admin", "profile"].includes(first)) {
    return null;
  }

  return first;
}

export function usePlatform() {
  const [platform, setPlatform] = useState(null);
  const [slug, setSlug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const s = getCurrentSlug();
    setSlug(s);

    // Якщо slug нема – працюємо як “одиночний” сайт (типу просто ankstudio.online)
    if (!s) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_URL}/platforms/${s}`);
        if (!res.ok) {
          throw new Error("Platform not found");
        }

        const data = await res.json();
        setPlatform(data);

        if (data?.name) {
          document.title = data.name;
        }
      } catch (err) {
        console.error("Platform load error:", err);
        setError("Платформу не знайдено або вона вимкнена.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { platform, slug, loading, error };
}
