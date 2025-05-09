'use client';

import React from "react";

const countries = [
  { name: "Türkiye", flag: "🇹🇷" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "France", flag: "🇫🇷" },
  { name: "USA", flag: "🇺🇸" },
  { name: "Norway", flag: "🇳🇴" },
  { name: "Sweden", flag: "🇸🇪" },
  { name: "Finland", flag: "🇫🇮" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Iceland", flag: "🇮🇸" },
];

type Props = {
  onSelect: (country: string) => void;
};

export default function CountrySidebar({ onSelect }: Props) {
  return (
    <aside className="w-48 bg-white border-r min-h-screen p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Ülkeler</h2>
      <ul className="space-y-2">
        {countries.map((c) => (
          <li
            key={c.name}
            onClick={() => onSelect(c.name)}
            className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
          >
            <span className="text-xl mr-2">{c.flag}</span>
            <span className="text-gray-800">{c.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
