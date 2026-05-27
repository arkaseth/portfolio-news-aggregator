"use client";

import { useState, useCallback } from "react";
import { PortfolioStats } from "@/components/portfolio/PortfolioStats";
import { HoldingForm } from "@/components/portfolio/HoldingForm";
import { HoldingList } from "@/components/portfolio/HoldingList";
import { ImportZerodha } from "@/components/portfolio/ImportZerodha";
import { NewsFeed } from "@/components/news/NewsFeed";

export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showImport, setShowImport] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500">Track your portfolio and stay informed</p>
        </div>
        <button
          onClick={() => setShowImport(!showImport)}
          className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
        >
          {showImport ? "Manual Entry" : "Import from Zerodha"}
        </button>
      </div>

      <PortfolioStats refreshKey={refreshKey} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {showImport ? (
            <ImportZerodha onSuccess={handleRefresh} />
          ) : (
            <HoldingForm onSuccess={handleRefresh} />
          )}
          <HoldingList refreshKey={refreshKey} />
        </div>
        <div>
          <NewsFeed refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
}
