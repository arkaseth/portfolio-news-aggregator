export interface MarketData {
  ticker: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
  volume: number;
  marketCap?: number;
  peRatio?: number;
  dividendYield?: number;
  week52High?: number;
  week52Low?: number;
}

export interface PortfolioStats {
  totalInvestment: number;
  currentValue: number;
  totalReturns: number;
  totalReturnsPercent: number;
  topGainer: { ticker: string; changePercent: number } | null;
  topLoser: { ticker: string; changePercent: number } | null;
  sectorAllocation: { sector: string; percentage: number }[];
  typeAllocation: { type: string; percentage: number }[];
  holdings: (MarketData & {
    id: string;
    quantity: number;
    buyPrice: number;
    investment: number;
    value: number;
    returns: number;
    returnsPercent: number;
  })[];
}
