"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { PortfolioStats as PortfolioStatsType } from "@/lib/types";

interface PortfolioStatsProps {
  refreshKey: number;
}

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function PortfolioStats({ refreshKey }: PortfolioStatsProps) {
  const [stats, setStats] = useState<PortfolioStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/portfolio/stats");
        const json = await res.json();
        setStats(json.data ?? null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [refreshKey]);

  if (loading) return <LoadingSpinner text="Computing stats..." />;
  if (!stats) return null;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Investment"
          value={formatINR(stats.totalInvestment)}
        />
        <StatCard
          label="Current Value"
          value={formatINR(stats.currentValue)}
        />
        <StatCard
          label="Total Returns"
          value={formatINR(stats.totalReturns)}
          change={`${stats.totalReturnsPercent >= 0 ? "+" : ""}${stats.totalReturnsPercent.toFixed(2)}%`}
          positive={stats.totalReturns >= 0}
          negative={stats.totalReturns < 0}
        />
        <StatCard
          label="Top Gainer"
          value={stats.topGainer?.ticker ?? "-"}
          change={stats.topGainer ? `+${stats.topGainer.changePercent.toFixed(2)}%` : undefined}
          positive={true}
        />
      </div>

      {stats.holdings.length > 0 && (
        <Card title="Holdings Performance" className="mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="pb-2 font-medium">Ticker</th>
                  <th className="pb-2 font-medium">Current</th>
                  <th className="pb-2 font-medium">Invested</th>
                  <th className="pb-2 font-medium">Value</th>
                  <th className="pb-2 font-medium">Returns</th>
                  <th className="pb-2 font-medium">Returns %</th>
                </tr>
              </thead>
              <tbody>
                {stats.holdings.map((h) => (
                  <tr key={h.id} className="border-b border-gray-100">
                    <td className="py-2 font-medium text-gray-900">{h.ticker}</td>
                    <td className="py-2 text-gray-700">₹{h.currentPrice.toLocaleString()}</td>
                    <td className="py-2 text-gray-700">{formatINR(h.investment)}</td>
                    <td className="py-2 text-gray-700">{formatINR(h.value)}</td>
                    <td className={`py-2 font-medium ${h.returns >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatINR(h.returns)}
                    </td>
                    <td className={`py-2 font-medium ${h.returnsPercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {h.returnsPercent >= 0 ? "+" : ""}{h.returnsPercent.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {stats.sectorAllocation.length > 0 && (
          <Card title="Sector Allocation">
            {stats.sectorAllocation.map((s) => (
              <div key={s.sector} className="mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{s.sector}</span>
                  <span className="font-medium text-gray-900">{s.percentage.toFixed(1)}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-600"
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </Card>
        )}

        {stats.typeAllocation.length > 0 && (
          <Card title="Asset Allocation">
            {stats.typeAllocation.map((t) => (
              <div key={t.type} className="mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{t.type === "STOCK" ? "Stocks" : "Mutual Funds"}</span>
                  <span className="font-medium text-gray-900">{t.percentage.toFixed(1)}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-purple-600"
                    style={{ width: `${t.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </>
  );
}
