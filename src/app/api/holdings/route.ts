import { NextRequest } from "next/server";
import { PortfolioService } from "@/lib/services/portfolio.service";

const portfolioService = new PortfolioService();

export async function GET() {
  try {
    const holdings = await portfolioService.getAll();
    return Response.json({ data: holdings });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch holdings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticker, name, type, quantity, buyPrice, sector } = body;

    if (!ticker || !name || !type || quantity === undefined || buyPrice === undefined) {
      return Response.json(
        { error: "Missing required fields: ticker, name, type, quantity, buyPrice" },
        { status: 400 }
      );
    }

    if (!["STOCK", "MF"].includes(type)) {
      return Response.json(
        { error: "Type must be STOCK or MF" },
        { status: 400 }
      );
    }

    const holding = await portfolioService.create({
      ticker,
      name,
      type,
      quantity: Number(quantity),
      buyPrice: Number(buyPrice),
      sector,
    });

    return Response.json({ data: holding }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: "Failed to create holding" },
      { status: 500 }
    );
  }
}
