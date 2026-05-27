export interface HoldingInput {
  ticker: string;
  name: string;
  type: "STOCK" | "MF";
  quantity: number;
  buyPrice: number;
  sector?: string;
}

export interface HoldingResponse {
  id: string;
  ticker: string;
  name: string;
  type: "STOCK" | "MF";
  quantity: number;
  buyPrice: number;
  sector: string;
  createdAt: string;
  updatedAt: string;
}
