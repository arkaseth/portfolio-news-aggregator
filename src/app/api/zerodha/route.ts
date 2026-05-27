import { ZerodhaProvider } from "@/lib/providers/zerodha.provider";
import { PortfolioService } from "@/lib/services/portfolio.service";

const zerodhaProvider = new ZerodhaProvider();
const portfolioService = new PortfolioService();

export async function POST() {
  try {
    if (!zerodhaProvider.isConfigured()) {
      return Response.json(
        { error: "Zerodha not configured. Set ZERODHA_API_KEY and ZERODHA_ACCESS_TOKEN in .env" },
        { status: 400 }
      );
    }

    const holdings = await zerodhaProvider.fetchHoldings();
    const created = await portfolioService.createMany(holdings);

    return Response.json({
      data: created,
      message: `Imported ${created.length} holdings from Zerodha`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Zerodha import failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
