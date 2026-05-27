import { prisma } from "@/lib/db/prisma";
import type { HoldingInput, HoldingResponse } from "@/lib/types";

function toResponse(h: {
  id: string;
  ticker: string;
  name: string;
  type: string;
  quantity: number;
  buyPrice: number;
  sector: string;
  createdAt: Date;
  updatedAt: Date;
}): HoldingResponse {
  return {
    id: h.id,
    ticker: h.ticker,
    name: h.name,
    type: h.type as "STOCK" | "MF",
    quantity: h.quantity,
    buyPrice: h.buyPrice,
    sector: h.sector,
    createdAt: h.createdAt.toISOString(),
    updatedAt: h.updatedAt.toISOString(),
  };
}

export class PortfolioService {
  async getAll(): Promise<HoldingResponse[]> {
    const holdings = await prisma.holding.findMany({
      orderBy: { createdAt: "desc" },
    });
    return holdings.map(toResponse);
  }

  async getById(id: string): Promise<HoldingResponse | null> {
    const h = await prisma.holding.findUnique({ where: { id } });
    return h ? toResponse(h) : null;
  }

  async create(data: HoldingInput): Promise<HoldingResponse> {
    const h = await prisma.holding.create({
      data: {
        ticker: data.ticker.toUpperCase(),
        name: data.name,
        type: data.type,
        quantity: data.quantity,
        buyPrice: data.buyPrice,
        sector: data.sector ?? "",
      },
    });
    return toResponse(h);
  }

  async createMany(data: HoldingInput[]): Promise<HoldingResponse[]> {
    const created = await prisma.holding.createManyAndReturn({
      data: data.map((d) => ({
        ticker: d.ticker.toUpperCase(),
        name: d.name,
        type: d.type,
        quantity: d.quantity,
        buyPrice: d.buyPrice,
        sector: d.sector ?? "",
      })),
    });
    return created.map(toResponse);
  }

  async update(
    id: string,
    data: Partial<HoldingInput>
  ): Promise<HoldingResponse | null> {
    const existing = await prisma.holding.findUnique({ where: { id } });
    if (!existing) return null;

    const h = await prisma.holding.update({
      where: { id },
      data: {
        ...(data.ticker && { ticker: data.ticker.toUpperCase() }),
        ...(data.name && { name: data.name }),
        ...(data.type && { type: data.type }),
        ...(data.quantity !== undefined && { quantity: data.quantity }),
        ...(data.buyPrice !== undefined && { buyPrice: data.buyPrice }),
        ...(data.sector !== undefined && { sector: data.sector }),
      },
    });
    return toResponse(h);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.holding.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async getTickers(): Promise<string[]> {
    const holdings = await prisma.holding.findMany({
      select: { ticker: true },
      distinct: ["ticker"],
    });
    return holdings.map((h) => h.ticker);
  }
}
