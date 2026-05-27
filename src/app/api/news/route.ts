import { NextRequest } from "next/server";
import { NewsService } from "@/lib/services/news.service";
import { PortfolioService } from "@/lib/services/portfolio.service";

const newsService = new NewsService();
const portfolioService = new PortfolioService();

export async function GET(request: NextRequest) {
  try {
    const tickerParam = request.nextUrl.searchParams.get("ticker");
    const max = Number(request.nextUrl.searchParams.get("max")) || 5;

    let tickers: string[];

    if (tickerParam) {
      tickers = tickerParam.split(",").map((t) => t.trim().toUpperCase());
    } else {
      tickers = await portfolioService.getTickers();
    }

    if (tickers.length === 0) {
      return Response.json({ data: { articles: [], total: 0 } });
    }

    const articles = await newsService.getNewsForTickers(tickers, max);
    return Response.json({ data: { articles, total: articles.length } });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
