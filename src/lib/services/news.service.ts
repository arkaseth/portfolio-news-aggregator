import { GNewsProvider } from "@/lib/providers/gnews.provider";
import type { NewsArticle } from "@/lib/types";

export class NewsService {
  private provider = new GNewsProvider();

  async getNewsForTickers(
    tickers: string[],
    maxPerTicker = 5
  ): Promise<NewsArticle[]> {
    if (tickers.length === 0) return [];
    return this.provider.fetchNews(tickers, maxPerTicker);
  }
}
