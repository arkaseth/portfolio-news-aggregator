import type { HoldingInput } from "@/lib/types";

interface ZerodhaHolding {
  tradingsymbol: string;
  exchange: string;
  quantity: number;
  buy_price: number;
  last_price: number;
  product: string;
}

interface ZerodhaResponse {
  status: string;
  data?: ZerodhaHolding[];
}

export class ZerodhaProvider {
  private apiKey: string;
  private accessToken: string;

  constructor() {
    this.apiKey = process.env.ZERODHA_API_KEY ?? "";
    this.accessToken = process.env.ZERODHA_ACCESS_TOKEN ?? "";
  }

  isConfigured(): boolean {
    return !!(this.apiKey && this.accessToken);
  }

  async fetchHoldings(): Promise<HoldingInput[]> {
    if (!this.isConfigured()) {
      throw new Error("Zerodha not configured. Set ZERODHA_API_KEY and ZERODHA_ACCESS_TOKEN");
    }

    const res = await fetch(
      "https://api.kite.trade/portfolio/holdings",
      {
        headers: {
          "X-Kite-Version": "3",
          Authorization: `token ${this.apiKey}:${this.accessToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Zerodha API error: ${res.status} ${res.statusText}`);
    }

    const json: ZerodhaResponse = await res.json();
    if (json.status !== "success" || !json.data) {
      throw new Error("Zerodha API returned unsuccessful status");
    }

    return json.data.map((h) => ({
      ticker: h.tradingsymbol,
      name: h.tradingsymbol,
      type: "STOCK" as const,
      quantity: h.quantity,
      buyPrice: h.buy_price,
      sector: "",
    }));
  }
}
