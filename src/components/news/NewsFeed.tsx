"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { NewsCard } from "@/components/news/NewsCard";
import type { NewsArticle } from "@/lib/types";

interface NewsFeedProps {
  refreshKey: number;
}

export function NewsFeed({ refreshKey }: NewsFeedProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/news");
        const json = await res.json();
        setArticles(json.data?.articles ?? []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [refreshKey]);

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-900">Related News</h2>

      {loading && <LoadingSpinner text="Fetching news..." />}

      {!loading && articles.length === 0 && (
        <Card>
          <p className="text-gray-500">
            No news found. Add holdings and ensure the GNEWS_API_KEY is configured.
          </p>
        </Card>
      )}

      {!loading && articles.length > 0 && (
        <div className="space-y-3">
          {articles.map((article, i) => (
            <NewsCard key={`${article.ticker}-${i}`} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
