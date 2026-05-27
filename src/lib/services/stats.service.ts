import { PortfolioService } from "./portfolio.service";
import { MarketDataService } from "./market-data.service";
import type { PortfolioStats, MarketData } from "@/lib/types";

export class StatsService {
  private portfolioService = new PortfolioService();
  private marketDataService = new MarketDataService();

  async getPortfolioStats(): Promise<PortfolioStats> {
    const holdings = await this.portfolioService.getAll();
    const tickers = holdings.map((h) => h.ticker);
    const quotes = await this.marketDataService.getQuotes(tickers);

    const quoteMap = new Map<string, MarketData>(
      quotes.map((q) => [q.ticker, q])
    );

    const enriched = holdings.map((h) => {
      const quote = quoteMap.get(h.ticker);
      const currentPrice = quote?.currentPrice ?? h.buyPrice;
      const investment = h.quantity * h.buyPrice;
      const value = h.quantity * currentPrice;
      const returns = value - investment;
      const returnsPercent = investment > 0 ? (returns / investment) * 100 : 0;

      const { ticker: _t, name: _n, ...rest } = quote ?? ({} as MarketData);

      return {
        id: h.id,
        ticker: h.ticker,
        name: h.name,
        type: h.type,
        quantity: h.quantity,
        buyPrice: h.buyPrice,
        investment,
        value,
        returns,
        returnsPercent,
        sector: h.sector,
        currentPrice,
        change: rest.change ?? 0,
        changePercent: rest.changePercent ?? 0,
        dayHigh: rest.dayHigh ?? 0,
        dayLow: rest.dayLow ?? 0,
        volume: rest.volume ?? 0,
        marketCap: rest.marketCap,
        peRatio: rest.peRatio,
        dividendYield: rest.dividendYield,
        week52High: rest.week52High,
        week52Low: rest.week52Low,
      };
    });

    const totalInvestment = enriched.reduce((s, h) => s + h.investment, 0);
    const currentValue = enriched.reduce((s, h) => s + h.value, 0);
    const totalReturns = currentValue - totalInvestment;
    const totalReturnsPercent =
      totalInvestment > 0 ? (totalReturns / totalInvestment) * 100 : 0;

    const sorted = [...enriched].sort(
      (a, b) => b.returnsPercent - a.returnsPercent
    );
    const topGainer = sorted.length > 0 ? { ticker: sorted[0].ticker, changePercent: sorted[0].returnsPercent } : null;
    const topLoser =
      sorted.length > 1 && sorted[sorted.length - 1].returnsPercent < 0
        ? { ticker: sorted[sorted.length - 1].ticker, changePercent: sorted[sorted.length - 1].returnsPercent }
        : null;

    const sectorMap = new Map<string, number>();
    for (const h of enriched) {
      const sec = h.sector || "Other";
      sectorMap.set(sec, (sectorMap.get(sec) ?? 0) + h.value);
    }
    const sectorAllocation = Array.from(sectorMap.entries())
      .map(([sector, value]) => ({
        sector,
        percentage: currentValue > 0 ? (value / currentValue) * 100 : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage);

    const typeMap = new Map<string, number>();
    for (const h of enriched) {
      typeMap.set(h.type, (typeMap.get(h.type) ?? 0) + h.value);
    }
    const typeAllocation = Array.from(typeMap.entries())
      .map(([type, value]) => ({
        type,
        percentage: currentValue > 0 ? (value / currentValue) * 100 : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage);

    return {
      totalInvestment,
      currentValue,
      totalReturns,
      totalReturnsPercent,
      topGainer,
      topLoser,
      sectorAllocation,
      typeAllocation,
      holdings: enriched,
    };
  }
}
