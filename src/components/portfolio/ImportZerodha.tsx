"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";

interface ImportZerodhaProps {
  onSuccess: () => void;
}

export function ImportZerodha({ onSuccess }: ImportZerodhaProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleImport() {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/zerodha", { method: "POST" });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Import failed");
      }

      setMessage(json.message ?? "Imported successfully");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title="Import from Zerodha">
      <p className="mb-4 text-sm text-gray-600">
        Fetch your portfolio holdings directly from Zerodha using the Kite API.
        Set <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">ZERODHA_API_KEY</code> and{" "}
        <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">ZERODHA_ACCESS_TOKEN</code> in .env.
      </p>

      <button
        onClick={handleImport}
        disabled={loading}
        className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
      >
        {loading ? "Importing..." : "Import Holdings"}
      </button>

      {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </Card>
  );
}
