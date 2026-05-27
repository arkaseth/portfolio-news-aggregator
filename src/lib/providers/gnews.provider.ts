import type { NewsArticle } from "@/lib/types";
import { NSE_SUFFIX } from "@/lib/utils/constants";

interface GNewsArticle {
  title: string;
  description: string;
  url: string;
  source: { name: string };
  publishedAt: string;
  image?: string;
}

interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

export class GNewsProvider {
  private apiKey: string;
  private baseUrl = "https://gnews.io/api/v4";

  constructor() {
    const key = process.env.GNEWS_API_KEY;
    if (!key) {
      console.warn("GNEWS_API_KEY not set — news fetching will be degraded");
    }
    this.apiKey = key ?? "";
  }

  async fetchNews(
    tickers: string[],
    maxPerTicker = 5
  ): Promise<NewsArticle[]> {
    if (!this.apiKey) return [];

    const allArticles: NewsArticle[] = [];

    for (const ticker of tickers) {
      const cleanTicker = ticker.replace(NSE_SUFFIX, "");
      const companyName = cleanTicker;
      const url = `${this.baseUrl}/search?q=${encodeURIComponent(companyName)}&lang=en&country=in&max=${maxPerTicker}&apikey=${this.apiKey}`;

      try {
        const res = await fetch(url, { next: { revalidate: 1800 } });
        if (!res.ok) continue;

        const data: GNewsResponse = await res.json();
        const articles = (data.articles ?? []).map((a) => ({
          title: a.title,
          description: a.description,
          url: a.url,
          source: a.source.name,
          publishedAt: a.publishedAt,
          imageUrl: a.image,
          ticker: cleanTicker,
        }));

        allArticles.push(...articles);
      } catch {
        continue;
      }
    }

    return allArticles;
  }
}
