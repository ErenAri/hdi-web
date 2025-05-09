'use client';

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import CountrySidebar from "../../components/CountrySidebar";

interface HdiPoint {
  year: number;
  hdi: number;
  predicted: boolean;
}

export default function Home() {
  const [countryInput, setCountryInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [chartData, setChartData] = useState<HdiPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const countries = [
    "Türkiye", "Turkey", "Germany", "France", "USA", "Norway",
    "Sweden", "Finland", "Japan", "Iceland"
  ];

  useEffect(() => {
    if (countryInput.length < 1) {
      setSuggestions([]);
      return;
    }
    const filtered = countries.filter(c =>
      c.toLowerCase().includes(countryInput.toLowerCase())
    );
    setSuggestions(filtered);
  }, [countryInput, countries]);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setChartData([]);

    try {
      const response = await fetch('https://hdi-api.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: countryInput })
      });

      const result = await response.json();
      console.log("📦 Gelen veri:", result);

      if (!response.ok) {
        setError(result.error || "Bir hata oluştu");
      } else {
        setChartData(result.data);
      }
    } catch (err: any) {
      setError("API bağlantı hatası: " + err.message);
    }

    setLoading(false);
  };

  function getHDILevel(hdi: number): string {
    if (hdi >= 0.8) return "Very High";
    if (hdi >= 0.7) return "High";
    if (hdi >= 0.55) return "Medium";
    return "Low";
  }

  function getHDIStyle(hdi: number): string {
    if (hdi >= 0.8) return "bg-green-100 border-green-400 text-green-800";
    if (hdi >= 0.7) return "bg-blue-100 border-blue-400 text-blue-800";
    if (hdi >= 0.55) return "bg-yellow-100 border-yellow-400 text-yellow-800";
    return "bg-red-100 border-red-400 text-red-800";
  }

  return (
    <div className="flex">
      <CountrySidebar onSelect={setCountryInput} />
      <main className="min-h-screen flex-1 bg-gray-100 p-6 font-sans text-gray-800">
        <h1 className="text-3xl font-bold mb-4 text-black">🌍 HDI Tahmini</h1>

        <input
          type="text"
          value={countryInput}
          onChange={(e) => setCountryInput(e.target.value)}
          placeholder="Ülke seçin..."
          className="border p-2 w-full rounded text-gray-900"
        />

        {suggestions.length > 0 && (
          <ul className="border rounded mt-1 bg-white shadow-md text-gray-800">
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setCountryInput(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-3 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Tahmin ediliyor..." : "Tahmin Et"}
        </button>

        {error && <p className="text-red-600 mt-4">{error}</p>}

        {Array.isArray(chartData) && chartData.length > 0 && (
          <>
            <div className="mt-6 space-y-3">
              {chartData.slice(-3).map((d) => (
                <div
                  key={d.year}
                  className={`p-4 border rounded shadow-sm ${getHDIStyle(d.hdi)}`}
                >
                  <strong className="text-black">{d.year}:</strong> {d.hdi}
                  <span className="ml-2 text-sm italic">
                    ({getHDILevel(d.hdi)} {d.predicted ? "- Tahmini" : ""})
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2 text-black">📈 HDI Geçmiş + Tahmin Grafiği</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[0.4, 1]} />
                  <Tooltip formatter={(value: number) => [`${value}`, 'HDI']} />
                  <Line
                    type="monotone"
                    dataKey="hdi"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
