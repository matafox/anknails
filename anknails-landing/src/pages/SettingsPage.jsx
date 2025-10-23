import { useState } from "react";

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [days, setDays] = useState(7);
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://anknails-backend-production.up.railway.app/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: "anka12341", // 👈 твій адмін токен
          email,
          days: Number(days),
          password: password || undefined,
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      setResponse({ error: "Помилка створення акаунта" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-pink-600">Створення тимчасового акаунта</h1>

      <form onSubmit={handleCreateUser} className="space-y-3 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-1">Email користувача:</label>
          <input
            type="email"
            required
            className="w-full border rounded-lg p-2"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Кількість днів дії:</label>
          <input
            type="number"
            min="1"
            max="60"
            className="w-full border rounded-lg p-2"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Пароль (необов’язково):</label>
          <input
            type="text"
            className="w-full border rounded-lg p-2"
            placeholder="якщо залишити пустим — створиться автоматично"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50"
        >
          {loading ? "Створюю..." : "Створити акаунт"}
        </button>
      </form>

      {response && (
        <div className="mt-6 p-3 bg-gray-100 rounded-lg">
          <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
