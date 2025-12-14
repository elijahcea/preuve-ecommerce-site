export type ProductOption = {
  name: string;
  values: string[];
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  sku: string;
  price: number;
  isAvailableForSale: boolean;
  imageUrl: string | null;
  selectedOptions: SelectedOption[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  isAvailableForSale: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Transformed/computed fields
  options: string[];  // ["Color", "Size"]
  optionsWithValues: ProductOption[];  // [{ name: "Color", values: [...] }]
  variants: ProductVariant[];
};

export type Cart = {
  id: string | undefined;
  items: CartItem[];
  totalQuantity: number;
  cost: {
    totalCost: number;
    subtotalCost: number;
    totalTaxAmount: number;
  }
};

export type CartItem = {
  id: string | undefined;
  totalCost: number;
  quantity: number;
  merchandise: Merchandise;
};

export type Merchandise = {
  id: string;
  name: string;
  price: number;
  isAvailableForSale: boolean;
  imageUrl: string | null;
  selectedOptions: SelectedOption[];  
}