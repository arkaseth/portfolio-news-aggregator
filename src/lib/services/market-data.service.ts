import { YahooFinanceProvider } from "@/lib/providers/yahoo-finance.provider";
import type { MarketData } from "@/lib/types";

export class MarketDataService {
  private provider = new YahooFinanceProvider();

  async getQuote(ticker: string): Promise<MarketData> {
    return this.provider.fetchQuote(ticker);
  }

  async getQuotes(tickers: string[]): Promise<MarketData[]> {
    if (tickers.length === 0) return [];
    return this.provider.fetchQuotes(tickers);
  }

  async searchTicker(query: string) {
    return this.provider.searchTicker(query);
  }
}
