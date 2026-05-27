import { NextRequest } from "next/server";
import { PortfolioService } from "@/lib/services/portfolio.service";

const portfolioService = new PortfolioService();

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const holding = await portfolioService.getById(id);
    if (!holding) {
      return Response.json({ error: "Holding not found" }, { status: 404 });
    }
    return Response.json({ data: holding });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch holding" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const holding = await portfolioService.update(id, body);

    if (!holding) {
      return Response.json({ error: "Holding not found" }, { status: 404 });
    }

    return Response.json({ data: holding });
  } catch (error) {
    return Response.json(
      { error: "Failed to update holding" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await portfolioService.delete(id);

    if (!deleted) {
      return Response.json({ error: "Holding not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { error: "Failed to delete holding" },
      { status: 500 }
    );
  }
}
