import YahooFinance from "yahoo-finance2";
import type { MarketData } from "@/lib/types";
import { NSE_SUFFIX } from "@/lib/utils/constants";

const yahooFinance = new YahooFinance();

export class YahooFinanceProvider {
  async fetchQuote(ticker: string): Promise<MarketData> {
    const symbol = ticker.includes(".") ? ticker : `${ticker}${NSE_SUFFIX}`;
    const quote = await yahooFinance.quote(symbol);

    return {
      ticker,
      name: quote.shortName ?? quote.longName ?? ticker,
      currentPrice: quote.regularMarketPrice ?? 0,
      change: quote.regularMarketChange ?? 0,
      changePercent: quote.regularMarketChangePercent ?? 0,
      dayHigh: quote.regularMarketDayHigh ?? 0,
      dayLow: quote.regularMarketDayLow ?? 0,
      volume: quote.regularMarketVolume ?? 0,
      marketCap: quote.marketCap ?? undefined,
      peRatio: quote.trailingPE ?? undefined,
      dividendYield: quote.trailingAnnualDividendYield
        ? quote.trailingAnnualDividendYield * 100
        : undefined,
      week52High: quote.fiftyTwoWeekHigh ?? undefined,
      week52Low: quote.fiftyTwoWeekLow ?? undefined,
    };
  }

  async fetchQuotes(tickers: string[]): Promise<MarketData[]> {
    const results = await Promise.allSettled(
      tickers.map((t) => this.fetchQuote(t))
    );
    return results
      .filter((r) => r.status === "fulfilled")
      .map((r) => (r as PromiseFulfilledResult<MarketData>).value);
  }

  async searchTicker(
    query: string
  ): Promise<{ symbol: string; name: string }[]> {
    const results = await yahooFinance.search(query);
    return (results.quotes ?? [])
      .filter((q): q is typeof q & { symbol: string; shortname: string } =>
        !!q.symbol && !!q.shortname
      )
      .slice(0, 10)
      .map((q) => ({
        symbol: q.symbol.replace(NSE_SUFFIX, ""),
        name: q.shortname,
      }));
  }
}
