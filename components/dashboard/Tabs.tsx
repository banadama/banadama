"use client";

import { useState } from "react";

type TabItem = { id: string; label: string };

export default function Tabs({ items }: { items: TabItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  return (
    <div>
      <nav className="flex gap-2 mb-4 flex-wrap">
        {items.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-3 py-1 rounded-md text-sm ${
              active === t.id
                ? "bg-black text-white"
                : "bg-white border text-slate-700"
            }`}>
            {t.label}
          </button>
        ))}
      </nav>

      <div className="p-4 bg-white rounded-md border">
        <p className="text-sm text-slate-600">Content for: <strong>{items.find(i => i.id === active)?.label}</strong></p>
        <div className="mt-3 text-xs text-slate-500">Placeholder content — implement specific components per tab.</div>
      </div>
    </div>
  );
}
