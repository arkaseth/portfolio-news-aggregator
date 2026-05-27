import { StatsService } from "@/lib/services/stats.service";

const statsService = new StatsService();

export async function GET() {
  try {
    const stats = await statsService.getPortfolioStats();
    return Response.json({ data: stats });
  } catch (error) {
    return Response.json(
      { error: "Failed to compute portfolio stats" },
      { status: 500 }
    );
  }
}
