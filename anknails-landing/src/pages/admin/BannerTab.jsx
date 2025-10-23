import { useEffect, useState } from "react";
import { UploadCloud } from "lucide-react";

export default function BannerTab({ darkMode, i18n }) {
  const [banner, setBanner] = useState({ title: "", image_url: "", active: true });
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetch("https://anknails-backend-production.up.railway.app/api/banner")
      .then((res) => res.json())
      .then((data) => setBanner(data))
      .catch(() => console.error("Помилка завантаження банера"));
  }, []);

  const uploadToImgur = async () => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      headers: { Authorization: "Client-ID 8f3cb6e4c248b26" },
      body: formData,
    });
    const data = await res.json();
    return data?.data?.link || null;
  };

  const handleSave = async () => {
    setLoading(true);
    let imageUrl = banner.image_url;
    if (file) {
      imageUrl = await uploadToImgur();
      setBanner((b) => ({ ...b, image_url: imageUrl }));
    }

    await fetch("https://anknails-backend-production.up.railway.app/api/banner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: "anka12341",
        banner: { ...banner, image_url: imageUrl },
      }),
    });

    setLoading(false);
    alert(i18n.language === "ru" ? "Баннер обновлён" : "Банер оновлено");
  };

  return (
    <div
      className={`max-w-lg p-6 rounded-2xl border ${
        darkMode
          ? "border-fuchsia-900/30 bg-[#1a0a1f]/70"
          : "border-pink-200 bg-white/70"
      }`}
    >
      <label className="block text-sm font-medium mb-2">
        {i18n.language === "ru" ? "Заголовок баннера" : "Заголовок банера"}
      </label>
      <input
        value={banner.title}
        onChange={(e) => setBanner({ ...banner, title: e.target.value })}
        className="w-full mb-4 px-4 py-2 rounded-xl border border-pink-300 focus:ring-1 focus:ring-pink-500 outline-none"
      />

      <label className="block text-sm font-medium mb-2">
        {i18n.language === "ru"
          ? "Загрузить изображение"
          : "Завантажити зображення"}
      </label>

      <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl border border-dashed border-pink-400 mb-4 cursor-pointer hover:bg-pink-50 transition">
        <UploadCloud className="w-6 h-6 text-pink-500" />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-sm"
        />
        {file && <p className="text-sm opacity-80">{file.name}</p>}
      </div>

      {banner.image_url && (
        <img
          src={banner.image_url}
          alt="Preview"
          className="w-full rounded-xl mb-4 border border-pink-200"
        />
      )}

      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={banner.active}
          onChange={(e) => setBanner({ ...banner, active: e.target.checked })}
        />
        {i18n.language === "ru" ? "Активен" : "Активний"}
      </label>

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:scale-[1.03] transition-all shadow-[0_0_20px_rgba(255,0,128,0.3)]"
      >
        {loading
          ? i18n.language === "ru"
            ? "Сохранение..."
            : "Збереження..."
          : i18n.language === "ru"
          ? "Сохранить"
          : "Зберегти"}
      </button>
    </div>
  );
}
