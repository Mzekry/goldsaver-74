
export type GoldType = "Jewelry" | "Coin" | "Bar" | "Pound" | "Sabikah";

export interface GoldRecord {
  id: string;
  type: GoldType;
  karat: 21 | 24;
  quantity: number; // in grams
  purchasePrice: number; // total price
  purchaseDate?: Date;
  shopName?: string;
  company?: string;
  productionCost?: number;
  cashback?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GoldPrice {
  k21: number; // price per gram for 21K
  k24: number; // price per gram for 24K
  lastUpdated: Date;
}
