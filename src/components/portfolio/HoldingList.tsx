"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { HoldingResponse } from "@/lib/types";

interface HoldingListProps {
  refreshKey: number;
}

export function HoldingList({ refreshKey }: HoldingListProps) {
  const [holdings, setHoldings] = useState<HoldingResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/holdings");
        const json = await res.json();
        setHoldings(json.data ?? []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [refreshKey]);

  async function deleteHolding(id: string) {
    if (!confirm("Delete this holding?")) return;
    const res = await fetch(`/api/holdings/${id}`, { method: "DELETE" });
    if (res.ok) {
      setHoldings((prev) => prev.filter((h) => h.id !== id));
    }
  }

  if (loading) return <LoadingSpinner text="Loading holdings..." />;

  if (holdings.length === 0) {
    return (
      <Card title="Holdings">
        <p className="text-gray-500">No holdings yet. Add one above or import from Zerodha.</p>
      </Card>
    );
  }

  return (
    <Card title={`Holdings (${holdings.length})`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="pb-2 font-medium">Ticker</th>
              <th className="pb-2 font-medium">Name</th>
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">Qty</th>
              <th className="pb-2 font-medium">Buy Price</th>
              <th className="pb-2 font-medium">Sector</th>
              <th className="pb-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h) => (
              <tr key={h.id} className="border-b border-gray-100">
                <td className="py-2 font-medium text-gray-900">{h.ticker}</td>
                <td className="py-2 text-gray-700">{h.name}</td>
                <td className="py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    h.type === "STOCK" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                  }`}>
                    {h.type}
                  </span>
                </td>
                <td className="py-2 text-gray-700">{h.quantity}</td>
                <td className="py-2 text-gray-700">₹{h.buyPrice.toLocaleString()}</td>
                <td className="py-2 text-gray-500">{h.sector || "-"}</td>
                <td className="py-2">
                  <button
                    onClick={() => deleteHolding(h.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
