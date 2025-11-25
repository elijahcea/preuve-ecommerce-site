import { Prisma } from "../generated/prisma/client";

export type ProductOption = {
  name: string;
  slug: string;
  values: string[];
};

export type VariantSelectedOption = {
  name: string;
  value: string;
};

export type ProductVariantForDisplay = {
  id: string;
  sku: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl: string | null;
  selectedOptions: VariantSelectedOption[];
};

export type ProductForDisplay = {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  baseStock: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Transformed/computed fields
  options: string[];  // ["Color", "Size"]
  optionsWithValues: ProductOption[];  // [{ name: "Color", slug: "color", values: [...] }]
  variants: ProductVariantForDisplay[];
};