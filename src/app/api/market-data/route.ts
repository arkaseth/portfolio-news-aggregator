import { NextRequest } from "next/server";
import { MarketDataService } from "@/lib/services/market-data.service";

const marketDataService = new MarketDataService();

export async function GET(request: NextRequest) {
  try {
    const ticker = request.nextUrl.searchParams.get("ticker");
    const query = request.nextUrl.searchParams.get("query");

    if (query) {
      const results = await marketDataService.searchTicker(query);
      return Response.json({ data: results });
    }

    if (ticker) {
      const quote = await marketDataService.getQuote(ticker);
      return Response.json({ data: quote });
    }

    return Response.json(
      { error: "Provide ticker or query parameter" },
      { status: 400 }
    );
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
